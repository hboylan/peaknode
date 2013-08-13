function ZoneAPI(db)
{
  var config = require('../config.json')

  function syncZones(zones){
    if(!zones.length) return;
    db.zone.create({ name:zones.pop() }).success(function(){ syncZones(zones) })
  }
  function syncAudio(audio){
    if(!audio.length) return;
    var a = audio.pop();
    db.audio.create({ name:a.name, zoneId:a.zone }).success(function(){ syncAudio(audio) })
  }
  function syncLights(lights){
    if(!lights.length) return;
    var l = lights.pop();
    db.light.create({ name:l.name, unit:l.unit, zoneId:l.zone }).success(function(){ syncLights(lights) })
  }

  this.list = function(req, res) {
    db.zone.all().success(function(zones){
      res.json(db.zone.parse(zones));
    })
  }

  this.show = function(req, res) {
    db.zone.find(req.params.id).success(function(zone){
      if(zone == undefined) return res.json({ error:'Invalid zone'});
    
      db.audio.findAll({ where:{ zoneId:zone.id }}).success(function(audioZones){
        Light.findAll({ where:{ zoneId:zone.id }}).success(function(lights){
          res.json({
            id:zone.id,
            name:zone.name,
            audio:Audio.parse(audioZones),
            lights:Light.parse(lights)
          })
        })
      })
    })
  }

  this.resync = function(req, res) {
    if(req.query.username != config.username || req.query.password != config.password)
      return res.json({ error:'Invalid credentials' })

    //Drop the table and resync with config file
    db.zone.drop().success(function(){
      db.zone.sync().success(function(){
        zones = config.zones;
        syncZones(zones.reverse())
    
        //Drop the table and resync with config file
        db.audio.drop().success(function(){
          db.audio.sync().success(function(){
            audio = config.audio
            syncAudio(audio.reverse())
            
            db.light.drop().success(function(){
              db.light.sync().success(function(){
                lights = config.lights;
                syncLights(lights.reverse())
            
                res.json({ success:true })
              })
            })
          })
        })
      })
    })
  }
}
exports.API = ZoneAPI