var isosurface = require("isosurface")
var glvec3 = require("gl-vec3")
var glvec2 = require("gl-vec2")
function sdTorus(a, b) //a should be a vec3, b should be a vec2
  {
    var c = [glvec2.length([a[0], a[2]])-b[0],a[1]];
    return glvec2.length(c)-b[1];
  }
var mesh = isosurface.surfaceNets([100,100,100], 
  function (x, y, z){
    return sdTorus([x,y,z], [5, 1])
  }
  , [[-11,-11,-11], [11,11,11]])

module.exports = mesh
