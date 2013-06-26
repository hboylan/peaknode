var express = require('express')
  , http    = require('http')
  , app     = express();

require('./config/environment.js')(app, express);
require('./config/routes.js')(app);
require('./config/connect.js')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

