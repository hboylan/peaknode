var db      = require('../config/database')
  , config  = require('../config/config.json')
  , Zone    = db.zone
  , User    = db.user;

exports.list = function(req, res) {
  Zone.list(res, function(zones){
    zones.forEach(function(z){ z = z.parse(); });
    res.json(zones);
  })
}

exports.show = function(req, res) {
  Zone.find({ include:[db.audio], where:{ zoneId:req.params.id }}).success(function(zone){
    zone.audio.forEach(function(a){ a = a.parse(); })
    res.json(zone.parse());
  });
}

exports.resync = function(req, res) {
  var username  = req.query.username
    , password  = req.query.password;
  
  User.login(res, username, password, function(u){
    Zone.list(res, function(zones){
      //Clear existing zones
      zones.forEach(function(z){ z.destroy() });
      //Create new zones from config file
      zones = config.zones;
      zones.forEach(function(z){
        Zone.create({ name:z.name, zoneId:z.id });
      })
      res.json({ success:true });
    })
  })
}