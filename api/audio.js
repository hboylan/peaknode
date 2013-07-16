var audio = require('../config/database').audio;

exports.zones = function(req, res) {
  audio.all({ order:'zone ASC' }).success(function(zones){
    zones.forEach(function(a){ a = a.parse(); })
    res.json({
      'zones':zones,
      'sources':[{
        sourceId:1,
        name:"Hugh's iPhone",
      }]
    });
  });
}

exports.zone = function(req, res) {
  audio.find({ where:{ zone:req.params.id }}).success(function(a){
    res.json(a.parse());
  });
}

exports.create = function(req, res) {
  var z = req.body.zone
    , n = req.body.name;
  if(z == undefined || n == undefined) res.json({ error:'Check params supplied' });
  audio.create({ zone:z, name:n }).success(function(a){
    res.json(a.parse());
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
      a.setState(client, true);
    //Turn off
    if(state == 'off')
      a.setState(client, false);
    //Set volume
    if(vol >= 0 && vol <= 100 && vol != undefined)
      a.setVolume(client, vol)
    //Respond to client
    res.json(a.parse());
  })
}