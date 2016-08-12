var isosurface = require("isosurface")
var glvec3 = require("gl-vec3")

function length (a, b){
  return Math.sqrt(Math.pow(a,2) + Math.pow(b, 2))
}
var mesh = isosurface.surfaceNets([100,100,100], function(x,y,z) {
  return Math.pow(Math.pow(x, 6) + Math.pow(y, 6) +
  Math.pow(z, 6), 1/6) - 10
}, [[-11,-11,-11], [11,11,11]])


module.exports = mesh
