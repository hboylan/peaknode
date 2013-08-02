module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    pinkey: DataTypes.INTEGER(4),
    
    realname: DataTypes.STRING,
    email: { type:DataTypes.STRING, allowNull:true, defaultValue:null },
    
    fitbit_token: { type:DataTypes.STRING, allowNull:true, defaultValue:null },
    fitbit_secret: { type:DataTypes.STRING, allowNull:true, defaultValue:null },
  }, {
    instanceMethods: {
      
      //Encrypt the user pin number before sending to client
      encrypted:function(){
        return require('crypto').createHash('sha512').update(String(this.pinkey)).digest('hex');
      },
      
      //Parses the user model for client use
      parse:function(showPin){
        this.pinkey = showPin? this.encrypted() : undefined;
        this.password = this.createdAt = this.updatedAt = undefined;
        return this;
      },
    },
    
    classMethods: {
      logout:function(res){
        res.clearCookie('user', {path:'/'})
        res.clearCookie('fitbit_client', {path:'/'})
      },
    }
  });
};
