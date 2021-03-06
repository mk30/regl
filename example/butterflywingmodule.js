//takes a file that exports a mesh for an implicit surface
//and returns a draw() fn that can be placed in a regl frame
//file
const regl = require('../regl')()
const mat4 = require('gl-mat4')
var rmat = []
const cyl = require('./butterflycreammodule.js')
//perform operation on cyl...ie, -cyl, +cyl, and combined
//cyl so that drawcyl operates on both sets of data
var mathcalc = function(elem, index, array) {
  return elem*2
}
function arrayofarrays (elem, index, array){
  var a = elem.map(mathcalc())
  return a
}
const butterfly = cyl.positions.map(arrayofarrays)
console.log(butterfly)
const normals = require('angle-normals')
module.exports = function (regl){
  const drawcyl = regl({
    frag: `
      precision mediump float;
      varying vec3 vnormal;
      vec3 hsl2rgb(vec3 hsl) {
        vec3 rgb = clamp( abs(mod(hsl.x*5.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
        return hsl.z - hsl.y * (rgb-0.5)*(3.0-abs(2.0*hsl.y-1.0));
      }
      void main () {
        gl_FragColor = vec4(hsl2rgb(abs(vnormal)), 1.0);
      }`,
    vert: `
      precision mediump float;
      uniform mat4 model, projection, view;
      attribute vec3 position, normal;
      varying vec3 vnormal;
      uniform float t;
      vec3 warp (vec3 p){
        float r = length(p.zx*sin(t*p.yz));
        float theta = atan(p.y, p.z);
        //return vec3 (r*cos(theta), p.y, r*sin(theta));
        return vec3 (r*cos(p.y), p.y, r*sin(theta));
      }
      void main () {
        vnormal = normal;
        gl_Position = projection * view * model * vec4(warp(position), 1.0);
        gl_PointSize =
        (20.0*(5.0+sin(t*20.0+length(position))))/gl_Position.w;
      }`,
    attributes: {
      position: cyl.positions,
      normal: normals(cyl.cells, cyl.positions)
    },
    elements: cyl.cells,
    uniforms: {
      t: function(context, props){
           return context.tick/1000
         },
      model: function(context, props){
        var theta = -context.tick/60
        //return mat4.rotateY(rmat, mat4.identity(rmat), theta)
        return mat4.scale(rmat, mat4.identity(rmat),
        [Math.sin(10.0*context.time), Math.sin(theta), 3.0])
      },
      projection: function (context){
        return mat4.perspective(
          mat4.create(), Math.PI/4,
          context.viewportWidth/context.viewportHeight, 0.01,
          1000
        )
      }
    },
    primitive: "points"
  })
  return function(){
    drawcyl()
  }
}
