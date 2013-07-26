function API(client){
  this.auth = function(req, res){ client.authenticate(req, res) }
  
  this.test = function(req, res){
    client.apiCall('GET', '/user/26RNTZ/profile.json', { token:req.cookies.fitbit_client },
      function(err, resp, json) {
        if(err) res.send(err, 500)
        res.json(json)
    })
  }
}

exports.API = API;