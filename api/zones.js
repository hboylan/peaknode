var zone = require('../config/database').zone;

exports.list = function(req, res) {
  zone.all().success(function(zones){
    zones.forEach(function(z){
      z = z.parse();
    });
    res.json(zones);
  });
};

exports.show = function(req, res) {
  zone.find({ where:{ zoneId:req.params.id }}).success(function(zone){
    res.json(zone.parse());
  });
};

exports.create = function(req, res) {
  zone.create({
    name:req.body.name,
    zoneId:req.body.zone
  }).success(function(zone){
    res.json(zone.parse());
  });
};