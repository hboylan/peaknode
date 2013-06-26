var express = require('express'),
  app = express(),
  db = require('./db.js'),
  config = require('./config.json');

app.get('/', db.Zone.zones);

app.get('/config', function(req, res) {
  res.json(config);
});

app.get('/make', function(req, res) {
  db.Project.create({
    'title':'First',
    'description':'desc...'
  }).on('success', function(){
    res.json(db.Project.findAll());
  });
});

app.listen(config.net.port);
