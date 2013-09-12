module.exports = function(sequelize, DataTypes) {
  var datetime = require('../lib/datetime')
  return sequelize.define('lock', {
    locked: { type:DataTypes.BOOLEAN, defaultValue:false },
    nodeId: DataTypes.INTEGER,
    name: DataTypes.STRING,
  }, {
    instanceMethods:{
      parse:function(){
        return { id:this.id, name:this.name, locked:this.locked, node:this.nodeId, timestamp:datetime.dateTimeFormat(this.updatedAt) }
      },
    },
  })
}
