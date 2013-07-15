module.exports = function(sequelize, DataTypes) {
  return sequelize.define('zone', {
    name: DataTypes.STRING,
    zone_id: { type:DataTypes.INTEGER, validate:{ min:1, max:8 }},
  });
};
