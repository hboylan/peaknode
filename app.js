var express = require('express')
  , config  = require('./config.json')
  , http    = require('http')
  , cors    = require('cors')
  , ejs     = require('ejs')
  , app     = express();

//Configure our application environment
app.configure(function() {
  app.set('views', __dirname + '/views')
  app.set('view engine', 'ejs')
  app.set('port', config.http_port)
  app.use(express.logger('dev'))
  app.use(express.bodyParser({ uploadDir:__dirname + '/tmp' }))
  app.use(express.cookieParser('wvu-peak-api'))
  app.use(express.methodOverride())
  app.use(express.static(__dirname + '/public'))
  app.use(cors())
  app.use(app.router)
  ejs.open = '{{'
  ejs.close = '}}'
})

app.configure('development', function(){
  app.use(express.errorHandler());
})

var db = require('./lib/database')

//Configure Omnilink TCP Client
app.set('omnilink-client', require('./lib/omnilink'))

//Configure FitBit Client
app.set('fitbit-client', require('./lib/fitbit')(config.fitbit_key, config.fitbit_secret, db.user))

//Configure XBMC Client
app.set('xbmc-client', require('./lib/xbmc')(config))

//Configure API Handlers
//Pass MySQL connection via SequelizeJS
require('./routes')(app, db)

//Begin listening to port specified in 'config.http_port'
http.createServer(app).listen(app.get('port'), function(){
  console.log("WVUPeak API running at localhost:" + app.get('port'))
})

//Export app
module.exports = app;