var User = require('../lib/database').user;

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
  User.create({
    username: req.body.username,
    password: req.body.password,
    pinkey: req.body.pinkey,
    realname: req.body.realname,
    email: req.body.email
  }).success(function(user) {
    res.jsonp(201, user.parse(true));
  }).error(function(err) {
    res.jsonp(400, { error:err.message, params:req.body });
  })
}

exports.login = function(req, res) {
  User.logout(res);
  User.find({ where:{ username:req.body.username, password:req.body.password }})
    .success(function(u){
      if(u == undefined)  return res.json({ error:'Invalid user' });
      u = u.parse(true);
      res.cookie('user', u);
      res.json(u);
    })
    .error(function(err){
      res.json({ error:'Invalid username/password' });
    })
}

exports.logout = function(req, res) {
  User.logout(res);
  res.json({ success:true });
}
