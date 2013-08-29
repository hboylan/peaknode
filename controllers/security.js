function API(db, omni)
{
  this.status = function(req, res){    
    db.security.find(1).success(function(entry){ res.json(entry.parse()) })
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
      omni.security('control', { state:state })
      
      db.security.find(1).success(function(security){
        if(state == 'arm'){
          //hack to copy obj instead of ref
          var time = security.armTimeout
          setInterval(function(){
            time -= 1
            if(time == 0) clearInterval(this)
            security.updateAttributes({ state:time? 'arming':'armed', armTimeout:time? time:db.security.armTime() })
          }, 1000)
          security.updateAttributes({ state:'arming' })
        }
        else if(state == 'disarm') security.updateAttributes({ state:'disarmed' })
        else return res.status(201).json({ error:'Required state:\'arm\'/\'disarm\'' })
        res.send()
      })
    })
  }
}
module.exports = function(d, c){ return new API(d, c) }