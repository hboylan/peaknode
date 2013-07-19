var db      = require('../config/database')
  , config  = require('../config/config.json')
  , Zone    = db.zone;

exports.list = function(req, res) {
  Zone.list(res, function(zones){
    zones.forEach(function(z){ z = z.parse(); });
    res.json(zones);
  })
}

function contains(arr, obj){
  for(o in arr)
    if(arr[o].id == obj.id)
      return true;
  return false;
}

exports.show = function(req, res) {
  Zone.find(req.params.id, { include:[db.light, db.audio] })
    .success(function(zone){
      if(zone == undefined) return res.json({ error:'Invalid zone'});

      var audio = [], lights = [];
      // zone.audio.forEach(function(a){
      //   if(!contains(audio, a)) audio.push(a);
      // })
      // zone.lights.forEach(function(l){
      //   if(!contains(lights, l)) lights.push(l);
      // })
      // audio.forEach(function(a){ a = a.parse(); })
      // lights.forEach(function(l){ l = l.parse(); })
      // zone.audio = audio;
      // zone.lights = lights;
      res.json(zone.parse());
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