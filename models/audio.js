module.exports = function(sequelize, DataTypes) {
  return sequelize.define('audio', {
    name: DataTypes.STRING,
    zone: { type:DataTypes.INTEGER, validate:{ min:1, max:8 }},
    active: { type:DataTypes.BOOLEAN, defaultValue:false },
    mute: { type:DataTypes.BOOLEAN, defaultValue:false },
    volume: { type:DataTypes.INTEGER, validate:{ min:0, max:100 }, defaultValue:0 },
  }, {
    freezeTableName: true,
    instanceMethods:{
      
      parse:function(){
        this.id = this.createdAt = this.updatedAt = undefined;
        return this;
      },
      
      setState:function(client, state){
        client.send('audiocontrol '+this.zone+' '+state);
        this.active = state? true : false;
        this.save();
      },
      
      setVolume:function(client, vol){
        var mute    = vol == 0
          , msg     = mute? 'audiocontrol '+this.zone+' 3' : 'audiovolume '+this.zone+' '+vol;
  
        client.send(msg);
        this.active = true;
        this.volume = vol;
        this.save();
      },
      
    },
    
    classMethods:{
      //Helper functions
      checkZone:function(res, zone){
        if(zone < 1 || zone > 8 || zone == undefined) res.json({'error':'Audio Zone must be 1-8'});
      },
    }
  });
};
