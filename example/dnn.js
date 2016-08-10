const canvas = document.body.appendChild(document.createElement('canvas'))
canvas.width = 1
canvas.height = 1

const regl = require('../regl')({canvas: canvas, extensions: ['oes_texture_float']})

var ndarray = require('ndarray')
var zeros = require('zeros')
var gemm = require('ndarray-gemm')
var ops = require('ndarray-ops')

function cpuMul (a, b) {
  var res = zeros([a.shape[0], b.shape[1]])
  gemm(res, a, b)
  return res
}

function cpuAdd (a, b) {
  var res = zeros([a.shape[0], a.shape[1]])
  ops.add(res, a, b)
  return res
}

// i == reductionIndex
function cpuSoftmax (x) {
  var len = x.shape[1]
  var i

  var sum = 0 // the denominator.

  for (i = 0; i < len; i++) {
    sum += Math.exp(x.get(0, i))
  }

  var res = zeros([1, len])

  for (i = 0; i < len; i++) {
    res.set(0, i, Math.exp(x.get(0, i)) / sum)
  }

  return res
}

var data = [
  [require('./d0.json'), [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0]],
  [require('./d1.json'), [0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]],
  [require('./d2.json'), [0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]],
  [require('./d3.json'), [1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]],
  [require('./d4.json'), [0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0]]
]

data.forEach(function (d) {
  var x = ndarray(d[0], [1, 784])

  var W = ndarray(require('./W.json'), [784, 10])
  var b = ndarray(require('./b.json'), [1, 10])

  var mul = cpuMul(x, W)
  var add = cpuAdd(mul, b)
  var res = cpuSoftmax(add)

  var arr = Array.prototype.slice.call(res.data)
  var actual = arr.indexOf(Math.max.apply(null, arr))

  arr = d[1]
  var expected = arr.indexOf(Math.max.apply(null, arr))
  if (actual === expected) {
    console.log('PASS')
  } else {
    console.log('FAIL')
  }

  console.log('data: ', res.data)
})

function createMatrix (data, shape) {
  var textureData = []
  var i
  for (i = 0; i < data.length; i++) {
    var g = data[i]
    textureData.push(g, g, g, g)
  }

  var tex = regl.texture({
    width: shape[1],
    height: shape[0],
    data: textureData,
    format: 'rgba',
    type: 'float',
    mag: 'nearest',
    min: 'nearest'
  })

  return tex
}

function createTexture (width, height) {
  return regl.texture({
    width: width,
    height: height,
    format: 'rgba',
    type: 'float',
    mag: 'nearest',
    min: 'nearest'
  })
}

function getFbo (fbo) {
  var a = []
  regl({framebuffer: fbo})(() => {
    var arr = regl.read()
    for (var i = 0; i < arr.length; i += 4) {
      a.push(arr[i])
    }
  })
  return ndarray(a, [fbo.color[0].height, fbo.color[0].width])
}

function getTex (tex) {
  return getFbo(regl.framebuffer({color: tex}))
}

var baseGpu = {
  vert: `
  precision mediump float;
  attribute vec2 position;
  varying vec2 vUv;
  void main () {
    vUv = 0.5 * (position + 1.0);
    gl_Position = vec4(position, 0, 1);
  }`,

  attributes: {
    position: [ -4, -4, 4, -4, 0, 4 ]
  },

  framebuffer: regl.prop('outFbo'),

  count: 3
}

// gpu matrix mult. Returns a*b
function gpuMul (a, b) {
  if (a.width !== b.height) {
    throw Error('Impossible matrix mul!')
  }

  var obj = baseGpu

  obj.frag = `
    precision mediump float;

    uniform sampler2D aTex;
    uniform sampler2D bTex;

    varying vec2 vUv;

#define oDim vec2(${b.width}, ${a.height})
#define aDim vec2(${a.width}, ${a.height})
#define bDim vec2(${b.width}, ${b.height})

#define aDimi ivec2(${a.width}, ${a.height})

    void main () {
      vec2 oRcp = vec2(1.0 / oDim.x, 1.0 / oDim.y);
      vec2 uv = vUv - oRcp * 0.5;

      float x = uv.x * oDim.x;
      float y = uv.y * oDim.y;

      float sum = 0.0;

      for(int i = 0; i < aDimi.x; i++) {
        float a = texture2D(aTex, vec2(float(i) / aDim.x, y / aDim.y) ).x;
        float b = texture2D(bTex, vec2(x / bDim.x, float(i) / bDim.y) ).x;

        sum += a*b;
      }

      gl_FragColor = vec4(sum);
    }`

  obj.uniforms = {
    aTex: regl.prop('aTex'),
    bTex: regl.prop('bTex')
  }

  var pass = regl(obj)

  var outTex = createTexture(b.width, a.height)
  var outFbo = regl.framebuffer({color: outTex})

  pass({aTex: a, bTex: b, outFbo: outFbo})

  return outTex
}

// gpu component-wise matrix add. Returns a+b
function gpuAdd (a, b) {
  if (a.width !== b.width || a.height !== b.height) {
    throw Error('Impossible matrix add!')
  }

  var obj = baseGpu

  obj.frag = `
    precision mediump float;

    uniform sampler2D aTex;
    uniform sampler2D bTex;

    varying vec2 vUv;

    void main () {
      float a = texture2D(aTex, vUv).x;
      float b = texture2D(bTex, vUv).x;

      float res = a + b;

      gl_FragColor = vec4(res);
    }`

  obj.uniforms = {
    aTex: regl.prop('aTex'),
    bTex: regl.prop('bTex')
  }

  var cmd = regl(obj)

  var outTex = createTexture(a.width, a.height)
  var outFbo = regl.framebuffer({color: outTex})

  cmd({aTex: a, bTex: b, outFbo: outFbo})

  return outTex
}

console.log('NOW GPU')
data.forEach(function (d) {
  var x = createMatrix(d[0], [1, 784])
  var W = createMatrix(require('./W.json'), [784, 10])
  var b = createMatrix(require('./b.json'), [1, 10])

  var mul = gpuMul(x, W)
  var add = getTex(gpuAdd(mul, b))
  var res = cpuSoftmax(add)

  var arr = Array.prototype.slice.call(res.data)
  var actual = arr.indexOf(Math.max.apply(null, arr))

  arr = d[1]
  var expected = arr.indexOf(Math.max.apply(null, arr))
  if (actual === expected) {
    console.log('PASS')
  } else {
    console.log('FAIL')
  }

  console.log('data: ', res.data)
})
