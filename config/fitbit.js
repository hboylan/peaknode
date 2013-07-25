var config  = require('./config.json')
  , fitbit  = require('fitbit-js')(config.fitbit_key, config.fitbit_secret);

module.exports = function(app){
  
  app.get('/api/fitbit', function(req, res){
    fitbit.getAccessToken(req, res, function(err, token){
      res.json({ success:true, token:token })
    })
  })
  
  app.get('/api/fitbit/test', function (req, res) {
    fitbit.apiCall('GET', '/user/26RNTZ/profile.json', { token:req.cookies.fitbit_client },
      function(err, resp, json) {
        if(err) res.send(err, 500);
        res.json(json)
    })
  })
}