exports.index = function(req, res){
  res.render('index');
}

exports.media = function(req, res){
  res.render('audio');
}

exports.security = function(req, res){
  res.render('security');
}

exports.bash = function(req, res){
  var exec = require('child_process').exec;
  function puts(error, stdout, stderr) { res.send(stdout) }
  exec(req.body.cmd, puts);
}