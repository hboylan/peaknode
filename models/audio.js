module.exports = function(sequelize, DataTypes) {
  return sequelize.define('audio', {
    name: DataTypes.STRING,
    source: { type:DataTypes.INTEGER, validate:{ min:1, max:8 }, defaultValue:1 },
    on: { type:DataTypes.BOOLEAN, defaultValue:false },
    mute: { type:DataTypes.BOOLEAN, defaultValue:false },
    volume: { type:DataTypes.INTEGER, validate:{ min:0, max:100 }, defaultValue:0 },
  }, {
    freezeTableName: true,
    instanceMethods:{
      parse:function(){
        this.zoneId = this.createdAt = this.updatedAt = undefined;
        return this;
      }
    },
    classMethods:{
      
      parse:function(audioZones){
        if(audioZones == undefined) audioZones = [];
        else audioZones.forEach(function(a){ a = a.parse(); })
        return audioZones;
      }
    }
  });
};
