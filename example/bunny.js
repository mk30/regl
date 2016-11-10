/*
  <p> This example shows how to draw a mesh with regl </p>
*/
const regl = require('../regl')()
const mat4 = require('gl-mat4')
const bunny = require('bunny')
const normals = require('angle-normals')


const drawBunny = regl({
  vert: `
  precision mediump float;
  attribute vec3 position, normal;
  varying vec3 vnormal;
  uniform mat4 model, view, projection;
  void main() {
    vnormal = normal;
    gl_Position = projection * view * model * vec4(position, 1);
  }`,

  frag: `
    precision mediump float;
    varying vec3 vnormal;
    void main () {
    gl_FragColor = vec4(abs(vnormal), 1);
  }`,

  // this converts the vertices of the mesh into the position attribute
  attributes: {
    position: bunny.positions,
    normal: normals(bunny.cells, bunny.positions)
  },

  // and this converts the faces fo the mesh into elements
  elements: bunny.cells,

  uniforms: {
    model: mat4.identity([]),
    view: ({tick}) => {
      const t = 0.01 * tick
      return mat4.lookAt([],
        [30 * Math.cos(t), 2.5, 30 * Math.sin(t)],
        [0, 2.5, 0],
        [0, 1, 0])
    },
    projection: ({viewportWidth, viewportHeight}) =>
      mat4.perspective([],
        Math.PI / 4,
        viewportWidth / viewportHeight,
        0.01,
        1000)
  }
})

regl.frame(() => {
  regl.clear({
    depth: 1,
    color: [0, 0, 0, 1]
  })

  drawBunny()
})
