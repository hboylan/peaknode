var user = require(__dirname + '/../config/models').user;

exports.list = function(req, res){
  user.all().success(function(user) {
    res.jsonp(user);
  });
};

exports.show = function(req, res){
  user.find({ where: { id: req.params.id }}).success(function(user) {
    res.jsonp(user);
  })
};

exports.create = function(req, res) {
  user.create({
    username: req.body.username,
    realname: req.body.realname,
    email: req.body.email
  }).success(function(user) {
    res.jsonp(201, user);
  }).error(function(errors) {
    res.jsonp(400, { error: errors.message});
  });
};
