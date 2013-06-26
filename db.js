var Sequelize = require('sequelize'),
  config = require('./config.json').db;
  
var sequelize = new Sequelize(config.name, config.user, config.password, {
  dialect:config.type
});

var models = ['Zone'];
models.forEach(function(model) {
  module.exports[model] = sequelize.import(__dirname+'/models/'+model);
});

sequelize.sync();