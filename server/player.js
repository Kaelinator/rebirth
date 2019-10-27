const Vector = require('vector').Vector
const uuid = require('uuid/v4')
const projectile = require('./projectile')

const JUMP_SPEED = 1
const FALL_SPEED = 2
const RUN_SPEED = 10
const JUMP_TICK_LIMIT = 1000

const players = {}

const update = (projectiles) => {
  Object.keys(players).forEach((id) => {
    players[id] = updatePlayerPos(players[id], id, projectiles)
  })

  return Object.values(players)
}

const updatePlayerPos = (player, id, projectiles) => {

  player.position.add(player.velocity)
  
  // if (player.isJumping) {
  //   if (player.curJumpTick <= JUMP_TICK_LIMIT) {
  //     player.curJumpTick += 1
  //     player.velocity.y = -JUMP_SPEED
  //   } else {
  //     player.usedOneJump = true
  //     player.velocity.y = FALL_SPEED
  //   }
  // } else {
  //   player.usedOneJump = true
  //   player.curJumpTick = 0
  //   player.velocity.y = FALL_SPEED
  // }
  if (player.movement.isStrafingLeft || player.movement.isStrafingRight && player.movement.isStrafingLeft != player.movement.isStrafingRight) {
    player.velocity.x = RUN_SPEED * player.movement.isStrafingLeft ? 1 : -1
  } else {
    player.velocity.x = 0
  }

  if (player.isShooting) // TODO
    projectile.add({ id: uuid(), from: id })


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
    isJumping: false,
    isShooting: false,
    mousePosition: { x: 0, y: 0 }
  },
})

const add = (payload, id) => {
  console.log(`creating player: ${payload.name}`)
  players[id] = createPlayer(payload)
}

const remove = id => {
  delete players[id]
}

const handleInput = id => message => {
  const parsedMessage = JSON.parse(message)
  const { type, payload } = parsedMessage
  switch (type) {
  case 'movement':
    players[id].movement = payload
    break
  }
}

module.exports = {
  update,
  add,
  remove,
  handleInput
}