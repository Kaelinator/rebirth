const Vector = require('vector').Vector
const uuid = require('uuid/v4')

const PROJECTILE_VELOCITY = process.env.PROJECTILE_VELOCITY || 1

const PROJECTILE_SIZE = process.env.PROJECTILE_SIZE || 10
const PROJECTILE_LIFESPAN = process.env.PROJECTILE_LIFESPAN || 1000

const projectiles = {}

const update = () => {
  Object.keys(projectiles).forEach((id) => {
    projectiles[id].life += 1

    projectiles[id] = updateProjectilePos(projectiles[id], id, projectiles)

    if (projectiles[id].life > PROJECTILE_LIFESPAN)
      delete projectiles[id]
      
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
  let resultantAngle = Math.atan2(resultantVector.y, resultantVector.x) //- Math.PI / 2
  return new Vector(PROJECTILE_VELOCITY * Math.cos(resultantAngle), PROJECTILE_VELOCITY * Math.sin(resultantAngle))
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
  life: 0,
})

const getAll = () => Object.values(projectiles)

module.exports = {
  update,
  add,
  remove,
  getAll
}
