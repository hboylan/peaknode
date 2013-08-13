function UserAPI(User, fitbit)
{
  this.list = function(req, res){
    User.all().success(function(users) {
      for(u in users) users[u] = users[u].parse()
      res.json(users)
    })
  }

  this.show = function(req, res){
    User.find(req.params.id).success(function(user) {
      res.json(user.parse())
    })
  }

  this.create = function(req, res) {
    var user    = req.body.username
      , pass    = req.body.password
      , pinkey  = req.body.pinkey
      , name    = req.body.realname
    if(name == undefined || user == undefined || pass == undefined || pinkey == undefined) return res.status(400).json({ error:'Invalid user information' })
    
    User.create({
      username: user,
      password: User.encrypt(pass),
      pinkey: User.encrypt(pinkey),
      realname: name,
      email: req.body.email
    }).success(function(user) {
      res.json(user.parse())
    }).error(function(err) {
      res.status(400).json({ error:err.message, params:req.body })
    })
  }

  this.login = function(req, res) {
    User.find({ where:{ username:req.body.username, password:User.encrypt(req.body.password) }}).
      success(function(u){
        if(u == undefined)  return res.json({ error:'Invalid user' });
        
        fitbit.persist(req, fitbit.serializer.stringify({token:u.fitbit_token, secret:u.fitbit_secret}))
        u = u.parse(req.sessionID)
        req.session.user = u
        res.json(u)
      }).
      error(function(err){
        res.status(400).json({ error:'Invalid username/password' })
      })
  }
}
exports.API = UserAPI