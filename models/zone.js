module.exports = function(sequelize, DataTypes) {
  return sequelize.define('zone', {
    name: DataTypes.STRING,
  }, {
    instanceMethods:{
      parse:function(){
        this.updatedAt = this.createdAt = undefined;
        return this;
      },
      
      parse:function(attr){
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
      list:function(res, success){
        this.all({ order:'zoneId ASC' }).success(success);
      },
    },
  });
};
