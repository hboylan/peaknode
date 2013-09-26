function API(db, omni)
{
  this.list = function(req, res) {
    db.hvac.all().success(function(units){
      res.json(db.hvac.parse(units))
    })
  }

  this.show = function(req, res) {
    db.hvac.find(req.params.id).success(function(unit){
      res.json(unit.parse())
    })
  }

  this.control = function(req, res){
    var temp  = req.body.temperature
      , mode  = req.body.mode
      , speed = req.body.speed
      , angle = req.body.angle
    db.hvac.find(req.params.id).success(function(unit){
      if(unit == undefined) return res.status(401).json({ error:'Invalid hvac unit' })
      else if(toggle) unit.on = !unit.on
      else if(mode == 'fan' || mode == 'cool' || mode == 'heat') unit.mode = mode
      else return res.status(401).json({ error:'Invalid hvac mode' })
      
      unit.save().success(function(){ res.send() })
    })
  }
}
module.exports = function(d, o){ return new API(d, o) }