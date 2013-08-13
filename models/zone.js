module.exports = function(sequelize, DataTypes) {
  return sequelize.define('zone', {
    name: DataTypes.STRING,
  }, {
    instanceMethods:{
      parse:function(){
        this.updatedAt = this.createdAt = undefined;
        return this;
      },
    },
    
    classMethods:{
      
      parse:function(zones){
        if(zones == undefined) zones = [];
        else zones.forEach(function(z){ z = z.parse() })
        return zones;
      },
    },
  });
};
