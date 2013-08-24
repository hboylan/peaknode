module.exports = function(app, sessions, db, omni_client, fit_client, xbmc_client) {
  var users   = require('./controllers/users')(db, fit_client)
    , zones   = require('./controllers/zones')(db)
    , audio   = require('./controllers/audio')(db, omni_client)
    , sec     = require('./controllers/security')(db, omni_client)
    , lights  = require('./controllers/lights')(db, omni_client)
    , fitbit  = require('./controllers/fitbit')(db, fit_client)
    , xbmc    = require('./controllers/xbmc')(xbmc_client)

  /*** Authentication Wrappers ***/  
  //Require user authentication
  function reqLogin(callback){
    return function(req, res){
      var sessID;
      if(req.method == 'POST')      sessID = req.body.sessionID
      else if(req.method == 'GET')  sessID = req.query.sessionID

      if(callback == users.login || callback == users.logout){
        if(sessID) sessions.destroy(sessID, function(err, sess){})
        callback(req, res)
      }
      else
        sessions.get(sessID, function(err, sess){
          if(sess == undefined) res.status(401).end()
          else callback(req, res)
        })
    }
  }
  
  //Require valid auth token
  function reqToken(callback){
    return function(req, res){
      // if(auth == undefined) res.status(400).json({ error:'Requires admin token' })
      // else if(new Date() > new Date(auth.timeout)) res.status(400).json({ error:'Expired admin token' })
      // else 
      callback(req, res)
    }
  }
  
  //Require persistant fitbit access token
  function reqFitbit(callback){
    return function(req, res){
      if(req.session.fitbit == undefined) res.status(401).json({ error:'Requires fitbit access token'})
      else callback(req, res)
    }
  }
  
  //Require POST parameters be set
  function reqBody(callback, params){
    return function(req, res){
      var err = false
      params.forEach(function(p){ if(req.body[p] == undefined) err = true })
      return err? res.status(400).json({ error:'Requires POST params: '+params.join(', ') }) : callback(req, res)
    }
  }

  /*** API ***/
  // users
  app.post('/auth', reqBody(function(req, res){
    sessions.get(req.body.sessionID, function(err, sess){
      res.json({ success:sess && sess.user? true:false })
    })
  }, ['sessionID']))
  app.get('/resync', db.resync)
  app.get('/users', users.list)
  app.post('/users', reqBody(users.create, ['username', 'password', 'realname', 'pinkey']))
  app.post('/login', reqBody(users.login, ['username', 'password']))
  app.post('/logout', reqLogin(users.logout))
  app.get('/lock', users.lock)
  app.post('/unlock', reqBody(reqLogin(users.unlock), ['id', 'pinkey']))
  app.get('/users/:id', users.show)
  
  // zones
  app.get('/zones', reqLogin(zones.list))
  app.get('/zones/:id', zones.show)
  
  // audio
  app.get('/audio', reqLogin(audio.list))
  app.post('/audio', reqLogin(audio.state))
  app.get('/audio/:id', reqLogin(audio.zone))
  
  //security
  app.get('/security', reqLogin(reqBody(sec.status, ['id', 'pinkey']))
  app.post('/security', reqLogin(reqBody(sec.setStatus, ['id', 'pinkey', 'state']))
  
  //lighting
  app.get('/lights', reqLogin(lights.list))
  // app.post('/lights', lights.create)
  app.get('/lights/:id', reqLogin(lights.show))
  app.post('/lights', reqLogin(lights.state))
  // app.post('/lights/:id/:action', lights.timeout)
  
  //fitbit
  app.get('/fitbit', reqLogin(fitbit.auth))
  app.get('/fitbit/access', reqLogin(fitbit.access))
  app.get('/fitbit/:action', reqFitbit(fitbit.userAction))
  app.get('/fitbit/:action/:sub', reqFitbit(fitbit.userSubAction))
  app.get('/fitbit/:action/:sub/date/:start/:end', reqFitbit(fitbit.dateRange))
  
  //xbmc
  app.get('/xbmc', xbmc.status)
  app.get('/xbmc/reconnect', xbmc.reconnect)
  app.post('/xbmc/dir', xbmc.dir)
  app.get('/xbmc/scan', xbmc.scan)
  app.get('/xbmc/playlists', xbmc.playlists)
  app.post('/xbmc/playlist/:id(0|1)', xbmc.add)
  app.get('/xbmc/songs', xbmc.songs)
  app.get('/xbmc/movies', xbmc.movies)
  app.get('/xbmc/movies/:id([0-9]+)', xbmc.movie)
  app.get('/xbmc/artists', xbmc.artists)
  app.get('/xbmc/artist', xbmc.artist)
  app.get('/xbmc/albums', xbmc.albums)
  app.get('/xbmc/album', xbmc.album)
  app.get('/xbmc/ctl/:control', xbmc.control)
  app.get('/xbmc/song/:songid(0-9]+)', xbmc.playSong)
  app.post('/xbmc/file', xbmc.playFile)
  app.get('/xbmc/:playlist(0|1)/:id(0-9]+)', xbmc.playPlaylist)
  
  //API catch-all
  app.get('*', function(req, res){ res.status(400).json({ error:'Invalid API call' }) })
  app.post('*', function(req, res){ res.status(400).json({ error:'Invalid API call' }) })
}