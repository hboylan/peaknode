module.exports = function(sequelize, DataTypes) {
  return sequelize.define('zone', {
    name: DataTypes.STRING,
    zoneId: { type:DataTypes.INTEGER, validate:{ min:1, max:8 }},
  }, {
    instanceMethods:{
      parse:function(){
        this.id = this.updatedAt = this.createdAt = undefined;
        return this;
      }
    },
    
    classMethods:{
      list:function(res, success){
        this.all({ order:'zoneId ASC' }).success(success);
      }
    }
  });
};
