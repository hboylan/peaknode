module.exports = function(app) {
  
  /*** Website ***/
  var web = require('../views/controller');
  app.get('/', web.index);
  app.get('/security', web.security);
  app.get('/media', web.media);

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
  app.get('/api/zones/:id', zones.show);
  app.post('/api/zones', zones.create);
  
  // audio
  var audio = require('../api/audio');
  app.get('/api/audio', audio.zones);
  app.get('/api/audio/:id', audio.zone);
  app.post('/api/audio', audio.create);
  app.post('/api/audio/:id', audio.volume);
  
  //security
  var sec = require('../api/security');
  app.get('/api/security/:status', sec.test);
  app.get('/api/security', sec.status);
  app.post('/api/security', sec.setStatus);
};
