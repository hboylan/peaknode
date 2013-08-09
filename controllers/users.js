function UserAPI(User, fitbit)
{
  this.list = function(req, res){
    User.all().success(function(users) {
      users.forEach(function(u){ u = u.parse() })
      res.json(users);
    });
  }

  this.show = function(req, res){
    User.find(req.params.id).success(function(user) {
      res.json(user.parse());
    });
  }

  this.create = function(req, res) {
    User.create({
      username: req.body.username,
      password: User.encrypt(req.body.password),
      pinkey: User.encrypt(req.body.pinkey),
      realname: req.body.realname,
      email: req.body.email
    }).success(function(user) {
      res.json(user.parse())
    }).error(function(err) {
      res.status(400).json({ error:err.message, params:req.body })
    })
  }

  this.login = function(req, res) {
    User.find({ where:{ username:req.body.username, password:User.encrypt(req.body.password) }})
      .success(function(u){
        if(u == undefined)  return res.json({ error:'Invalid user' });
        console.log(req.sessionID)
        u = u.parse(req.sessionID)
        
        req.session.user = u
        fitbit.persist(req, fitbit.serializer.stringify({token:u.fitbit_token, secret:u.fitbit_secret}))

        res.json(u)
      })
      .error(function(err){
        res.status(400).json({ error:'Invalid username/password' })
      })
  }
}
exports.API = UserAPI