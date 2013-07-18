var db      = require('../config/database')
  , config  = require('../config/config.json')
  , Zone    = db.zone;

exports.list = function(req, res) {
  Zone.list(res, function(zones){
    zones.forEach(function(z){ z = z.parse(); });
    res.json(zones);
  })
}

exports.show = function(req, res) {
  Zone.find({ include:[db.audio], where:{ zoneId:req.params.id }}).success(function(zone){
    if(zone == undefined) return res.json({ error:'Invalid zone'});
    
    zone.audio.forEach(function(a){ a = a.parse(); })
    res.json(zone.parse());
  });
}

exports.resync = function(req, res) {
  if(req.query.username != config.username || req.query.password != config.password)
    res.json({ error:'Invalid credentials' });

  //Drop the table and resync with config file
  Zone.drop().success(function(e){
    Zone.sync().success(function(e){
      zones = config.zones;
      zones.forEach(function(z){
        db.zone.create({ name:z.name, zoneId:z.id });
      });
    
      //Drop the table and resync with config file
      db.audio.drop().success(function(e){
        db.audio.sync().success(function(e){
          audio = config.audio;
          audio.forEach(function(a){
            db.audio.create({ audioId:a.id, zoneId:a.zone, name:a.name });
          });
          res.json({ success:true });
        })
      })
    })
  })
}