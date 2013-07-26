var users   = require('./api/users')
  , zones   = require('./api/zones')
  , audio   = require('./api/audio')
  , sec     = require('./api/security')
  , lights  = require('./api/lights')
  , fitbit  = require('./api/fitbit')
  , xbmc    = require('./api/xbmc')

module.exports = function(app) {

  /*** API ***/
  // users
  app.get('/api/users', users.list)
  app.post('/api/users', users.create)
  app.post('/api/users/login', users.login)
  app.get('/api/users/logout', users.logout)
  app.get('/api/users/:id', users.show)
  
  // zones
  app.get('/api/zones', zones.list)
  app.get('/api/zones/resync', zones.resync)
  app.get('/api/zones/:id', zones.show)
  
  // audio
  app.get('/api/audio', audio.list)
  app.get('/api/audio/:id', audio.zone)
  app.post('/api/audio/:id', audio.state)
  
  //security
  app.get('/api/security', sec.status)
  app.post('/api/security', sec.setStatus)
  
  //lighting
  app.get('/api/lights', lights.list)
  app.post('/api/lights', lights.create)
  app.get('/api/lights/:id', lights.show)
  app.post('/api/lights/:id', lights.state)
  app.post('/api/lights/:id/:action', lights.timeout)
  
  //fitbit
  fitbit = new fitbit.API(app.get('fitbit-client'));
  app.get('/api/fitbit', fitbit.auth)
  app.get('/api/fitbit/test', fitbit.test)
  
  //xbmc
  xbmc = new xbmc.API(app.get('xbmc-client'));
  app.get('/api/xbmc', xbmc.status)
  app.get('/api/xbmc/songs', xbmc.songs)
  
  //API catch-all
  app.get('/api/*', function(req, res){ res.json({ error:'Invalid API call' })})
  
  /*** Website ***/
  app.get('*', function(req, res){ res.render('index') })
};
