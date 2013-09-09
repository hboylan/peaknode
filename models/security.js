module.exports = function(sequelize, DataTypes) {
  var dt = require('../lib/datetime')
  
  return sequelize.define('security', {
    state: { type:DataTypes.ENUM, values:['armed', 'disarmed', 'arming'], defaultValue:'disarmed' },
    armTimeout: { type:DataTypes.INTEGER, defaultValue:30 },
  }, {
    freezeTableName: true,
    instanceMethods: {
      parse:function(){
        return { id:this.id, state:this.state, timestamp:dt.dateTimeFormat(this.updatedAt), armTimeout:this.armTimeout };
      },
    },
    classMethods: {
      armTime:function(){ return 30 }
    }
  });
};
