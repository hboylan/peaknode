module.exports = function(sequelize, DataTypes) {
  return sequelize.define('security', {
    status: { type:DataTypes.ENUM, values:['off', 'day', 'night', 'vacation', 'day armed', 'disarming', 'arming'] },
    timestamp: { type:DataTypes.DATE, defaultValue:sequelize.NOW }
  }, {
    freezeTableName: true
  });
};
