var path    = require('path')
  , config  = require('./config.json')
  , ejs     = require('ejs');

module.exports = function(app, express) {

  app.configure(function() {
    app.set('port', config.http_port);
    // app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname, '/public'));
    app.set('view engine', 'ejs');
    
    ejs.open = '{%';
    ejs.close = '%}';
  });

  app.configure('development', function(){
    app.use(express.errorHandler());
  });
};
