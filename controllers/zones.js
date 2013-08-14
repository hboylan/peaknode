function ZoneAPI(db)
{
  var config = require('../config.json')
  
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
    db.resync()
  }
}
exports.API = ZoneAPI