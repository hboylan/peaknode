module.exports = function(sequelize, DataTypes) {
  return sequelize.define('zone', {
    name: DataTypes.STRING,
  }, {
    instanceMethods:{
      parse:function(){
        this.updatedAt = this.createdAt = undefined;
        return this;
      },
      
      eagerParse:function(attr){
        this.audio = (attr.audio != undefined)? attr.audio : undefined;
        this.lights = (attr.lights != undefined)? attr.lights : undefined;
        return {
          id: this.id,
          name: this.name,
          audio: this.audio,
          lights: this.lights,
        };
      },
    },
    
    classMethods:{
      
      parse:function(zones){
        if(zones == undefined) zones = [];
        else zones.forEach(function(z){ z = z.parse(); });
        return zones;
      },
    },
  });
};
