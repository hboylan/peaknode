function LightAPI(db, omni)
{
  this.list = function(req, res){
    db.zone.all({ order:'id ASC', include:[db.light] }).success(function(zones){
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
  
  this.state = function(req, res){
    var toggle  = req.body.toggle
      , level   = req.body.level
      , id      = req.body.id
    
    db.light.find(id).success(function(light){
      if(light == undefined) return res.status(401).json({ error:'Invalid light' });
      if(toggle)
      {
        omni.light('control', { unit:light.unit, state:light.on? 0:1 })
        light.updateAttributes({ on:!light.on, level:light.on? light.defaultLevel:0 })
      }
      else if(level >= 0  && level <= 100)
      {
        omni.light('level', { unit:light.unit, level:parseInt(level, 10) })
        light.updateAttributes({ on:level > 0? true:false, level:parseInt(level, 10)})
      }
      else
        res.json({ error:'Expected parameters: state (on/off) or level (0-100)' })
    
      // db.light_archive.create({ state:light.on, level:light.level, lightId:light.id }).success(function(archive){
        res.send()
      // })
    })
  }
}
module.exports = function(d, c){ return new LightAPI(d, c) }