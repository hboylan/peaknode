var express = require('express')
  , config  = require('./config/config.json')
  , http    = require('http')
  , ejs     = require('ejs')
  , app     = express();

//Configure our application environment
app.configure(function() {
  app.set('view engine', 'ejs');
  app.set('port', config.http_port);
  app.use(express.logger('dev'));
  app.use(express.bodyParser({ uploadDir:__dirname + '/tmp' }));
  app.use(express.cookieParser(config.cookie_secret));
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
  
  ejs.open = '{%';
  ejs.close = '%}';
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//Configure TCP Client Instance
require('./config/omnilink')(app);

//Configure FitBit Client
require('./config/fitbit')(app);

// Configure XBMC Client
require('./config/xbmc')(app);

//Configure route handlers
require('./config/routes')(app);

//Begin listening to port specified in 'config.http_port'
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

//Export app
module.exports = app;