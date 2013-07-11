var user = require('../config/database').user;

exports.list = function(req, res){
  user.all().success(function(users) {
    users.forEach(function(u){ u = u.parse() });
    res.json(users);
  });
};

exports.show = function(req, res){
  user.find(req.params.id).success(function(user) {
    res.json(user.parse());
  });
};

exports.create = function(req, res) {
  var email = (req.body.email)? req.body.email : null;
  user.create({
    username: req.body.username,
    password: req.body.password,
    pinkey: req.body.pinkey,
    realname: req.body.realname,
    email: email
  }).success(function(user) {
    res.jsonp(201, user.parse());
  }).error(function(err) {
    res.jsonp(400, { error:err.message, params:req.body });
  })
};

exports.login = function(req, res) {
  user.find({ where:{
    username:req.body.username,
    password:req.body.password
  }}).success(function(u){
    res.cookie('user', JSON.stringify(u.parse()));
    res.jsonp(201, { success:true });
  }).error(function(err){
    res.jsonp(400, { error:err.message, params:req.body });
  })
};

exports.logout = function(req, res) {
  res.clearCookie('user', { path: '/' }); 
  res.json({ success:true });
};
