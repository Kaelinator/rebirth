
var Vector = require('vector').Vector

const JUMP_SPEED = 1
const FALL_SPEED = 10
const RUN_SPEED = 10
const JUMP_TICK_LIMIT = 1000

const updatePos = player => {
  player.position.add(player.velocity)
  
  if(player.isJumping && !usedOneJump){
    if(player.curJumpTick <= JUMP_TICK_LIMIT) {
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
  
  if(player.isStrafingLeft || player.isStrafingRight && player.isStrafingLeft != player.isStrafingRight ) {
    player.velocity.x = RUN_SPEED * player.isStrafingLeft ? 1 : -1
  } else {
    player.velocity.x = 0
  }
  return player
}

const createPlayer = () => ({
  position: new Vector(0, 0),
  velocity: new Vector(0, 0),
  curJumpTick: 0,
  usedOneJump: false,
  isGrounded: false,
  movement: {
    isStrafingLeft: false,
    isStrafingRight: false,
    isJumping: false
  }
})


module.exports = {
  updatePos,
  createPlayer
}