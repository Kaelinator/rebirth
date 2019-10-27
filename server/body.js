// var vectors = require('vectors')

const uuid = require('uuid/v4')

const bodies = {}

const add = (pos, size) => {
  bodies[uuid()] = createBody(pos, size)
}

const createBody = (pos, size) => ({
  position: { x: pos.x, y: pos.y },
  size: { width: size.width, height: size.height }
})

const getAll = () => Object.values(bodies)

module.exports = {
  add,
  getAll
}
