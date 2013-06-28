var ejs = require('ejs');

exports.index = function(req, res){
  res.render('../views/index.ejs', { message:"Hello" });
};

exports.bash = function(req, res){
  var exec = require('child_process').exec;
  function puts(error, stdout, stderr) { res.send(stdout) }
  exec(req.body.cmd, puts);
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