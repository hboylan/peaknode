module.exports = function(sequelize, DataTypes) {
  return sequelize.define('audio', {
    name: type:DataTypes.STRING,
    zone_id: { type:DataTypes.INTEGER, validate:{ min:1, max:8 }}
    active: { type:DataTypes.BOOLEAN, defaultValue:false },
    volume: { type:DataTypes.INTEGER, validate:{ min:0, max:100 }, defaultValue:0 },
  }, {
    freezeTableName: true
  });
};
