/*
 * User Request Options
 * 
 * /profile
 * /activities
 * /friends
 * /friends/leaderboard
 * /body
 * 
 * /activities/:resource/date/:start/:end, [distance, calories, activeScore]
 * /sleep/:resource/date/:start/:end [timeInBed, efficiency]
 * /body/:resource/date/:start/:end [weight, bmi]
 */


function API(User, client)
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
      if(error) return res.status(400).json({ error:'Failed to request token' })
      res.redirect('http://www.fitbit.com/oauth/authorize?oauth_token=' + token)
    })
  }
  this.access = function(req, res){
    var token = req.query.oauth_token, verifier = req.query.oauth_verifier;
    // Access token
    client.oauth.getOAuthAccessToken(token, '', verifier, function (error, token, secret, other){
      if(error) return res.status(400).json(error)
      client.persist(req, client.serializer.stringify({token:token, secret:secret})) //persist in session
      
      User.find(req.session.user.id).success(function(u){ //persist in db
        if(u != undefined) u.updateAttributes({fitbit_token:token, fitbit_secret:secret}).success(function(){
          res.status(200).send()
        })
      })
    })
  }
  this.userAction = function(req, res){ client.userRequest(req.params.action, req, apiHandle(res)) }
  this.userSubAction = function(req, res){ client.userRequest(req.params.action+'/'+req.params.sub, req, apiHandle(res)) }
  
  this.bodyRange = function(req, res){ client.userRequest('body/'+req.params.sub+'/date/'+req.params.start+'/'+req.params.end, req, apiHandle(res)) }
}

exports.API = API;