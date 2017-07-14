/*
  tags: basic, lines
<p> This example demonstrates how you can use `elements` to draw lines. </p>
 */

const regl = require('../regl')()

<<<<<<< HEAD
const drawLines = 
=======
regl.clear({
  color: [0, 0, 0, 1],
  depth: 1
})

var lineWidth = 3
if (lineWidth > regl.limits.lineWidthDims[1]) {
  lineWidth = regl.limits.lineWidthDims[1]
}

>>>>>>> 60a996bd1782fc0264c4079a63ff711b53806439
regl({
  frag: `
    precision mediump float;
    uniform vec4 color;
    void main() {
      gl_FragColor = color;
    }`,

  vert: `
    precision mediump float;
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0, 1);
    }`,

  attributes: {
    position: (new Array(5)).fill().map((x, i) => {
      var theta = 3.0 * Math.PI * i / 5
      return [ Math.sin(theta), Math.cos(theta) ]
    })
  },

  uniforms: {
    color: ({tick}) =>
      [
      Math.cos(tick*0.01),
      Math.sin(tick*0.01),
      0.5,
      1
    ]
  },

  elements: [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 3],
    [2, 4],
    [3, 4]
  ],
  lineWidth: 5
})

<<<<<<< HEAD
regl.frame(function (){
  regl.clear({
    color: [0,0,0,1],
    depth: 1
  })
  drawLines()
})
=======
  lineWidth: lineWidth
})()
>>>>>>> 60a996bd1782fc0264c4079a63ff711b53806439
