module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    pinkey: DataTypes.INTEGER(4),
    
    realname: DataTypes.STRING,
    email:{type:DataTypes.STRING, allowNull:true, defaultValue:true},
  }, {
    instanceMethods: {
      
      //Encrypt the user pin number before sending to client
      encrypted:function(){
        return require('crypto').createHash('sha512').update(String(this.pinkey)).digest('hex');
      },
      
      //Parses the user model for client use
      parse:function(showPin){
        this.pinkey = showPin? this.encrypted() : undefined;
        this.password = undefined;
        this.createdAt = this.updatedAt = undefined;
        return this;
      },
    },
    
    classMethods: {
      login:function(res, u, p, success){
        this.find({ where:{ username:u, password:p }})
          .success(function(u){
            if(u == undefined)  return res.json({ error:'Invalid user' });
            success(u);
          })
          .error(function(err){
            res.json({ error:'Invalid username/password' });
          });
      },
      
      logout:function(res){
        res.clearCookie('user', { path: '/' }); 
      }
    }
  });
};
