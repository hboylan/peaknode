module.exports = function(sequelize, DataTypes) {
  var dt = require('../lib/datetime')
  
  return sequelize.define('security', {
    state: { type:DataTypes.ENUM, values:['off', 'day', 'night', 'vacation', 'day armed', 'disarming', 'arming'] },
  }, {
    freezeTableName: true,
    instanceMethods: {
      parse:function(){
        return { id:this.id, state:this.state, timestamp:dt.dateTimeFormat(this.createdAt) };
      },
    },
    classMethods: {
      
      entries:function(res){
        this.find(1).success(function(entry){
          res.json(entry.parse())
        })
      },
    }
  });
};
