/*
  <p>This example shows how to implement a movable camera with regl.</p>
 */

const regl = require('../regl')()

const bunny = require('./isosurface.js')
const normals = require('angle-normals')

const camera = require('./util/camera')(regl, {
  center: [0, 2.5, 0]
})

const drawBunny = regl({
  frag: `
    precision mediump float;
    varying vec3 vnormal;
    void main () {
      gl_FragColor = vec4(abs(vnormal), 1.0);
    }`,
  vert: `
    precision mediump float;
    uniform mat4 projection, view;
    attribute vec3 position, normal;
    varying vec3 vnormal;
    uniform float t;
    vec3 warp (vec3 p){
      float r = length(p.zx);
      float theta = atan(p.z, p.x);
      return vec3 (r*cos(theta), p.y, r*sin(theta)) +
      vnormal*(1.0+cos(40.0*t+p.y));
    }
    void main () {
      vnormal = normal;
      gl_Position = projection * view * vec4(warp(position), 1.0);
      gl_PointSize =
      (64.0*(1.0+sin(t*20.0+length(position))))/gl_Position.w;
    }`,
  attributes: {
    position: bunny.positions,
    normal: normals(bunny.cells, bunny.positions)
  },
  elements: bunny.cells,
  uniforms: {
    t: function(context, props){
         return context.tick/1000
       }

  },
  primitive: "points"
})

regl.frame(() => {
  regl.clear({
    color: [0, 0, 0, 1]
  })
  camera(() => {
    drawBunny()
  })
})
