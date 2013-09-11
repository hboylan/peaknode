function API(db, vera, omni)
{
  this.status = function(req, res){    
    db.security.find(1).success(function(entry){ //security state
      db.lock.all().success(function(locks){ //all locks
        for(l in locks) locks[l] = locks[l].parse()
        var cams = require('../config.json').cameras //camera info
        res.json({ state:entry.parse(), cameras:cams, locks:locks })
      })
    })
  }

  this.setStatus = function(req, res){
    var id     = req.body.id
      , state  = req.body.state
      , pinkey = req.body.pinkey
      , lock   = req.params.lockId
    
    //Ensure user has permission
    db.user.find(id).success(function(u){
      if(u == undefined) return res.status(400).json({ error:'Invalid user' })
      else if(pinkey != u.pinkey) return res.status(400).json({ error:'Invalid pinkey' })
    
      if(lock) //Update lock state
        db.lock.find(lock).success(function(l){
          vera.state(req, res)
          l.locked = !l.locked
          l.save()
        })
      else //Update security state
      {
        //Send command thru TCP
        omni.security('control', { state:state })
      
        db.security.find(1).success(function(security){
          if(state == 'arm'){
            var time = security.armTimeout
            setInterval(function(){ //Countdown arm timout trigger
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
      }
    })
  }
}
module.exports = function(d, v, c){ return new API(d, v, c) }