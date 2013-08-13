module.exports = function(app, db, omni_client, fit_client, xbmc_client) {
  var users   = require('./controllers/users')
    , zones   = require('./controllers/zones')
    , audio   = require('./controllers/audio')
    , sec     = require('./controllers/security')
    , lights  = require('./controllers/lights')
    , fitbit  = require('./controllers/fitbit')
    , xbmc    = require('./controllers/xbmc')

  /*** API ***/
  // users
  users = new users.API(db.user, fit_client);
  app.get('/users', users.list)
  app.post('/users', users.create)
  app.post('/login', users.login)
  app.get('/users/:id', users.show)
  
  // zones
  zones = new zones.API(db)
  app.get('/zones', zones.list)
  app.get('/zones/resync', zones.resync)
  app.get('/zones/:id', zones.show)
  
  // audio
  audio = new audio.API(omni_client, db)
  app.get('/audio', audio.list)
  app.post('/audio', audio.state)
  app.get('/audio/:id', audio.zone)
  
  //security
  sec = new sec.API(omni_client, db.user, db.security)
  app.get('/security', sec.status)
  app.post('/security', sec.setStatus)
  
  //lighting
  lights = new lights.API(omni_client, db);
  app.get('/lights', lights.list)
  // app.post('/lights', lights.create)
  app.get('/lights/:id', lights.show)
  app.post('/lights', lights.state)
  // app.post('/lights/:id/:action', lights.timeout)
  
  //fitbit
  fitbit = new fitbit.API(db.user, fit_client);
  app.get('/fitbit', fitbit.auth)
  app.get('/fitbit/access', fitbit.access)
  app.get('/fitbit/:action', fitbit.userAction)
  app.get('/fitbit/:action/:sub', fitbit.userSubAction)
  app.get('/fitbit/:action/:sub(bmi|weight)/date/:start/:end', fitbit.dateRange)
  
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
  
  
  var h = 'http://localhost:8000'
  app.get('/', function(req, res){
    var u = req.cookies.user
    if(u != undefined) res.render('index', {user:u})
    else res.redirect('/auth')
  })
  app.get('/auth', function(req, res){ res.render('login', {host:h}) })
  //API catch-all
  app.get('*', function(req, res){ res.status(400).json({ error:'Invalid API call' }) })
}