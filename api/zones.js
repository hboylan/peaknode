var db      = require('../config/database')
  , config  = require('../config/config.json')
  , Zone    = db.zone;

exports.list = function(req, res) {
  Zone.all().success(function(zones){
    res.json(Zone.parse(zones));
  })
}

exports.show = function(req, res) {
  Zone.find(req.params.id).success(function(zone){
    if(zone == undefined) return res.json({ error:'Invalid zone'});
    
    db.audio.findAll({ where:{ zoneId:zone.id }}).success(function(audioZones){
      db.light.findAll({ where:{ zoneId:zone.id }}).success(function(lights){
        res.json(zone.eagerParse({
          audio:db.audio.parse(audioZones),
          lights:db.light.parse(lights)
        }))
      })
    })
  })
}

exports.resync = function(req, res) {
  if(req.query.username != config.username || req.query.password != config.password)
    res.json({ error:'Invalid credentials' });

  //Drop the table and resync with config file
  Zone.drop().success(function(){
    Zone.sync().success(function(){
      zones = config.zones;
      syncZones(zones.reverse());
    
      //Drop the table and resync with config file
      db.audio.drop().success(function(){
        db.audio.sync().success(function(){
          audio = config.audio;
          syncAudio(audio.reverse());
          res.json({ success:true });
        })
      })
    })
  })
}

function syncZones(zones){
  if(!zones.length) return;
  
  db.zone.create({ name:zones.pop() }).success(function(){ syncZones(zones) });
}

function syncAudio(audio){
  if(!audio.length) return;
  
  var a = audio.pop();
  db.audio.create({ name:a.name, zoneId:a.zone }).success(function(){ syncAudio(audio) });
}