var isosurface = require("isosurface")
var glvec3 = require("gl-vec3")
var glvec2 = require("gl-vec2")

function sdCone( a, b ) { //a should be a vec3, b should be a vec2
  if (a[2] < -15) return 100;
  c = glvec2.length([a[0], a[1]]);
  return glvec2.dot([b[0], b[1]], [c, a[2]]);
}
var mesh = isosurface.surfaceNets([64,64,64],
  function (x, y, z){
    return Math.min(sdCone([x,y,z-10], [3, 0.5]),  x*x +
    y*y + (z+5)*(z+5) - 10)
  }
  , [[-11,-11,-21], [11,11,21]])


module.exports = mesh
