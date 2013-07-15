module.exports = function(sequelize, DataTypes) {
  return sequelize.define('zone', {
    name: DataTypes.STRING,
    zone_id: DataTypes.Integer
  });
};
