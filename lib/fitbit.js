var url       = require('url')
  , http      = require('http')
  , query     = require('querystring')
  , serial    = require('serializer')
  , OAuth     = require('oauth').OAuth;

function FitbitClient(api_key, api_secret, callbackURI){
  this.callbackURI = callbackURI,
  this.oauth = new OAuth('http://api.fitbit.com/oauth/request_token',
                      'http://api.fitbit.com/oauth/access_token',
                      api_key, api_secret, '1.0', callbackURI, 'HMAC-SHA1', null,
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

FitbitClient.prototype.getAccessToken = function(req, res, callback) {
  var sess, serializer = this.serializer;
  if(req.cookies && req.cookies.fitbit_client)
    try { sess = serializer.parse(req.cookies.fitbit_client) } catch(E) { }
  var access_token = req.query.oauth_token
    , has_token   = access_token
    , has_secret  = sess && sess.token_secret;
  console.log(access_token)
  if(has_token &&  has_secret) // Access token
    this.oauth.getOAuthAccessToken(qs.oauth_token, sess.token_secret, req.query.oauth_verifier,
      function (error, token, secret, other) {
        if(error) return callback(error, null);
        callback(null, { oauth_token:token, oauth_token_secret:secret });
    })
  else // Request token
    this.oauth.getOAuthRequestToken({ oauth_callback:'http://157.182.194.137:8000/fitbit' },
      function (error, token, secret, authorize_url, other) {
        if(error) return callback(error, null);
        res.cookie('fitbit_client', serializer.stringify({ token_secret:secret }), { path: '/', httpOnly: false })
        res.redirect('http://www.fitbit.com/oauth/authorize?oauth_token=' + token)
    })
}

FitbitClient.prototype.user = function(action, req, fn){
  this.apiCall('GET', '/user/'+req.params.uid+'/'+action+'.json', { token:req.cookies.fitbit_client }, fn)
}

module.exports = function(key, secret) { return new FitbitClient(key, secret) };