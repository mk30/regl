var isosurface = require("isosurface")
var glvec2 = require("gl-vec2")
var out = []
var sum = []

function sdCyl( a, b ) { //a should be a vec3, b should be a vec2
  if (a[2] < -15) return 100;
  glvec2.subtract(out, [Math.abs(glvec2.length([a[0], a[2]])), Math.abs(a[1])], b);
  return
    glvec2.add(
    sum,
    glvec2.min(glvec2.max([out[0], out[1]],0.0)), 
    glvec2.length(glvec2.max([out[0], out[1]], 0.0))
    )
}

var mesh = isosurface.surfaceNets([64,64,64],
  function (x, y, z){
    return sdCyl([x,y,z], [3, 1])
  }
  , [[-11,-11,-11], [11,21,11]])

module.exports = mesh
