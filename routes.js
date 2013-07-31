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
  app.get('/fitbit/test', fitbit.test)
  
  //xbmc
  xbmc = new xbmc.API(app.get('xbmc-client'))
  app.get('/xbmc', xbmc.status)
  app.get('/xbmc/reconnect', xbmc.reconnect)
  app.get('/xbmc/songs', xbmc.songs)
  app.get('/xbmc/videos', xbmc.videos)
  
  //API catch-all
  app.get('*', function(req, res){ res.status(400).json({ error:'Invalid API call' }) })
};
