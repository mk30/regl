var isosurface = require("isosurface")
var glvec3 = require("gl-vec3")
var glvec2 = require("gl-vec2")

function sdCone( a, b ) //a should be a vec3, b should be a vec2
  {
    c = glvec2.length([a[0], a[1]]);
    return glvec2.dot([b[0], b[1]], [c, a[2]]);
  }
var mesh = isosurface.surfaceNets([100,100,100],
  function (x, y, z){
    return Math.min(sdCone([x-5,y,z], [5, 1]),  x*x +
    y*y + z*z - 50)
  }
  , [[-11,-11,-11], [11,11,11]])


module.exports = mesh
