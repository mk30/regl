var isosurface = require("isosurface")
var glvec2 = require("gl-vec2")

function sdCone( a, b ) { //a should be a vec3, b should be a vec2
  if (a[2] < -15) return 100;
  c = glvec2.length([a[0], a[1]]);
  return glvec2.dot([b[0], b[1]], [c, a[2]]);
}
var mesh = isosurface.surfaceNets([64,64,64],
  function (y, z, x){
    return sdCone([x,y,-5-z], [3, 0.5])
  }
  , [[-11,-11,-11], [11,21,11]])

module.exports = mesh
