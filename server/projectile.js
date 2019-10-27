const Vector = require('vector').Vector
const uuid = require('uuid/v4')
const defaultVelocity = 3

const PROJECTILE_SIZE = process.env.PROJECTILE_SIZE || 10

const projectiles = {}

const update = () => {
  Object.keys(projectiles).forEach((id) => {
    projectiles[id] = updateProjectilePos(projectiles[id], id, projectiles)
  })
  

  return Object.values(projectiles)
}

const updateProjectilePos = projectile => {
  projectile.position.add(projectile.velocity)
  return projectile
}

const resultantVector = (player, clickVector) => {
  let playerVector = new Vector(player.position.x, player.position.y)
  let resultantVector = new Vector(clickVector.x - playerVector.x, clickVector.y - playerVector.y)
  let resultantAngle = Math.atan(resultantVector.y, resultantVector.x)
  return new Vector(defaultVelocity * Math.cos(resultantAngle), defaultVelocity * Math.sin(resultantAngle))
}

const add = (fromId, player, clickPos) => {
  projectiles[uuid()] = createProjectile(player, clickPos, fromId)
}

const remove = id => {
  delete projectiles[id]
}

const createProjectile = (player, clickVector, fromId) => ({
  fromId,
  position: new Vector(player.position.x, player.position.y),
  velocity: resultantVector(player, clickVector),
  size: { width: PROJECTILE_SIZE, height: PROJECTILE_SIZE },
  health: 3,
})

const getAll = () => Object.values(projectiles)

module.exports = {
  update,
  add,
  remove,
  getAll
}
