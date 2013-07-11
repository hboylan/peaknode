var db    = require('../config/database')
  , sec   = db.security
  , user  = db.user;

exports.test = function(req, res){
  require('../app').client().send('security '+req.params.status);
  res.json({ status:req.params.status });
}

exports.status = function(req, res){
  var pinkey  = req.query.pinkey
    , uid     = req.query.uid;
    
  //Ensure user has permission
  user.find(uid).success(function(u){
    if(u == undefined || pinkey != u.encrypted())
      res.json({ error:'Invalid user' });
    
    //Return security status
    sec.entries(res);
  })
}

//Need to figure out requests to tcp server
exports.setStatus = function(req, res){
  var client = require('../app').client()
    , status = req.body.status
    , pinkey = req.body.pinkey
    , uid = req.body.uid;
    
  //Ensure user has permission
  user.find(uid).success(function(u){
    if(u == undefined || pinkey != u.encrypted())
      res.json({ error:'Invalid user' });
    
    //Send command thru TCP
    client.send('security '+status);
    
    //Log/return security status change
    sec.create({ status:status }).success(function(entry){
      res.json(entry);
    })
  });
}