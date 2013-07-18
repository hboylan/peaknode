module.exports = function(sequelize, DataTypes) {
  return sequelize.define('audio', {
    name: DataTypes.STRING,
    audioId: { type:DataTypes.INTEGER, validate:{ min:1, max:8 }},
    source: { type:DataTypes.INTEGER, validate:{ min:1, max:8 }, defaultValue:1 },
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
        client.send('audiocontrol '+this.audioId+' '+state);
        this.active = state? true : false;
        this.save();
      },
      
      setVolume:function(client, vol){
        var mute    = vol == 0
          , msg     = mute? 'audiocontrol '+this.audioId+' 3' : 'audiovolume '+this.audioId+' '+vol;
  
        client.send(msg);
        this.active = true;
        this.volume = vol;
        this.save();
      },
      
    },
    
    classMethods: {
      
      list:function(res, success){
        this.all({ order:'audioId ASC' }).success(success);
      }
    }
  });
};
