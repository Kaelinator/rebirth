
var vectors = require('vectors')
// const { CreateProjectile } = require('./projectile')


const JUMP_SPEED = 1
const FALL_SPEED = 10
const RUN_SPEED = 10
const JUMP_TICK_LIMIT = 1000

const updatePlayerPos = player => {
  vectors.add(player.position, player.velocity)
  
  if(player.isJumping && !player.usedOneJump){
    if(player.curJumpTick <= JUMP_TICK_LIMIT) {
      player.curJumpTick += 1
      player.velocity[1] = -JUMP_SPEED
    } else {
      player.usedOneJump = true
      player.velocity[1] = FALL_SPEED
    }
  } else {
    player.usedOneJump = true
    player.curJumpTick = 0
    player.velocity[1] = FALL_SPEED
  }
  
  if(player.movement.isStrafingLeft || player.movement.isStrafingRight && player.movement.isStrafingLeft != player.movement.isStrafingRight ) {
    player.velocity[0] = RUN_SPEED * player.movement.isStrafingLeft ? 1 : -1
  } else {
    player.velocity[0] = 0
  }

  return player
}

const createPlayer = ({ name }) => ({
  name,
  position: [0, 0],
  velocity: [0, 0],
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