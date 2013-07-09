module.exports = function(sequelize, DataTypes) {
  return sequelize.define('device', {
    name: DataTypes.STRING,
    power: DataTypes.INTEGER,
    active: { DataTypes.BOOLEAN, defaultValue:false },
  });
};
