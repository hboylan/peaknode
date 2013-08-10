function AudioAPI(omni, db)
{
  this.list = function(req, res) {
    db.audio.all().success(function(zones){
      zones.forEach(function(a){ a = a.parse(); })
      res.json(zones);
    });
  }

  this.zone = function(req, res) {
    db.audio.find(req.params.id).success(function(a){
      if(a == undefined) return res.json({ error:'Invalid zone' });
      res.json(a.parse())
    });
  }

  this.state = function(req, res) {
    var vol     = parseInt(req.body.volume, 10)
      , toggle  = req.body.toggle
      , source  = parseInt(req.body.source, 10)
      , zone    = parseInt(req.body.id, 10)
    
    if(zone == NaN) return res.status(400).json({ error:'Invalid zone id' })
    db.audio.find(zone).success(function(a){
      if(a == undefined) return res.status(400).json({ error:'Invalid zone' });
      //Update Audio Zone state
      if(0 <= vol && vol <= 100){
        omni.audio('volume', { zone:a.id, volume:vol })
        a.volume = vol
      } else if(1 <= source && source <= 12){
        omni.audio('source', { zone:a.id, source:source })
        a.source = source
      } else if(toggle == 'power'){
        omni.audio('control', { zone:a.id, state:a.on? 0:1 })
        a.on = !a.on
      } else if(toggle == 'mute'){
        omni.audio('control', { zone:a.id, state:a.mute? 2:3 })
        a.mute = !a.mute
      } else
        res.json({ error:'Invalid POST params' })
    
      a.save().success(function(a){
        //Respond to client
        res.json(a.parse())
      })
    })
  }
}
exports.API = AudioAPI