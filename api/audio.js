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
}

exports.zone = function(req, res) {
  audio.find({ zone:req.params.id }).success(function(a){
    res.json(a);
  });
}

exports.create = function(req, res) {
  var z = req.body.zone
    , n = req.body.name;
  if(z == undefined || n == undefined) res.json({ error:'Check params supplied' });
  audio.create({ zone:z, name:n }).success(function(a){
    res.json(a);
  });
}

exports.state = function(req, res) {
  var vol     = req.body.volume
    , state   = req.body.state
    , zone    = req.params.id
    , client  = require('../app').client();
    
  audio.checkZone(res, zone);
  audio.find({where:{ zone:zone }}).success(function(a){
    //Turn on
    if(state == 'on' || (!a.active && vol > 0))
      a.setState(client, res, 1);
    //Turn off
    if(state == 'off')
      a.setState(client, res, 0);
      
    if(vol >= 0 && vol <= 100 && vol != undefined)
      a.setVolume(client, res, vol)
  })
}