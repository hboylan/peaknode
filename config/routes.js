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
  app.post('/api/zones', zones.create);
  app.get('/api/zones/resync', zones.resync);
  app.get('/api/zones/:id', zones.show);
  
  // audio
  var audio = require('../api/audio');
  app.get('/api/audio', audio.zones);
  app.post('/api/audio', audio.create);
  app.get('/api/audio/:id', audio.zone);
  app.post('/api/audio/:id', audio.state);
  
  //security
  var sec = require('../api/security');
  app.get('/api/security', sec.status);
  app.post('/api/security', sec.setStatus);
  
  //lighting
  var lights = require('../api/lighting');
  app.get('/api/lights', lights.list);
  
  /*** Website ***/
  app.get('*', function(req, res){ res.render('index'); });
};
