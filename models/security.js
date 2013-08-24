module.exports = function(sequelize, DataTypes) {
  var dt = require('../lib/datetime')
  
  return sequelize.define('security', {
    armed: DataTypes.BOOLEAN,
    armTimeout: DataTypes.INTEGER,
  }, {
    freezeTableName: true,
    instanceMethods: {
      parse:function(){
        return { id:this.id, armed:this.armed, timestamp:this.updatedAt.toUTCString(), armTimeout:this.armTimeout };
      },
    }
  });
};
