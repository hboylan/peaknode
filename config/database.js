var config = require(__dirname + '/../config/config.json');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.db_host,
  dialect: config.db_type,
  logging: false,
  pool: { maxConnections: 15, maxIdleTime: 30}
});

var models = {};
['user', 'zone', 'security', 'audio'].forEach(function(m){
  models[m] = sequelize.import(__dirname + '/../models/'+m);
});
// models['zone'].hasOne(models['audio'], { as:'Audio' });

//Sync zones with config file
sequelize.sync().done(function(e, a){
  console.log('Finished syncing DB');
});

module.exports = models;
