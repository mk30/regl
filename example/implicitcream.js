var isosurface = require("isosurface")

function displacement (a, b, c){
  return 20*Math.sin(40*a)*Math.sin(60*b)*Math.sin(100*c)
}

function sphere (y, z, x){
  return x*x + y*y + (z-15)*(z-15) - 20
}

var mesh = isosurface.surfaceNets([64,64,64],
  function (x, y, z){
    return sphere(x, y, z) + displacement(x,y,z)
  }
  , [[-11,-11,-21], [11,21,11]])

module.exports = mesh
