var isosurface = require("isosurface")

var mesh = isosurface.surfaceNets([64,64,64], function(x,y,z) {
  return x*x + y*y + z*z - 100
}, [[-11,-11,-11], [11,11,11]])

module.exports = mesh
