module.exports = function(app, db, omni_client, fit_client, xbmc_client) {
  var users   = require('./controllers/users')
    , zones   = require('./controllers/zones')
    , audio   = require('./controllers/audio')
    , sec     = require('./controllers/security')
    , lights  = require('./controllers/lights')
    , fitbit  = require('./controllers/fitbit')
    , xbmc    = require('./controllers/xbmc')

  /*** Authentication Wrappers ***/  
  //Require user authentication
  function reqLogin(callback){
    return function(req, res){
      if(req.session.user == undefined) res.status(400).json({ error:'Requires user login' })
      else callback(req, res)
    }
  }
  
  //Require valid auth token
  function reqToken(callback){
    return function(req, res){
      var auth = req.session.auth
      if(auth == undefined) res.status(400).json({ error:'Requires admin token' })
      else if(new Date() > new Date(auth.timeout)) res.status(400).json({ error:'Expired admin token' })
      else callback(req, res)
    }
  }
  
  //Require persistant fitbit access token
  function reqFitbit(callback){
    return function(req, res){
      if(req.session.fitbit == undefined) res.status(400).json({ error:'Requires fitbit access token'})
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
  users = new users.API(fit_client, db)
  app.get('/users', users.list)
  app.post('/users', reqBody(users.create, ['username', 'password', 'realname', 'pinkey']))
  app.get('/authenticated', users.authenticated)
  app.post('/login', reqBody(users.login, ['username', 'password']))
  app.get('/logout', users.logout)
  app.get('/lock', users.lock)
  app.post('/unlock', reqBody(reqLogin(users.unlock), ['id', 'pinkey']))
  app.get('/users/:id', users.show)
  
  // zones
  zones = new zones.API(db)
  app.get('/zones', reqLogin(zones.list))
  app.get('/zones/resync', zones.resync)
  app.get('/zones/:id', zones.show)
  
  // audio
  audio = new audio.API(omni_client, db)
  app.get('/audio', reqLogin(audio.list))
  app.post('/audio', reqLogin(audio.state))
  app.get('/audio/:id', reqLogin(audio.zone))
  
  //security
  sec = new sec.API(omni_client, db)
  app.get('/security', reqLogin(sec.status))
  app.post('/security', reqLogin(sec.setStatus))
  
  //lighting
  lights = new lights.API(omni_client, db);
  app.get('/lights', reqLogin(lights.list))
  // app.post('/lights', lights.create)
  app.get('/lights/:id', reqLogin(lights.show))
  app.post('/lights', reqLogin(lights.state))
  // app.post('/lights/:id/:action', lights.timeout)
  
  //fitbit
  fitbit = new fitbit.API(fit_client, db);
  app.get('/fitbit', reqLogin(fitbit.auth))
  app.get('/fitbit/access', reqLogin(fitbit.access))
  app.get('/fitbit/:action', reqFitbit(fitbit.userAction))
  app.get('/fitbit/:action/:sub', reqFitbit(fitbit.userSubAction))
  app.get('/fitbit/:action/:sub/date/:start/:end', reqFitbit(fitbit.dateRange))
  
  //xbmc
  xbmc = new xbmc.API(xbmc_client)
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
}