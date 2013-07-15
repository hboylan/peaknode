var db    = require('../config/database')
  , sec   = db.security
  , user  = db.user;

exports.test = function(req, res){
  require('../app').client().send('security '+req.params.status);
  res.json({ status:req.params.status });
}

exports.status = function(req, res){
  var pinkey  = req.query.pinkey
    , uid     = req.query.id;
    
  //Ensure user has permission
  user.find(id).success(function(u){
    if(u == undefined || pinkey != u.encrypted())
      res.json({ error:'Invalid user' });
    
    //Return security status
    sec.entries(res);
  })
}

exports.setStatus = function(req, res){
  var client = require('../app').client()
    , state = req.body.state
    , pinkey = req.body.pinkey
    , id = req.body.id;
    
  //Ensure user has permission
  user.find(id).success(function(u){
    if(u == undefined || pinkey != u.encrypted())
      res.json({ error:'Invalid user' });
    
    //Send command thru TCP
    client.send('security '+state);
    
    //Log/return security state change
    sec.create({ state:state }).success(function(entry){
      res.json(entry);
    })
  });
}