
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , api = require('./routes/api')
  , connection = require('./connection')
  , http = require('http')
  , path = require('path');

var app = express();

// tcp server client configuration
var clientConfig = {
  host:'127.0.0.1',
  port:2237,
  secret:'C3o8Y5x+vkFQ/ygM+vCmwQp/SNyKzToWqCZwKsdw2Lwk781E0DabovAqEbNuqgUnvFwV2ZI+K0/NE/br9PNCQw=='
};

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// api urls
app.get('/', routes.index);
app.get('/api', api.index);
app.get('/users', user.list);

app.set('connection', connection.client(clientConfig));
app.get('connection').connect();

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

exports.app = function() {
  return app;
}
