module.exports = function(app) {
  
  // test
  var test = require('../controllers/test');
  app.get('/', test.index);
  app.get('/test', test.bash);
  app.get('/bryant', test.bryant);
  app.post('/message', test.message);

  // users
  var users = require('../controllers/users');
  app.get('/users', users.list);
  app.get('/users/:id', users.show);
  app.post('/users', users.create);
  app.post('/login', users.login);
  
  // zones
  var zones = require('../controllers/zones');
  app.get('/zones', zones.list);
  app.get('/zones/:id', zones.show);
  app.post('/zones', zones.create);
  
  // audio
  var audio = require('../controllers/audio');
  app.get('/audio', audio.zones);
  app.get('/audio/:id', audio.zone);
  app.post('/audio', audio.volume);
  app.get('/audio/sources', audio.sources);
  app.post('/audio/create', audio.create);
};
