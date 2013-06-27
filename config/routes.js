module.exports = function(app) {
  
  // test
  app.get('/bryant', function(req, res){
    res.json({
      'message':'Hello Bryant!',
    });
  });
  
  // home
  var home = require('../controllers/home');
  app.get('/', home.index);
  app.post('/message', home.message);

  // users
  var users = require('../controllers/users');
  app.get('/users', users.list);
  app.get('/users/:id', users.show);
  app.post('/users', users.create);
  app.post('/users/login', users.login);
  
};
