module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    pinkey: DataTypes.INTEGER(4),
    
    realname: DataTypes.STRING,
    email:{type:DataTypes.STRING, allowNull:true, defaultValue:true},
  }, {
    instanceMethods: {
      
      //Parses the user model for client use
      parse:function(){
        this.pinkey = require('crypto').createHash('sha512').update(String(this.pinkey)).digest('hex');
        this.password = undefined;
        return this;
      },
      
    }
  });
};
