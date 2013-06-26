
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.json([
    {
      name:"bryan",
      age:21
    },
    {
      name:"testing",
      age:31
    }
  ]);
};