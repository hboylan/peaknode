exports.index = function(req, res){
  res.send({ title: 'WVU Peak', user: 'hjboylan' });
};

exports.message = function(req, res){
  var client  = require('../app').client()
    , msg     = req.body.message;
  client.send(msg);
  res.send('Sent: '+msg);
};