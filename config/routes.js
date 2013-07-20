module.exports = function(app) {

  /*** API ***/
  // users
  var users = require('../api/users');
  app.get('/api/users', users.list);
  app.post('/api/users', users.create);
  app.post('/api/users/login', users.login);
  app.get('/api/users/logout', users.logout);
  app.get('/api/users/:id', users.show);
  
  // zones
  var zones = require('../api/zones');
  app.get('/api/zones', zones.list);
  app.get('/api/zones/resync', zones.resync);
  app.get('/api/zones/:id', zones.show);
  
  // audio
  var audio = require('../api/audio');
  app.get('/api/audio', audio.list);
  app.get('/api/audio/:id', audio.zone);
  app.post('/api/audio/:id', audio.state);
  
  //security
  var sec = require('../api/security');
  app.get('/api/security', sec.status);
  app.post('/api/security', sec.setStatus);
  
  //lighting
  var lights = require('../api/lights');
  app.get('/api/lights', lights.list);
  app.post('/api/lights', lights.create);
  app.get('/api/lights/:id', lights.show);
  app.post('/api/lights/:id', lights.state);
  app.post('/api/lights/:id/:action', lights.timeout);
  
  //API catch-all
  app.get('/api/*', function(req, res){ res.json({ error:'Invalid API call' })});
  
  /*** Website ***/
  app.get('*', function(req, res){ res.render('index'); });
};
