function ZoneAPI(Zone, Audio, Light)
{
  var config = require('../config.json')

  function syncZones(zones){
    if(!zones.length) return;
    Zone.create({ name:zones.pop() }).success(function(){ syncZones(zones) });
  }
  function syncAudio(audio){
    if(!audio.length) return;
    var a = audio.pop();
    Audio.create({ name:a.name, zoneId:a.zone }).success(function(){ syncAudio(audio) });
  }

  this.list = function(req, res) {
    Zone.all().success(function(zones){
      res.json(Zone.parse(zones));
    })
  }

  this.show = function(req, res) {
    Zone.find(req.params.id).success(function(zone){
      if(zone == undefined) return res.json({ error:'Invalid zone'});
    
      Audio.findAll({ where:{ zoneId:zone.id }}).success(function(audioZones){
        Light.findAll({ where:{ zoneId:zone.id }}).success(function(lights){
          res.json(zone.eagerParse({
            audio:Audio.parse(audioZones),
            lights:Light.parse(lights)
          }))
        })
      })
    })
  }

  this.resync = function(req, res) {
    if(req.query.username != config.username || req.query.password != config.password)
      res.json({ error:'Invalid credentials' });

    //Drop the table and resync with config file
    Zone.drop().success(function(){
      Zone.sync().success(function(){
        zones = config.zones;
        syncZones(zones.reverse());
    
        //Drop the table and resync with config file
        Audio.drop().success(function(){
          Audio.sync().success(function(){
            audio = config.audio;
            syncAudio(audio.reverse());
            res.json({ success:true });
          })
        })
      })
    })
  }
}
exports.API = ZoneAPI