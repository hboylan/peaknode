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
config.models.forEach(function(m){
  models[m] = sequelize.import(__dirname + '/../models/'+m)
});

//Archives
config.archives.forEach(function(m){
  models[m+'_archive'] = sequelize.import(__dirname + '/../models/archives/'+m)
})

//Create model relationships
var Zone  = models.zone
  , Audio = models.audio
  , Light = models.light
  , Security = models.security
  , Lock = models.lock
  , Appliance = models.appliance
Zone.hasMany(Audio)
  .hasMany(Light)
  .hasMany(Lock)
  .hasMany(models.temperature_archive, {as:'tempReadings'})
Light.hasMany(models.light_archive, { as:'archives' })
sequelize.sync()

//Drop and recreate table
//Then reconfigure the table based upon the config.json file
function resyncTable(model, confItems, fn){
  model.drop().success(function(){
    model.sync().success(function(){
      function configTable(m, items){ if(items.length) m.create(items.pop()).success(function(){ configTable(m, items) }) }
      configTable(model, confItems.reverse())
      fn()
    })
  })
}

function updateTrigger(name, tbl, cols, params){
  sequelize.query('CREATE TRIGGER '+name+
    ' AFTER UPDATE ON '+tbl+
    ' FOR EACH ROW INSERT INTO '+tbl+'_archive'+
    ' ('+cols.join(', ')+', createdAt, updatedAt)'+
    ' VALUES ('+params.join(', ')+', new.updatedAt, new.updatedAt)', null, {raw:true})
}

models.resync = function(req, res){
  if(req.query.username != config.username || req.query.password != config.password)
    return res.json({ error:'Invalid credentials' })

  resyncTable(Zone, config.zones, function(){
    resyncTable(Audio, config.audio, function(){
      resyncTable(Light, config.lights, function(){
        resyncTable(Security, [{}], function(){
          models.security_archive.drop()
          
          resyncTable(Lock, config.locks, function(){
            models.lock_archive.drop()
            
            resyncTable(Appliance, config.appliances, function(){
                            
              //MySQL Triggers
              updateTrigger('lightLog', 'light', ['lightId', 'level'], ['new.id', 'new.level'])
              updateTrigger('securityLog', 'security', ['state'], ['new.state'])
              updateTrigger('lockLog', 'lock', ['locked'], ['new.locked'])

              res.json({ success:true })
            })
          })
        })
      })
    })
  })
}

module.exports = models