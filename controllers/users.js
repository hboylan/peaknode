function UserAPI(fitbit, db)
{
  this.list = function(req, res){
    db.user.all().success(function(users) {
      for(u in users) users[u] = users[u].parse()
      res.json(users)
    })
  }

  this.show = function(req, res){
    db.user.find(req.params.id).success(function(user) {
      res.json(user.parse())
    })
  }

  this.create = function(req, res) {
    db.user.create({
      username: req.body.username,
      password: db.user.encrypt(req.body.password),
      pinkey: db.user.encrypt(req.body.pinkey),
      realname: req.body.realname,
      email: req.body.email
    }).success(function(user) {
      res.json(user.parse())
    }).error(function(err) {
      res.status(400).json({ error:err.message, params:req.body })
    })
  }
  
  this.lock = function(req, res){
    req.session.auth = null
    res.send()
  }
  
  this.unlock = function(req, res){
    db.user.find({ where:{id:req.body.id, pinkey:db.user.encrypt(req.body.pinkey)} }).success(function(user){
      if(user == undefined) return res.status(400).json({ error:'Invalid user' })
      
      require('crypto').randomBytes(48, function(err, bytes){
        // req.session.auth = { key:bytes.toString('hex'), timeout:new Date(Date.now() + user.token_timeout) }
        res.json(req.session.auth)
      })
    }).error(function(err){
      res.status(400).json({ error:'Invalid pinkey' })
    })
  }
  
  this.authenticated = function(req, res){
    var token = req.session.auth
    res.json({
      user:req.session.user? true:false,
      token:(token && new Date() <= new Date(token.timeout))? true:false
    })
  }

  this.login = function(req, res) {
    db.user.find({ where:{ username:req.body.username, password:db.user.encrypt(req.body.password) }}).
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
  
  this.logout = function(req, res){
    req.session.destroy()
    res.status(200).send('ok')
  }
}
exports.API = UserAPI