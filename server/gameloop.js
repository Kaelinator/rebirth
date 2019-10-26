
const WebSocket = require('ws')
const uuid = require('uuid/v4')
var Vector = require('vector').Vector

const JUMP_SPEED = 1
const FALL_SPEED = 10
const RUN_SPEED = 10
const JUMP_TICK_LIMIT = 1000

const data = {
  players: {},
  socketServer: null
}

const configureWebSockets = server => {

  data.socketServer = new WebSocket.Server({ server })
  const { socketServer, players } = data

  socketServer.on('connection', ws => {

    ws.id = uuid()
    players[ws.id] = {
      position: new Vector(0, 0),
      velocity: new Vector(0, 0),
      acceleration: new Vector(0, 0),
      curJumpTick: 0,
    }
    console.log(`new user: ${ws.id}`)

    ws.on('message', message => {
      console.log(`recieved ${message}`)
      players[ws.id].movement = JSON.parse(message)
    })

    ws.on('close', () => {
      console.log(`closing connection with ${ws.id}`)
      delete players[ws.id]
    })
  })
}

const startGameLoop = interval => {
  const { socketServer, players } = data
  setInterval(() => {
    const updated = Object.values(players).map(updatePos)
    emitToAll(socketServer, updated)
  }, interval)
}

const updatePos = player => {
  update(player)
  
  if(player.isJumping && player.curJumpTick < JUMP_TICK_LIMIT) {
    player.curJumpTick += 1
    player.velocity.y = -JUMP_SPEED
  } else {
    player.curJumpTick = 0
    player.acceleration.add(new Vector(0, FALL_SPEED)) 
  }

  if(player.isStrafingLeft || player.isStrafingRight && player.isStrafingLeft != player.isStrafingRight ) {
    player.velocity.x = RUN_SPEED * player.isStrafingLeft ? 1 : -1
  }

  //   player.y = updateY(player)
  // }
  // if(player.strafeRight) {
  //   player.x = updateX(player);
  // } else if ()

}

const update = player =>  {
  // Velocity changes according to acceleration
  player.velocity.add(player.acceleration)
  // position changes by velocity
  player.position.add(player.velocity)
  // We must clear acceleration each frame
  player.acceleration.mult(0)
}


// const updateY = player => {
//   ...player
// }


const emitToAll = (socketServer, data) => {
  const jsonData = JSON.stringify(data)
  socketServer.clients.forEach(client => {
    if (client.readyState !== WebSocket.OPEN) return
    client.send(jsonData)
  })
}

module.exports = {
  configureWebSockets,
  startGameLoop
}