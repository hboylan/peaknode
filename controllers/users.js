function UserAPI(db, fitbit)
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
      res.status(401).end()
    })
  }

  this.login = function(req, res) {
    db.user.find({ where:{ username:req.body.username }}).success(function(u){
        if(u == undefined)  return res.status(401).json({ error:'Invalid username' })
        
        db.user.find({ where:{ username:req.body.username, password:db.user.encrypt(req.body.password) }}).success(function(u){
          if(u == undefined) return res.status(401).json({ error:'Invalid password' })
          
          u = u.parse(req.sessionID)
          req.session.user = u
          res.json(u)
        })
      })
  }
  
  this.logout = function(req, res){
    res.status(200).end()
  }
}
module.exports = function(d, f){ return new UserAPI(d, f) }