module.exports = function(app) {
  
  /*** Website ***/
  var web = require('../views/controller');
  app.get('/', web.index);
  app.get('/hvac', web.hvac);
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
  app.get('/zones', zones.list);
  app.get('/zones/:id', zones.show);
  app.post('/zones', zones.create);
  
  // audio
  var audio = require('../api/audio');
  app.get('/audio', audio.zones);
  app.get('/audio/:id', audio.zone);
  app.post('/audio', audio.volume);
  app.get('/audio/sources', audio.sources);
  app.post('/audio/create', audio.create);
};
