var users   = require('./controllers/users')
  , zones   = require('./controllers/zones')
  , audio   = require('./controllers/audio')
  , sec     = require('./controllers/security')
  , lights  = require('./controllers/lights')
  , fitbit  = require('./controllers/fitbit')
  , xbmc    = require('./controllers/xbmc')

module.exports = function(app) {

  /*** API ***/
  // users
  app.get('/users', users.list)
  app.post('/users', users.create)
  app.post('/users/login', users.login)
  app.get('/users/logout', users.logout)
  app.get('/users/:id', users.show)
  
  // zones
  app.get('/zones', zones.list)
  app.get('/zones/resync', zones.resync)
  app.get('/zones/:id', zones.show)
  
  // audio
  app.get('/audio', audio.list)
  app.get('/audio/:id', audio.zone)
  app.post('/audio/:id', audio.state)
  
  //security
  app.get('/security', sec.status)
  app.post('/security', sec.setStatus)
  
  //lighting
  app.get('/lights', lights.list)
  app.post('/lights', lights.create)
  app.get('/lights/:id', lights.show)
  app.post('/lights/:id', lights.state)
  app.post('/lights/:id/:action', lights.timeout)
  
  //fitbit
  fitbit = new fitbit.API(app.get('fitbit-client'));
  app.get('/fitbit', fitbit.auth)
  app.get('/fitbit/access', fitbit.access)
  app.get('/fitbit/:action', fitbit.userAction)
  app.get('/fitbit/:action/:sub', fitbit.userSubAction)
  app.get('/fitbit/body/:sub(bmi|weight)/date/:start/:end', fitbit.bodyRange)
  
  //xbmc
  xbmc = new xbmc.API(app.get('xbmc-client'))
  app.get('/xbmc', xbmc.status)
  app.get('/xbmc/reconnect', xbmc.reconnect)
  app.post('/xbmc/dir', xbmc.dir)
  app.get('/xbmc/scan', xbmc.scan)
  app.get('/xbmc/playlists', xbmc.playlists)
  app.post('/xbmc/playlist/:id', xbmc.add)
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
  app.get('/xbmc/:playlist(0-9]+)/:id(0-9]+)', xbmc.playPlaylist)
  
  //API catch-all
  app.get('*', function(req, res){ res.status(400).json({ error:'Invalid API call' }) })
};
