var User = require('../config/database').user;

exports.list = function(req, res){
  User.all().success(function(users) {
    users.forEach(function(u){ u = u.parse() });
    res.json(users);
  });
}

exports.show = function(req, res){
  User.find(req.params.id).success(function(user) {
    res.json(user.parse());
  });
}

exports.create = function(req, res) {
  var email = (req.body.email)? req.body.email : null;
  User.create({
    username: req.body.username,
    password: req.body.password,
    pinkey: req.body.pinkey,
    realname: req.body.realname,
    email: email
  }).success(function(user) {
    res.jsonp(201, user.parse(true));
  }).error(function(err) {
    res.jsonp(400, { error:err.message, params:req.body });
  })
}

exports.login = function(req, res) {
  User.logout(res);
  User.login(res, req.body.username, req.body.password, function(u){
    u = u.parse(true);
    res.cookie('user', u);
    res.json({ success:true, user:u });
  });
}

exports.logout = function(req, res) {
  User.logout(res);
  res.json({ success:true });
}
