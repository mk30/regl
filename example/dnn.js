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

var W = ndarray(require('./W.js'), [784, 10])
var b = ndarray(require('./b.js'), [1, 10])

var data = [
  [require('./d0.js'), [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0]],
  [require('./d1.js'), [0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]],
  [require('./d2.js'), [0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]],
  [require('./d3.js'), [1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]],
  [require('./d4.js'), [0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0]]
]

data.forEach(function (d) {
  var x = ndarray(d[0], [1, 784])

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
