
const JUMP_SPEED = 1
const FALL_SPEED = 10

const update = player => {
  // Velocity changes according to acceleration
  player.velocity.add(player.acceleration)
  // position changes by velocity
  player.position.add(player.velocity)
  // We must clear acceleration each frame
  player.acceleration.mult(0)
}

const updatePos = player => {
  update(player)

  if (player.isJumping) {
    player.velocity.y = JUMP_SPEED
  } else {
    player.acceleration = { x: 0, y: FALL_SPEED }
  }

  return player
}

const createPlayer = () => ({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  acceleration: { x: 0, y: 0 },
})


module.exports = {
  updatePos,
  createPlayer
}