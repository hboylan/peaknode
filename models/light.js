module.exports = function(sequelize, DataTypes) {
  return sequelize.define('light', {
    name: DataTypes.STRING,
    unit: { type:DataTypes.INTEGER, validate:{ min:1, max:511 } },
    level: { type:DataTypes.INTEGER, validate:{ min:0, max:100 }, defaultValue:0 },
    state: { type:DataTypes.ENUM, values:['on', 'off', 'dimming', 'brightening'], defaultValue:'off' },
  }, {
    instanceMethods:{
      parse:function(){
        this.id = this.updatedAt = this.createdAt = undefined;
        return this;
      }
    },
    
    classMethods:{
      list:function(success){
        this.all({ order:'unit ASC' }).success(success);
      }
    }
  });
};
