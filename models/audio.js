module.exports = function(sequelize, DataTypes) {
  return sequelize.define('audio', {
    name: DataTypes.STRING,
    source: { type:DataTypes.INTEGER, validate:{ min:1, max:8 }, defaultValue:1 },
    state: { type:DataTypes.ENUM, values:['on', 'off', 'mute'], defaultValue:'off' },
    volume: { type:DataTypes.INTEGER, validate:{ min:0, max:100 }, defaultValue:0 },
  }, {
    freezeTableName: true,
    instanceMethods:{
      
      parse:function(){
        this.createdAt = this.updatedAt = undefined;
        return this;
      },
      
      setState:function(client, state){
        var states  = ['off', 'on', 'unmute', 'mute'];
        client.send('audiocontrol '+this.id+' '+states.indexOf(state));
        this.state = state;
      },
      
      setVolume:function(client, vol){
        // if(this.state == 'off') client.send('audiocontrol '+this.id+' 1');
        client.send('audiovolume '+this.id+' '+vol);
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
