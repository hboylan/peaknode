var url       = require('url')
  , http      = require('http')
  , query     = require('querystring')
  , serial    = require('serializer')
  , OAuth     = require('oauth').OAuth

function FitbitClient(api_key, api_secret){
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

FitbitClient.prototype.userRequest = function(action, token, fn){
  try { token = this.serializer.parse(token) } catch(e){}
  if(token == undefined) fn({ error:'Missing Fitbit Token' })
  else{
    console.log('FITBIT <- /user/-/'+action+'.json', token)
    this.apiCall('GET', '/user/-/'+action+'.json', {token:token}, fn)
  }
}

module.exports = function(key, secret) { return new FitbitClient(key, secret) };