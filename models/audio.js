module.exports = function(sequelize, DataTypes) {
  return sequelize.define('audio', {
    name: DataTypes.STRING,
    audioId: { type:DataTypes.INTEGER, validate:{ min:1, max:8 }},
    source: { type:DataTypes.INTEGER, validate:{ min:1, max:8 }, defaultValue:1 },
    state: { type:DataTypes.ENUM, values:['on', 'off', 'mute'], defaultValue:'off' },
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
        this.state = state;
      },
      
      setVolume:function(client, vol){
        var mute    = vol == 0
          , msg     = mute? 'audiocontrol '+this.audioId+' 3' : 'audiovolume '+this.audioId+' '+vol;
  
        client.send(msg);
        this.state = 'on';
        this.volume = parseInt(vol, 10);
      },
      
    },
    
    classMethods: {
      
      list:function(success){
        this.all({ order:'audioId ASC' }).success(success);
      }
    }
  });
};
