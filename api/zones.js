var zone = require('../config/database').zone;

exports.list = function(req, res) {
  zone.all().success(function(zones){
    res.json(zones);
  });
};

exports.show = function(req, res) {
  zone.find({ where:{ zoneId:req.params.id }}).success(function(zone){
    res.json(zone);
  });
};

exports.create = function(req, res) {
  zone.create({
    name:req.body.name,
    zoneId:req.body.zone
  }).success(function(zone){
    res.json(zone);
  });
};