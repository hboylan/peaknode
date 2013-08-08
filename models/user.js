module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    pinkey: DataTypes.STRING,
    
    realname: DataTypes.STRING,
    email: { type:DataTypes.STRING, allowNull:true, defaultValue:'N/A' },
    
    fitbit_token: { type:DataTypes.STRING, allowNull:true, defaultValue:null },
    fitbit_secret: { type:DataTypes.STRING, allowNull:true, defaultValue:null },
  }, {
    instanceMethods: {
      //Parses the user model for client use
      parse:function(){
        this.pinkey = this.password = this.fitbit_token = this.fitbit_secret = this.createdAt = this.updatedAt = undefined;
        return this;
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
