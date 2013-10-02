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
  var dt   = require('../lib/datetime')
    , time = require('time')
    , http = require('http')
    
  function apiHandle(res){
    return function(err, resp, json){
      if(err) return res.status(401).json(err)
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
    var token = req.query.oauth_token, verifier = req.query.oauth_verifier, username = req.query.username;
    if(username == undefined) return res.status(401).json({ error:'Add Peak username to query string' })
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
  
  this.graphReq = function(token, req, res){
    var action  = req.params.action
      , page    = req.params.page
      , day     = new Date()
      , start   = dt.dateFormat(new Date(day.setDate(day.getDate() - 7 * page)))

    if(action == 'distance')
      client.userRequest('activities/distance/date/'+start+'/7d', token, function(err, resp, json){
        if(err) return res.status(401).json(err)
        res.status(200).json(json['activities-distance'])
      })
    else if(action == 'sleep')
      client.userRequest('sleep/minutesAsleep/date/'+start+'/7d', token, function(err, resp, json){
        if(err) return res.status(401).json(err)
        res.status(200).json(json['sleep-minutesAsleep'])
      })
    else if(action == 'weight')
      client.userRequest('body/weight/date/'+start+'/7d', token, function(err, resp, json){
        if(err) return res.status(401).json(err)
        res.status(200).json(json['body-weight'])
      })
  }
}

module.exports = function(d, c){ return new API(d, c) }