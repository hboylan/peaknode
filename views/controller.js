exports.index = function(req, res){
  res.render('index');
};

exports.hvac = function(req, res){
  res.render('hvac', {auth:true});
};

exports.media = function(req, res){
  res.render('audio');
};

exports.energy = function(req, res){
  res.render('energy');
};

exports.register = function(req, res){
  res.render('user/register');
};

exports.bash = function(req, res){
  var exec = require('child_process').exec;
  function puts(error, stdout, stderr) { res.send(stdout) }
  exec(req.body.cmd, puts);
};

exports.test = function(req, res){
  var client = require('../app').client();
  client.send('getobjectstatus Audio_Zone 1');
  res.send('cool');
};

exports.bryant = function(req, res){
  res.json({
    'message':'Hello Bryant!',
  });
};

exports.message = function(req, res){
  var client  = require('../app').client()
    , msg     = req.body.message;
  client.send(msg);
  res.send('Sent: '+msg);
};