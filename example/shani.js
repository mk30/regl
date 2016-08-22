var regl = require('../regl')()
var demos = {
  cyl: require('./shanicyl.js')(regl),
  icecream: require('./shaniicecream.js')(regl)
}
const camera = require('./util/camera')(regl, {
  center: [0, 2.5, 0]
})

var active = 'cyl'
regl.frame(() => {
  regl.clear({
    color: [0, 0, 0, 1]
  })
  camera(() => {
    demos[active]()
  })
})
