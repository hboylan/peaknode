var url       = require('url')
  , http      = require('http')
  , query     = require('querystring')
  , serial    = require('serializer')
  , OAuth     = require('oauth').OAuth;

function FitbitClient(api_key, api_secret, User){
  this.updateUser = User.setFitbit
  this.oauth = new OAuth('http://api.fitbit.com/oauth/request_token',
                      'http://api.fitbit.com/oauth/access_token',
                      api_key, api_secret, '1.0', null, 'HMAC-SHA1', null,
                      {'Accept':'*/*', 'Accept-Language':'en_US', 'Connection':'close', 'User-Agent':'wvupeak'}),
  this.serializer = serial.createSecureSerializer(api_key, api_secret),
  this.baseURI = 'http://api.fitbit.com/1';
}

FitbitClient.prototype._requestCallback = function(callback) {
  return function (err, data, response) {
    if (err) return callback(err, data);
    var exception = null;
    try { data = JSON.parse(data); } catch (e) { exception = e; }
    callback(exception, response, data)
  };
}

FitbitClient.prototype._get = function(path, params, token, callback) {
  this.oauth.get(this.baseURI + path + '?' + query.stringify(params), token.token, token.secret, this._requestCallback(callback));
}

FitbitClient.prototype._post = function(path, params, token, callback) {
  this.oauth.post(this.baseURI + path, token.token, token.secret, params, null, this._requestCallback(callback));
}

FitbitClient.prototype.apiCall = function(method, path, params, callback) {
  var token = params.token;
  delete params.token;
  if (method === 'GET') this._get(path, params, token, callback);
  else if (method === 'POST') this._post(path, params, token, callback);
}

FitbitClient.prototype.getRequestToken = function(req, res) {
  var serializer = this.serializer
  // Request token
  this.oauth.getOAuthRequestToken(function (error, token, secret, authorize_url, other) {
    if(error) return res.status(400).json({ error:'Failed to request token' })
    res.redirect('http://www.fitbit.com/oauth/authorize?oauth_token=' + token)
  })
}

FitbitClient.prototype.getAccessToken = function(req, res){
  var token     = req.query.oauth_token
    , verifier  = req.query.oauth_verifier
    , saveCookie = this.cookie, User = this.User;
  // Access token
  this.oauth.getOAuthAccessToken(token, '', verifier,
    function (error, token, secret, other) {
      if(error) return res.status(400).json(error)
      saveCookie(res, token, secret) //client cookie
      User.find(req.params.uid).success(function(user){ //persist in db
        if(user != undefined){
          user.fitbit_token = token
          user.fitbit_secret = secret
          user.save()
        }
      })
      res.status(200).json({oauth_token:token, oauth_token_secret:secret})
  })
}

FitbitClient.prototype.cookie = function(res, token){
  res.cookie('fitbit_client', token, { path: '/', httpOnly: false })
}

FitbitClient.prototype.userRequest = function(action, req, fn){
  var tok = {};
  try { tok = this.serializer.parse(req.cookies.fitbit_client) } catch(e){}
  console.log('FITBIT <- /user/-/'+action+'.json', tok)
  this.apiCall('GET', '/user/-/'+action+'.json', {token:tok}, fn)
}

module.exports = function(key, secret, u) { return new FitbitClient(key, secret, u) };