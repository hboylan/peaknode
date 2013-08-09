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
      , state   = req.body.state
      , source  = parseInt(req.body.source, 10)
      , zone    = parseInt(req.params.id, 10)
    
    db.audio.find(zone).success(function(a){
      if(a == undefined) return res.status(400).json({ error:'Invalid zone' });
      //Update Audio Zone state
      if(0 <= vol && vol <= 100){
        omni.audio('volume', { zone:a.id, volume:vol })
        a.volume = vol
      } else if(1 <= source && source <= 12){
        omni.audio('source', { zone:a.id, source:source })
        a.source = source
      } else if(['off', 'on', 'unmute', 'mute'].indexOf(state) != -1){
        omni.audio('control', { zone:a.id, state:['off', 'on', 'unmute', 'mute'].indexOf(state) })
        a.state = (state == 'unmute')? 'on' : state
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