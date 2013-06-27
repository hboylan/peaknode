exports.zones = function(req, res) {
  //Query tcp for audio zones
};

exports.sources = function(req, res) {
  //Query tcp for audio sources
};

exports.volume = function(req, res) {
  // zone, setting
  res.json(req.body);
};

exports.play = function(req, res) {
  // start playing from source
};