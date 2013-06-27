var user = require('../config/database').user;

exports.list = function(req, res){
  user.all().success(function(user) {
    res.jsonp(user);
  });
};

exports.show = function(req, res){
  user.find({ where: { id: req.params.id }}).success(function(user) {
    res.jsonp(user.parse());
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
  }).error(function(errors) {
    res.jsonp(400, { error: errors.message, params:req.body });
  });
};

exports.login = function(req, res) {
  user.find({ where:{
    username:req.body.username,
    password:req.body.password
  }}).success(function(user){
    res.json({ success:true, user:user.parse() });
  });
};
