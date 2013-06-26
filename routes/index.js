var app = require('../app');
/*
 * GET home page.
 */

exports.index = function(req, res){
  app.app().get('connection').send('hello');
  res.json({ title: 'Express' });
};