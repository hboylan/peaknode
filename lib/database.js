//TODO reconfigure as Prototype

var config = require('../config.json')
var Sequelize = require('sequelize')
var sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.db_host,
  dialect: config.db_type,
  logging: false,
  pool: { maxConnections: 15, maxIdleTime: 30}
})

//Instantiate models
var models = {};
['user', 'zone', 'audio', 'light'].forEach(function(m){
  models[m] = sequelize.import(__dirname + '/../models/'+m)
});

//Archives
['energy', 'security', 'light', 'temperature'].forEach(function(m){
  models[m+'_archive'] = sequelize.import(__dirname + '/../models/archives/'+m)
})

//Create model relationships
var Zone  = models.zone
  , Audio = models.audio
  , Light = models.light;
Zone.hasMany(Audio).hasMany(Light).hasMany(models.temperature_archive, {as:'tempReadings'})
Light.hasMany(models.light_archive, { as:'archives' })


//Sync updates
sequelize.sync()

module.exports = models