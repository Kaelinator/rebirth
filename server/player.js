
var Vector = require('vector').Vector
// const { CreateProjectile } = require('./projectile')


const JUMP_SPEED = 1
const FALL_SPEED = 10
const RUN_SPEED = 10
const JUMP_TICK_LIMIT = 1000

const updatePlayerPos = player => {

  player.position.add(player.velocity)

  if (player.isJumping) {
    if (player.curJumpTick <= JUMP_TICK_LIMIT) {
      player.curJumpTick += 1
      player.velocity.y = -JUMP_SPEED
    } else {
      player.usedOneJump = true
      player.velocity.y = FALL_SPEED
    }
  } else {
    player.usedOneJump = true
    player.curJumpTick = 0
    player.velocity.y = FALL_SPEED
  }
  if (player.movement.isStrafingLeft || player.movement.isStrafingRight && player.movement.isStrafingLeft != player.movement.isStrafingRight) {
    player.velocity.x = RUN_SPEED * player.movement.isStrafingLeft ? 1 : -1
  } else {
    player.velocity.x = 0
  }
  return player
}

const createPlayer = ({ name }) => ({
  name,
  position: new Vector(50, 50),
  velocity: new Vector(0, 0),
  curJumpTick: 0,
  usedOneJump: false,
  isGrounded: false,
  movement: {
    isStrafingLeft: false,
    isStrafingRight: false,
    isJumping: false
  },
})

const handleInput = player => message => {
  const parsedMessage = JSON.parse(message)
  const { type, payload } = parsedMessage
  switch (type) {
  case 'movement':
    player.movement = payload
    break
  }
}

module.exports = {
  updatePlayerPos,
  createPlayer,
  handleInput
}