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
  Zone.find({ where:{ zoneId:req.params.id }}).success(function(zone){
    res.json(zone.parse());
  });
}

exports.create = function(req, res) {
  Zone.create({
    name:req.body.name,
    zoneId:req.body.zone
  }).success(function(zone){
    res.json(zone.parse());
  })
}

exports.resync = function(req, res) {
  var username  = req.query.username
    , password  = req.query.password;
  
  User.login(res, username, password, function(u){
    Zone.list(res, function(zones){
      //Clear existing zones
      zones.forEach(function(z){ z.destroy() });
      for(n in config.zones){
        var zone = config.zones[n];
        Zone.create({ name:zone.name, zoneId:zone.id });
      }
      res.json({ success:true });
    })
  })
}