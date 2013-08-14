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

function updateTrigger(name, tbl1, tbl2, cols, params){
  sequelize.query('CREATE TRIGGER '+name+
    ' AFTER UPDATE ON '+tbl1+
    ' FOR EACH ROW INSERT INTO '+tbl2+
    ' ('+cols.join(', ')+', createdAt, updatedAt)'+
    ' VALUES ('+params.join(', ')+', new.updatedAt, new.updatedAt)', null, {raw:true})
}

models.resync = function(){
  db.zone.drop().success(function(){
    db.zone.sync().success(function(){
      zones = config.zones;
      syncZones(zones.reverse())

      //Drop the table and resync with config file
      db.audio.drop().success(function(){
        db.audio.sync().success(function(){
          audio = config.audio
          syncAudio(audio.reverse())
        
          db.light.drop().success(function(){
            db.light.sync().success(function(){
              lights = config.lights;
              syncLights(lights.reverse())
              
              //MySQL Triggers
              updateTrigger('lightLog', 'lights', 'light_archive', ['lightId', 'level'], ['new.id', 'new.level'])
              
              res.json({ success:true })
            })
          })
        })
      })
    })
  })
}

module.exports = models