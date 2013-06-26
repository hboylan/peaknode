exports.index = function(req, res){
  res.json([
    {
      name:"zones",
      api:{
        zones:"api/zones/",
        zone:"api/zones/:id",
      }
    },
    {
      name:"users",
      api:{
        users:"api/users/",
        user:"api/users/:id",
      }
    }
  ]);
};