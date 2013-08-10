function LightAPI(omni, db)
{
  this.list = function(req, res){
    db.zone.all({ include:[db.light] }).success(function(zones){
      var lights = []
      zones.forEach(function(z){
        lights.push({
          id:z.id,
          name:z.name,
          lights:(z.lights == undefined)? [] : db.light.parse(z.lights)
        })
      })
      res.json(lights)
    })
  }

  this.show = function(req, res){
    db.light.update(req.params.id, res, function(){});
  }

  this.state = function(req, res){
    var toggle  = req.body.toggle
      , level   = req.body.level
      , id      = req.body.id
    
    db.light.update(id, res, function(light){
      if(toggle){
        omni.light('control', { unit:light.unit, state:light.on? 0:1 })
        light.on = !light.on
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