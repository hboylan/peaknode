module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    pinkey: DataTypes.STRING,
    realname: DataTypes.STRING,
    email: { type:DataTypes.STRING, allowNull:true, defaultValue:'N/A' },
    
    fitbit_token: { type:DataTypes.STRING, allowNull:true, defaultValue:null },
    fitbit_secret: { type:DataTypes.STRING, allowNull:true, defaultValue:null },
    token_timeout: { type:DataTypes.INTEGER, validate:{min:30*1000, max:30*60*1000}, defaultValue:15*60*1000 },
  }, {
    instanceMethods: {
      //Parses the user model for client use
      parse:function(sessID){
        return { id:this.id, username:this.username, realname:this.realname, email:this.email, sessionID:sessID, fitbit_token:this.fitbit_token, fitbit_secret:this.fitbit_secret }
      },
    },
    
    classMethods: {
      //Encrypt the user pin number before sending to client
      encrypt:function(str){
        return require('crypto').createHash('sha512').update(String(str)).digest('hex');
      },
    }
  });
};
