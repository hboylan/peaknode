var url       = require('url')
  , http      = require('http')
  , query     = require('querystring')
  , serial    = require('serializer')
  , OAuth     = require('oauth').OAuth;

function FitbitClient(api_key, api_secret){
  this.callbackURI = callbackURI,
  this.oauth = new OAuth('http://api.fitbit.com/oauth/request_token',
                      'http://api.fitbit.com/oauth/access_token',
                      api_key, api_secret, '1.0', null, 'HMAC-SHA1', null,
                      {'Accept': '*/*', 'Connection': 'close', 'User-Agent': 'wvupeak'}),
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
  this.oauth.get(this.baseURI + path + '?' + query.stringify(params), token.oauth_token, token.oauth_token_secret, this._requestCallback(callback));
}

FitbitClient.prototype._post = function(path, params, token, callback) {
  this.oauth.post(this.baseURI + path, token.oauth_token, token.oauth_token_secret, params, null, this._requestCallback(callback));
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
    res.cookie('fitbit_client', serializer.stringify({ token_secret:secret }), { path: '/', httpOnly: false })
    res.redirect('http://www.fitbit.com/oauth/authorize?oauth_token=' + token)
  })
}

FitbitClient.prototype.getAccessToken = function(req, res){
  var access = req.session.oauth;
  if(access){
    access.verifier = req.query.oauth_verifier
    try { secret = this.serializer.parse(req.cookies.fitbit_client) } catch(E) {}
    // Access token
    console.log('Token:', access.token)
    console.log('Secret:', access.token_secret)
    console.log('Verifier:', access.verifier)
    this.oauth.getOAuthAccessToken(access.token, access.token_secret, access.verifier,
      function (error, token, secret, other) {
        if(error) return res.status(400).json(error)
        res.status(200).json({oauth_token:token, oauth_token_secret:secret})
    })
  }
  else
    res.status(400).send('Failed to authorize access token')
}

FitbitClient.prototype.user = function(action, req, fn){
  this.apiCall('GET', '/user/'+req.params.uid+'/'+action+'.json', { token:req.cookies.fitbit_client }, fn)
}

module.exports = function(key, secret) { return new FitbitClient(key, secret) };