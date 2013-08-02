function API(client){
  
  function apiHandle(res){
    return function(err, resp, json){
      if(err) return res.status(500).json(err)
      res.status(200).json(json)
    }
  }
  
  this.auth   = function(req, res){ client.getRequestToken(req, res) }
  this.access = function(req, res){ client.getAccessToken(req, res) }
  
  this.profile = function(req, res){ client.user('profile', req, apiHandle(res)) }
  this.activity = function(req, res){ client.user('activities', req, apiHandle(res)) }
  this.recent   = function(req, res){ client.user('activities/recent', req, apiHandle(res)) }
  this.devices = function(req, res){ client.user('devices', req, apiHandle(res)) }
  this.measure = function(req, res){ client.user('body', req, apiHandle(res)) }
  this.friends = function(req, res){ client.user('friends', req, apiHandle(res)) }
  this.board   = function(req, res){ client.user('friends/leaderboard', req, apiHandle(res)) }
  this.date   = function(req, res){ client.user('activities/date/'+req.params.date, req, apiHandle(res)) }
}

exports.API = API;