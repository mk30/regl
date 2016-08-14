var isosurface = require("isosurface")

var mesh = isosurface.surfaceNets([64,64,64],
  function (y, z, x){
    return x*x + y*y + (z-10)*(z-10) - 10
  }
  , [[-11,-11,-21], [11,21,11]])

module.exports = mesh
