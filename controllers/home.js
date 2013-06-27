exports.index = function(req, res){
  res.send({ title: 'WVU Peak', user: 'hjboylan' });
};

exports.connect = function(req, res){
  var client  = require('../app').client()
    , msg     = req.query.message;
  client.send(msg);
  res.send('Sent: '+msg);
};