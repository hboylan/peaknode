module.exports = function(app, express) {
  var path = require('path')
    , config = require('./config.json');

  app.configure(function() {
    app.set('port', config.http_port);
    // app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
  });

  app.configure('development', function(){
    app.use(express.errorHandler());
  });
};
