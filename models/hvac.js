module.exports = function(sequelize, DataTypes) {
  var dt = require('../lib/datetime')
  return sequelize.define('hvac', {
    on: { type:DataTypes.BOOLEAN, defaultValue:false },
    temperature: { type:DataTypes.INTEGER, validate:{ min:68, max:74 }, defaultValue:70 },
    fanSpeed: { type:DataTypes.INTEGER, validate:{ min:0, max:8 }, defaultValue:0 },
    fanAngle: { type:DataTypes.INTEGER, validate:{ min:0, max:8 }, defaultValue:0 },
    mode: DataTypes.ENUM('fan', 'cool', 'heat')
  }, {
    freezeTableName: true,
    instanceMethods:{
      parse:function(){
        this.zoneId = this.createdAt = this.updatedAt = undefined;
        return this;
      }
    },
    classMethods:{
      parse:function(units){
        var list = []
        if(units != undefined) units.forEach(function(u){ list.push(u.parse()) })
        return list
      }
    }
  })
}
