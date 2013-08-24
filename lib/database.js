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
['user', 'zone', 'audio', 'light', 'security'].forEach(function(m){
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


//Use to resync database information and triggers
function createZones(zones){
  if(!zones.length) return;
  Zone.create({ name:zones.pop() }).success(function(){ createZones(zones) })
}
function createAudio(audio){
  if(!audio.length) return;
  var a = audio.pop();
  Audio.create({ name:a.name, zoneId:a.zone }).success(function(){ createAudio(audio) })
}
function createLights(lights){
  if(!lights.length) return;
  var l = lights.pop();
  Light.create({ name:l.name, unit:l.unit, zoneId:l.zone }).success(function(){ createLights(lights) })
}
function updateTrigger(name, tbl1, tbl2, cols, params){
  sequelize.query('CREATE TRIGGER '+name+
    ' AFTER UPDATE ON '+tbl1+
    ' FOR EACH ROW INSERT INTO '+tbl2+
    ' ('+cols.join(', ')+', createdAt, updatedAt)'+
    ' VALUES ('+params.join(', ')+', new.updatedAt, new.updatedAt)', null, {raw:true})
}

models.resync = function(res){
  Zone.drop().success(function(){
    Zone.sync().success(function(){
      createZones(config.zones.reverse())

      //Drop the table and resync with config file
      Audio.drop().success(function(){
        Audio.sync().success(function(){
          createAudio(config.audio.reverse())
        
          Light.drop().success(function(){
            Light.sync().success(function(){
              createLights(config.lights.reverse())
              
              //MySQL Triggers
              updateTrigger('lightLog', 'lights', 'light_archive', ['lightId', 'level'], ['new.id', 'new.level'])
              updateTrigger('securityLog', 'security', 'security_archive', ['state'], ['new.state'])
              
              res.json({ success:true })
            })
          })
        })
      })
    })
  })
}

module.exports = models