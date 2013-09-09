function API(db, omni)
{
  this.cameras = function(req, res){
    res.json(require('../config.json').cameras)
  }
  
  this.locks = function(req, res){
    db.lock.all().success(function(locks){
      for(l in locks) locks[l] = locks[l].parse()
      res.json(locks)
    })
  }
  
  this.lock = function(req, res){
    //Ensure user has permission
    db.user.find(req.body.id).success(function(u){
      if(u == undefined) return res.status(400).json({ error:'Invalid user' })
      else if(req.body.pinkey != u.pinkey) return res.status(400).json({ error:'Invalid pinkey' })
      
      db.lock.find(req.params.id).success(function(lock){
        lock.locked = !lock.locked
        lock.save().success(function(l){
          res.json(l.parse())
        })
      })
    })
  }
  
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