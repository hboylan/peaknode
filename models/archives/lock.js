module.exports = function(sequelize, DataTypes) {
  var dt = require('../../lib/datetime')
  
  return sequelize.define('lock_archive', {
    locked: DataTypes.BOOLEAN,
  }, {
    freezeTableName: true,
    instanceMethods: {
      parse:function(){
        return { id:this.id, locked:this.locked, timestamp:dt.dateTimeFormat(this.createdAt) };
      },
    },
  })
}
