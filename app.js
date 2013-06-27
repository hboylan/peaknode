var express = require('express')
  , http    = require('http')
  , tcp     = require('./config/connect')
  , app     = express();

//Configure our application environment
require('./config/environment')(app, express);

//Configure TCP Client Instance
// var client = tcp.client();
// app.set('client', client);

//Configure route handlers
require('./config/routes')(app);

//Function exports
exports.client = function() {
  return app.get('client');
};

//Begin listening to port specified in 'config.http_port'
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

