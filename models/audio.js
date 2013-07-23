module.exports = function(sequelize, DataTypes) {
  return sequelize.define('audio', {
    name: DataTypes.STRING,
    source: { type:DataTypes.INTEGER, validate:{ min:1, max:8 }, defaultValue:1 },
    state: { type:DataTypes.ENUM, values:['on', 'off', 'mute', 'unmute'], defaultValue:'off' },
    volume: { type:DataTypes.INTEGER, validate:{ min:0, max:100 }, defaultValue:0 },
  }, {
    freezeTableName: true,
    instanceMethods:{
      
      parse:function(){
        this.createdAt = this.updatedAt = undefined;
        return this;
      },
      
      setState:function(client, state){
        var states  = ['off', 'on', 'mute', 'unmute'];
        client.send('audiocontrol '+this.id+' '+states.indexOf(state));
        this.state = state;
      },
      
      setVolume:function(client, vol){
        var mute    = vol == 0
          , msg     = mute? 'audiocontrol '+this.id+' 3' : 'audiovolume '+this.id+' '+vol;
  
        client.send(msg);
        this.state = 'on';
        this.volume = parseInt(vol, 10);
      },
      
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
