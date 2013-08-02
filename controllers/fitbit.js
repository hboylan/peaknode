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


function API(client)
{  
  function apiHandle(res){
    return function(err, resp, json){
      if(err) return res.status(500).json(err)
      res.status(200).json(json)
    }
  }
  
  this.auth       = function(req, res){ client.getRequestToken(req, res) }
  this.access     = function(req, res){ client.getAccessToken(req, res) }
  this.userAction = function(req, res){ client.userRequest(req.params.action, req, apiHandle(res)) }
}

exports.API = API;