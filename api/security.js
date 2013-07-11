var db = require('../config/database');

function crypto(val){
  return require('crypto').createHash('sha512').update(String(val)).digest('hex');
}

exports.test = function(req, res){
  client.send('security '+res.params.status);
}

//Need to figure out requests to tcp server
exports.setStatus = function(req, res){
  var client = require('../app').client()
    , user   = db.user
    , sec    = db.security
    , status = req.body.status
    , pinkey = req.body.pinkey
    , uid = req.body.uid;
    
  //Ensure user has permission
  user.find(uid).success(function(u){
    if(u == undefined)
      res.json({error:'Could not locate user'});
    else if(pinkey != u.pinkey)
      res.json({error:'Invalid pin for user'});
    
    client.send('security '+status);
    // sec.create({ status:status }).success(function(entry){
    //   
    // });
    res.json({entry:{'timestamp':new Date(), 'status':status}});
  });
};