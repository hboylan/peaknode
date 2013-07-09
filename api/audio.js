var audio = require('../config/database').audio;

exports.zones = function(req, res) {
  audio.all().success(function(zones){
    res.json({
      'zones':zones,
      'sources':[{
        id:1,
        source_id:1,
        name:"Hugh's iPhone",
      }]
    });
  });
};

exports.zone = function(req, res) {
  audio.find({ id:req.params.id }).success(function(a){
    res.json(a);
  });
}

exports.create = function(req, res) {
  // var zone = require('../config/database').zone;
  audio.create({
    zone_id:req.body.zone,
    name:req.body.name,
  }).success(function(audio_zone){
    res.json(audio_zone);
  });
};

exports.volume = function(req, res) {
  // zone, setting
  var vol     = req.body.volume
    , zone    = req.body.zone
    , client  = require('../app').client()
    , on      = vol == 0
    , msg     = on? 'audiocontrol '+zone+' 3' : 'audiovolume '+zone+' '+vol;
  //Tell TCP server to change volume for zone
  client.send(msg);
  console.log(msg);
  //Wait for success msg
  audio.find({ zone_id:zone }).success(function(a){
    a.active = on;
    a.volume = vol;
    a.save();
    res.json(a);
  });
};

exports.play = function(req, res) {
  // start playing from source
};

