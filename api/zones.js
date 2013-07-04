var zones = require('../config/database').zone;

exports.list = function(req, res) {
  zones.all().success(function(zones){
    res.json(zones);
  });
};

exports.show = function(req, res) {
  zones.find({ where:{ id:req.params.id }}).success(function(zone){
    res.json(zone);
  });
};

exports.create = function(req, res) {
  zones.create({
    name:req.body.name
  }).success(function(zone){
    res.json(zone);
  });
};