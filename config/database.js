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

sequelize.sync().done(function(e, a){
  var Zone = models['zone'];
  Zone.all().success(function(zones){
    if(zones == undefined || zones.length != config.zones.length)
    {
      //Reset zones
      if(zones != undefined)
        for(z in zones)
          zones[z].destroy();
      for(n in config.zones)
      {
        var zone = config.zones[n];
        Zone.create({ name:zone.name, zoneId:zone.id });
      }
    }
  });
});

module.exports = models;
