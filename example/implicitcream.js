var isosurface = require("isosurface")

var mesh = isosurface.surfaceNets([64,64,64],
  function (x, y, z){
    return x*x + y*y + (z+5)*(z+5) - 10
  }
  , [[-11,-11,-21], [11,11,21]])

module.exports = mesh
