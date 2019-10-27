// const vectors = require('vectors')
const defaultVelocity = 3

const projectiles = {}

const updateProjectilePos = projectile => {
  vectors.add(projectile.position, projectile.velocity)
  return projectile
}

const resultantVector = (player, clickVector) => {
  let playerVector = [player.position.x, player.position[1]]
  let resultantVector = [clickVector.x - playerVector.x, clickVector[1] - playerVector[1]]
  return vectors.mult(vectors.normalize(resultantVector, 1),defaultVelocity)
}

const CreateProjectile = (player, clickVector) => ({
  position: [player.position.x, player.position[1]],
  velocity: resultantVector(player, clickVector),
  health: 3,
})

module.exports = {
  updateProjectilePos,
  CreateProjectile
}
