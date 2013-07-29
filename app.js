var express = require('express')
  , config  = require('./config.json')
  , http    = require('http')
  , ejs     = require('ejs')
  , app     = express();

//Configure our application environment
app.configure(function() {
  app.set('views', __dirname + '/views')
  app.set('view engine', 'ejs')
  app.set('view options', { open:'{%', close:'%}' })
  app.set('port', config.http_port)
  app.use(express.logger('dev'))
  app.use(express.bodyParser({ uploadDir:__dirname + '/tmp' }))
  app.use(express.cookieParser(config.cookie_secret))
  app.use(express.methodOverride())
  app.use(express.static(__dirname + '/public'))
  app.use(app.router)
})

app.configure('development', function(){
  app.use(express.errorHandler());
})

//Configure Omnilink TCP Client
app.set('omnilink-client', require('./lib/omnilink'))

//Configure FitBit Client
app.set('fitbit-client', require('./lib/fitbit')(config.fitbit_key, config.fitbit_secret))

//Configure XBMC Client
app.set('xbmc-client', require('./lib/xbmc'))

//Configure API Handlers
require('./routes')(app)

//Begin listening to port specified in 'config.http_port'
http.createServer(app).listen(app.get('port'), function(){
  console.log("PeakHomeAutomation API listening at localhost:" + app.get('port'))
})

//Export app
module.exports = app;