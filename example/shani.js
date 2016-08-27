var regl = require('../regl')()
var demos = [ 
  require('./shaniswimmypuff.js')(regl),
  require('./shanitext.js')(regl),
  require('./shanicyl.js')(regl),
  require('./shanicactus.js')(regl),
  require('./shanirotatypoints.js')(regl),
  require('./shaniicecream.js')(regl),
  require('./shanitext2.js')(regl),
  require('./shani4x4.js')(regl)
]
const camera = require('./util/camera')(regl, {
  center: [0, 0, 0]
})

var index = 0

var interval = setInterval(function() {
  index++
}, 3000)

//var active = 'fourxfour'
regl.frame(() => {
  regl.clear({
    color: [0, 0, 0, 1]
  })
  camera(() => {
    demos[index%demos.length]() 
  })
})
