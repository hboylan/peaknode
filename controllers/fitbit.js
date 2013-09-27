/*
 * User Request Options
 * https://wiki.fitbit.com/display/API/Fitbit+Resource+Access+API
 * 
 * /profile
 * /activities
 * /activities/recent
 * /activities/frequent
 * /activities/favorites
 * /friends
 * /friends/leaderboard
 * 
 * Time Series Requests
 * https://wiki.fitbit.com/display/API/API-Get-Time-Series
 * 
 * /activities/:resource/date/:start/:end [distance, calories, activeScore, etc]
 * /sleep/:resource/date/:start/:end [timeInBed, efficiency, etc]
 * /body/:resource/date/:start/:end [weight, bmi, etc]
 * 
 */


function API(db, client)
{  
  function apiHandle(res){
    return function(err, resp, json){
      if(err) return res.status(500).json(err)
      res.status(200).json(json)
    }
  }
  
  this.auth = function(req, res){
    // Request token
    client.oauth.getOAuthRequestToken(function (error, token, secret, authorize_url, other) {
      res.redirect('http://www.fitbit.com/oauth/authorize?oauth_token=' + token)
    })
  }
  this.access = function(req, res){
    var token = req.query.oauth_token, verifier = req.query.oauth_verifier;
    // Access token
    client.oauth.getOAuthAccessToken(token, '', verifier, function (error, token, secret, other){
      if(error) return res.status(401).json({ error:'failed to getOAuthAccessToken', msg:error })
      db.user.find({ where:{username:req.query.username} }).success(function(u){ //persist in db
        u.updateAttributes({ fitbit_token:token, fitbit_secret:secret }).success(function(){ res.send('success') })
      })
    })
  }
  this.hasToken = function(id, req, res){
    db.user.find(id).success(function(u){
      if(u && u.fitbit_token && u.fitbit_secret) res.json({ success:true })
      else res.json({ success:false })
    })
  }
  
  this.userAction = function(token, req, res){ client.userRequest(req.params.action, token, apiHandle(res)) }
  this.userSubAction = function(token, req, res){ client.userRequest(req.params.action+'/'+req.params.sub, token, apiHandle(res)) }
  
  this.dateRange = function(token, req, res){ client.userRequest(req.params.action+'/'+req.params.sub+'/date/'+req.params.start+'/'+req.params.end, token, apiHandle(res)) }
}

module.exports = function(d, c){ return new API(d, c) }