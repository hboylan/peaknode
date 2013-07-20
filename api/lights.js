var db    = require('../config/database')
  , Light = db.light;

exports.list = function(req, res){
  Light.list(function(lights){
    res.json(Light.parse(lights))
  })
}

exports.create = function(req, res){
  var zone = req.body.zone
    , unit = req.body.unit
    , name = req.body.name;
  
  Light.create({ name:name, unit:unit, zoneId:zone }).success(function(l){
    res.json(l.parse())
  })
}

exports.state = function(req, res){
  var client  = require('../app').client()
    , state   = req.body.state
    , level   = req.body.level
    , id      = req.params.id;
  
  Light.update(id, res, function(light){
    if(state == 'on' || state == 'off')
      light.setState(client, state);
    else if(level >= 0  && level <= 100)
      light.setLevel(client, level);
    else
      res.json({ error:'Expected parameters: state (on/off) or level (0-100)' })
    
    light.save().success(function(light){
      res.json(light.parse())
    })
  })
}

exports.dim = function(req, res){
  var level = req.body.level
    , time  = req.body.time
    , id    = req.params.id;
  res.json({ error:'Function not implemented yet' })
  Light.update(res, function(light){
    
  })
}

exports.brighten = function(req, res){
  var level = req.body.level
    , time  = req.body.time
    , id    = req.params.id;
  res.json({ error:'Function not implemented yet' })  
  Light.find(id).success(function(light){
    
  })
}