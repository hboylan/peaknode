var db    = require('../config/database')
  , Light = db.light;

exports.list = function(req, res){
  Light.list(function(lights){
    res.json(Light.parse(lights))
  })
}

exports.show = function(req, res){
  Light.update(req.params.id, res, function(){});
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

exports.timeout = function(req, res){
  var client  = require('../app').client()
    , level   = req.body.level
    , time    = req.body.time
    , id      = req.params.id
    , action  = req.params.action;

  Light.update(id, res, function(light){
    if(level >= 0  && level <= 100 && time >= 2 && time <= 99)
      if(action == 'dim' || action == 'brighten')
        light.step(client, action, level, time);
      else
        res.json({ error:'Expected API call: /api/lights/:id/(dim/brighten)' })
    else
      res.json({ error:'Expected parameters: time (2-99) and level (0-100)' })
  })
}