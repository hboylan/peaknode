var config = require(__dirname + '/../config/config.json');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.db_host,
  dialect: config.db_type,
  logging: false,
  pool: { maxConnections: 15, maxIdleTime: 30}
});

//Instantiate models
var models = {};
['user', 'zone', 'security', 'audio', 'light'].forEach(function(m){
  models[m] = sequelize.import(__dirname + '/../models/'+m);
});

//Create model relationships
var Zone  = models.zone
  , Audio = models.audio
  , Light = models.light;

Zone.hasMany(Audio);
Zone.hasMany(Light);

//Sync updates
sequelize.sync();

module.exports = models;