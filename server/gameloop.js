
const WebSocket = require('ws')
const uuid = require('uuid/v4')
const JUMP_SPEED = 1
const FALL_SPEED = 10

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
      position = createVector(x, y),
      velocity = createVector(0, 0),
      acceleration = createVector(0, 0),
    }
    console.log(`new user: ${ws.id}`)

    ws.on('message', message => {
      console.log(`recieved ${message}`)
      players[ws.id] = JSON.parse(message)
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
  update(player);
  
  if(player.isJumping) {
    player.velocity.y = JUMP_SPEED;
  } else {
    player.acceleration.add(createVector(0, FALL_SPEED)); 
  }
  
  //   player.y = updateY(player)
  // }
  // if(player.strafeRight) {
  //   player.x = updateX(player);
  // } else if ()

}
return player;

const update = player =>  {
  // Velocity changes according to acceleration
  player.velocity.add(player.acceleration);
  // position changes by velocity
  player.position.add(player.velocity);
  // We must clear acceleration each frame
  player.acceleration.mult(0);
};


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