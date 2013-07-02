module.exports = function(sequelize, DataTypes) {
  return sequelize.define('audio', {
    power: { type:DataTypes.BOOLEAN, defaultValue:false },
    volume: { type:DataTypes.INTEGER, validate:{ min:0, max:100 }, defaultValue:0 },
  }, {
    freezeTableName: true
  });
};
