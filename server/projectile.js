import Vector from '@minogin/vector'
const defaultVelocity = 3


const updateProjectilePos = projectile => {
  projectile.position.add(projectile.velocity)
  return projectile
}

const resultantVector = (player, clickVector) => {
  let playerVector = new Vector(player.position.x, player.position.y)
  let resultantVector = new Vector(clickVector.x - playerVector.x, clickVector.y - playerVector.y)
  return resultantVector.unit().mul(new Vector(defaultVelocity, defaultVelocity))
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
