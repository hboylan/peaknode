var fitbit  = require('fitbit-js')('7f4c494ce2864ef5888744b05708e058', '667a1f5d36d3493a870f858be99734ba');

module.exports = function(app){
  
  app.get('/fitbit', function (req, res) {
    fitbit.getAccessToken(req, res, function (error, newToken) {
      console.log(newToken);
      res.json({ success:true })
    });
  });

  app.get('/fitbit/test', function (req, res) {
    fitbitClient.apiCall('GET', '/user/-/activities/date/2011-05-25.json',
      {token: token},
      function(err, resp, json) {
        if (err) return res.send(err, 500);
        res.json(json);
    });
  });
}
