var db    = require('../config/database')
  , Light = db.light;

exports.list = function(req, res){
  Light.list(function(lights){
    lights.forEach(function(l){ l = l.parse(); })
    res.json(lights);
  })
}

exports.create = function(req, res){
  var zone = req.body.zone
    , unit = req.body.unit
    , name = req.body.name;
  
  Light.create({ name:name, unit:unit, zoneId:zone })
    .success(function(l){
      res.json(l.parse());
    })
}