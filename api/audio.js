var audio = require('../config/database').audio;

exports.zones = function(req, res) {
  audio.all().success(function(zones){
    res.json(zones);
  });
};

exports.zone = function(req, res) {
  audio.find({ id:req.params.id }).success(function(a){
    res.json(a);
  });
};

exports.create = function(req, res) {
  var zones = require('../config/database').zone
    , zone_id = req.params.zone;
  audio.create().success(function(a){
    zones.find({ id:zone_id }).success(function(z){
      z.setAudio(a);
      res.json(a);
    });
  });
};

exports.sources = function(req, res) {
  //Query tcp for audio sources
  res.json({
    'sources':['source1']
  });
};

exports.volume = function(req, res) {
  // zone, setting
  var vol = req.body.volume
    , zone = req.body.zone
    , client = require('../app').client();
  //Tell TCP server to change volume for zone
  var msg = 'audiovolume '+zone+' '+vol;
  client.send(msg);
  console.log(msg);
  //Wait for success msg
  //audio.find({ id:zone }).success(function(a){
  //  a.volume = vol;
  //  a.save();
  //  res.json(a);
  //});
};

exports.play = function(req, res) {
  // start playing from source
};

