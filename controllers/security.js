function SecurityAPI(User, Security)
{
  this.status = function(req, res){
    var pinkey  = req.query.pinkey
      , uid     = req.query.id;
    
    //Ensure user has permission
    User.find(id).success(function(u){
      if(u == undefined || pinkey != u.encrypted())
        res.json({ error:'Invalid user' });
    
      //Return security status
      Security.entries(res);
    })
  }

  this.setStatus = function(req, res){
    var client = require('../app').client()
      , state = req.body.state
      , pinkey = req.body.pinkey
      , id = req.body.id;
    
    //Ensure user has permission
    User.find(id).success(function(u){
      if(u == undefined || pinkey != u.encrypted())
        res.json({ error:'Invalid user' });
    
      //Send command thru TCP
      client.send('security '+state);
    
      //Log/return security state change
      Security.create({ state:state }).success(function(entry){
        res.json(entry.parse());
      })
    })
  }
}
exports.API = SecurityAPI