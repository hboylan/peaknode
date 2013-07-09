module.exports = function(sequelize, DataTypes) {
  var Audio   = require('audio')
    , Device  = require('device')
    , Zone  = sequelize.define('zone', {
      name: DataTypes.STRING,
    });
  Zone.hasOne(Audio, { as:'audio' });
  Zone.hasMany(Device, { as:'devices' });
  return Zone;
};
