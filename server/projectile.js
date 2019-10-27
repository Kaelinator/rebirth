const Vector = require('vector').Vector
const defaultVelocity = 3

const projectiles = {}

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

const CreateProjectile = (player, clickVector) => ({
  position: new Vector(player.position.x, player.position.y),
  velocity: resultantVector(player, clickVector),
  health: 3,
})

module.exports = {
  updateProjectilePos,
  CreateProjectile
}
