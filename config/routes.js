module.exports = function(app) {

  // home
  var home = require('../controllers/home');
  app.get('/', home.index);

  // users
  var users = require('../controllers/users');
  app.get('/users', users.list);
  app.get('/users/:id', users.show);
  app.post('/users', users.create);
  
};
