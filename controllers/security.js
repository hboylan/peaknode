function API(db, omni)
{
  this.status = function(req, res){
    var pinkey  = req.body.pinkey
      , uid     = req.body.id;
    
    //Ensure user has permission
    db.user.find(id).success(function(u){
      if(u == undefined || pinkey != u.pinkey)
        res.json({ error:'Invalid user' });
    
      //Return security status
      db.security.entries(res);
    })
  }

  this.setStatus = function(req, res){
    var id     = req.body.id
      , state  = req.body.state
      , pinkey = req.body.pinkey
    
    //Ensure user has permission
    db.user.find(id).success(function(u){
      if(u == undefined) return res.status(400).json({ error:'Invalid user' })
      else if(pinkey != u.pinkey) return res.status(400).json({ error:'Invalid pinkey' })
    
      //Send command thru TCP
      omni.security('control', {state:state})
    
      //Log/return security state change
      db.security.create({ state:state }).success(function(entry){
        res.json(entry.parse())
      })
    })
  }
}
module.exports = function(d, c){ return new API(d, c) }