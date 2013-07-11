module.exports = function(app) {
  
  /*** Website ***/
  var web = require('../views/controller');
  app.get('/', web.index);
  app.get('/hvac', web.hvac);
  app.get('/security', web.security);
  app.get('/media', web.media);
  app.get('/energy', web.energy);
  app.get('/register', web.register);
  app.get('/test', web.test);
  app.get('/bryant', web.bryant);
  app.post('/message', web.message);

  /*** API ***/
  // users
  var users = require('../api/users');
  app.get('/api/users', users.list);
  app.get('/api/users/:id', users.show);
  app.post('/api/users', users.create);
  app.post('/api/login', users.login);
  
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
};
