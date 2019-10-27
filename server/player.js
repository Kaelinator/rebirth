const Vector = require('vector').Vector
const uuid = require('uuid/v4')
const projectile = require('./projectile')

const JUMP_SPEED = process.env.JUMP_SPEED || 3
const FALL_SPEED = process.env.FALL_SPEED || 1
const RUN_SPEED = process.env.RUN_SPEED || 1
const JUMP_TICK_LIMIT = process.env.JUMP_TICK_LIMIT || 1000
const SHOOT_COOLDOWN = process.env.SHOOT_COOLDOWN || 500

const players = {}

const update = (bodies, projectiles) => {
  Object.keys(players).forEach((id) => {
    const player = players[id]
    player.shootTick += 1
    if(inBounds(player, bodies.getAll())) {
      players[id] = updatePlayerPos(player, id, projectiles)
    }
    if(inBounds(player, projectiles.getAll())) {
      player.lives--
    }

    if (player.movement.isShooting && player.shootTick > SHOOT_COOLDOWN) {
      console.log('shoot!!')
      player.shootTick = 0
      projectiles.add(id, player, player.movement.mouse)
    }
  })

  return Object.values(players)
}

const inBounds = (player, bodies) => {
  let output = true
  bodies.getAll().forEach((body) => {
    if(((player.position.x + player.size.x >= body.position.x + body.size.width &&
       player.position.x >= body.position.x + body.size.width) ||
       (player.position.x + player.size.x <= body.position.x &&
       player.position.x <= body.position.x)) ||
       ((player.position.y + player.size.y >= body.position.y + body.size.height &&
       player.position.y >= body.position.y + body.size.height) ||
       (player.position.y + player.size.y <= body.position.y &&
       player.position.y <= body.position.y))) {
      // console.log('Inbounds')
    } else {
      output = false
    }
  })
  return output
}

const updatePlayerPos = (player, id, projectiles) => {

  player.position.add(player.velocity)

  // if (player.movement.isJumping) {
  //   if (player.curJumpTick <= JUMP_TICK_LIMIT) {
  //     player.curJumpTick += 1
  //     player.velocity.y = -0.1 * JUMP_SPEED
  //   } else {
  //     player.usedOneJump = true
  //     player.velocity.y = 0.1 * FALL_SPEED
  //   }
  // } else {
  //   player.usedOneJump = true
  //   player.curJumpTick = 0
  //   player.velocity.y = 0.1 * FALL_SPEED
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
  size: new Vector(100, 100),
  velocity: new Vector(0, 0),
  curJumpTick: 0,
  usedOneJump: false,
  isGrounded: false,
  lives: 3,
  shootTick: 0,
  movement: {
    isStrafingLeft: false,
    isStrafingRight: false,
    isJumping: false,
    isShooting: false,
    mouse: { x: 0, y: 0 }
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