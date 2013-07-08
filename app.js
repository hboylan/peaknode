var express = require('express')
  , config  = require('./config/config.json')
  , http    = require('http')
  , tcp     = require('./config/connect')
  , app     = express();

//Configure our application environment
app.configure(function() {
  app.set('port', config.http_port);
  app.set('view engine', 'ejs');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser(config.cookie_secret));
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

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

