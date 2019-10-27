// var vectors = require('vectors')

const bodies = {}

const add = (pos, size) => {
  bodies.add(createBody(pos, size))
}

const createBody = (pos, s) =>  ({
  position: {x: pos.x, y: pos.y},
  size: {width: s.width, height: s.height}
})

const getAll = () => {
  return bodies
}

module.exports = {
  add,
  getAll
}
