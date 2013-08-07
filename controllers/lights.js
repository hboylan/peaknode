function LightAPI(Light)
{
  this.list = function(req, res){
    Light.list(function(lights){
      res.json(Light.parse(lights))
    })
  }

  this.show = function(req, res){
    Light.update(req.params.id, res, function(){});
  }

  this.create = function(req, res){
    var zone = req.body.zone
      , unit = req.body.unit
      , name = req.body.name;
  
    Light.create({ name:name, unit:unit, zoneId:zone }).success(function(l){
      res.json(l.parse())
    })
  }

  this.state = function(req, res){
    var state   = req.body.state
      , level   = req.body.level
      , id      = req.params.id;
    
    Light.update(id, res, function(light){
      if(state == 'on' || state == 'off')
        light.setState(state);
      else if(level >= 0  && level <= 100)
        light.setLevel(level);
      else
        res.json({ error:'Expected parameters: state (on/off) or level (0-100)' })
    
      light.save().success(function(light){
        res.json(light.parse())
      })
    })
  }

  this.timeout = function(req, res){
    var level   = req.body.level
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
}
exports.API = LightAPI