var db      = require('../lib/database')
  , Audio   = db.audio;

exports.list = function(req, res) {
  Audio.all().success(function(zones){
    zones.forEach(function(a){ a = a.parse(); })
    res.json(zones);
  });
}

exports.zone = function(req, res) {
  Audio.find(req.params.id).success(function(a){
    if(a == undefined) return res.json({ error:'Invalid zone' });
    res.json(a.parse())
  });
}

exports.state = function(req, res) {
  var vol     = req.body.volume
    , state   = req.body.state
    , source  = req.body.source
    , zone    = req.params.id;
    
  Audio.find(zone).success(function(a){
    if(a == undefined) return res.json({ error:'Invalid zone' });
    //Update Audio Zone state
    if(0 <= vol && vol <= 100)
      a.setVolume(vol)
    else if(1 <= source && source <= 12)
      a.setSource(source)
    else if(['off', 'on', 'unmute', 'mute'].indexOf(state) != -1)
      a.setState(state)
    else
      res.json({ error:'Invalid POST params' })
    
    a.save().success(function(a){
      //Respond to client
      res.json(a.parse())
    })
  })
}