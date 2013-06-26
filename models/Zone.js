module.exports = function(sequelize, types){
  return sequelize.define('Zone', {
    name:types.STRING,
  }, {
    classMethods:{
      zones:function(req, res){
        this.all().success(function(zones){
          res.json(zones);
        });
      }
    }
  });
};
