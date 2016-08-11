var isosurface = require("isosurface")

var mesh = isosurface.surfaceNets([64,64,64], function(x,y,z) {
  return Math.pow(Math.pow(x, 6) + Math.pow(y, 6) +
  Math.pow(z, 6), 1/6) - 10
}, [[-11,-11,-11], [11,11,11]])

module.exports = mesh
