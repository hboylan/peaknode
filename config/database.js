var config = require(__dirname + '/../config/config.json');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.db_host,
  dialect: config.db_type,
  logging: false,
  pool: { maxConnections: 15, maxIdleTime: 30}
});

var models = {};
config.models.forEach(function(m){
  models[m] = sequelize.import(__dirname + '/../models/'+m);
  models[m].sync();
});

// models['zone'].hasOne(models['audio'], { as:'Audio' });

sequelize.sync();
module.exports = models;
