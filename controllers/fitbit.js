function API(client){
  
  function apiHandle(res){
    return function(err, json, other) {
      if(err) return res.status(500).json(err)
      console.log(json, other)
      res.status(200).json({success:true})
    }
  }
  
  this.auth   = function(req, res){ client.getRequestToken(req, res) }
  this.access = function(req, res){ client.getAccessToken(req, res) }
  
  this.profile = function(req, res){ client.user('profile', req, apiHandle(res)) }
  this.devices = function(req, res){ client.user('devices', req, apiHandle(res)) }
}

exports.API = API;