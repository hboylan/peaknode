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
  audio.find({ zone_id:req.params.id }).success(function(a){
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
    , zone    = req.params.id
    , client  = require('../app').client()
    , on      = vol == 0
    , msg     = on? 'audiocontrol '+zone+' 3' : 'audiovolume '+zone+' '+vol;
  //Check we have proper params
  console.log(zone);
  if(zone == undefined)
    return res.json({'error':'Expected parameter: zone'});
  if(zone < 1 || zone > 8)
    return res.json({'error':'Audio Zone must be 1-8'});
  if(vol < 0 || vol > 100)
    return res.json({'error':'Volume must be 0-100'});
  
  //Tell TCP server to change volume for zone
  client.send(msg);
  console.log(msg);
  //Update db, client response
  audio.find({where:{ zone_id:zone }}).success(function(a){
    a.active = on;
    a.volume = vol;
    a.save();
    res.json(a);
  });
};

exports.play = function(req, res) {
  // start playing from source
};

