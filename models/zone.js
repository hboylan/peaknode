module.exports = function(sequelize, DataTypes) {
  return sequelize.define('zone', {
    name: DataTypes.STRING,
  }, {
    instanceMethods:{
      parse:function(){
        this.updatedAt = this.createdAt = undefined;
        return this;
      }
    },
    
    classMethods:{
      list:function(res, success){
        this.all({ order:'zoneId ASC' }).success(success);
      },
    }
  });
};
