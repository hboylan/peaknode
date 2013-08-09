function LightAPI(omni, db)
{
  this.list = function(req, res){
    db.light.list(function(lights){
      res.json(db.light.parse(lights))
    })
  }

  this.show = function(req, res){
    db.light.update(req.params.id, res, function(){});
  }

  this.create = function(req, res){
    var zone = req.body.zone
      , unit = req.body.unit
      , name = req.body.name;
    
    db.light.create({ name:name, unit:unit, zoneId:zone }).
      success(function(l){
        res.status(200).end()
      }).
      error(function(err){
        res.status(400).json(err)
      })
  }

  this.state = function(req, res){
    var state   = req.body.state
      , level   = req.body.level
      , id      = req.params.id;
    
    db.light.update(id, res, function(light){
      if(state == 'on' || state == 'off'){
        omni.light('control', { unit:light.unit, state:['on', 'off'].indexOf(state) })
        light.state = state
      }else if(level >= 0  && level <= 100){
        omni.light('level', { unit:light.unit, level:parseInt(level, 10) })
        light.level = parseInt(level, 10)
      }else
        res.json({ error:'Expected parameters: state (on/off) or level (0-100)' })
    
      light.save().success(function(l){
        res.status(200).end('ok')
      })
    })
  }
  //TODO implement this for bright/dimming functions
  // this.timeout = function(req, res){
  //   var level   = req.body.level
  //     , time    = req.body.time
  //     , id      = req.params.id
  //     , action  = req.params.action;
  // 
  //   db.light.update(id, res, function(light){
  //     if(level >= 0  && level <= 100 && time >= 2 && time <= 99)
  //       if(action == 'dim' || action == 'brighten')
  //         light.step(client, action, level, time);
  //       else
  //         res.status(400).json({ error:'Expected API call: /api/lights/:id/(dim/brighten)' })
  //     else
  //       res.status(400).json({ error:'Expected parameters: time (2-99) and level (0-100)' })
  //   })
  // }
}
exports.API = LightAPI