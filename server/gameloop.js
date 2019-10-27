
const WebSocket = require('ws')
const uuid = require('uuid/v4')
const players = require('./player')
const bodies = require('./body')
const projectiles = require('./projectile')
//const { updateProjectilePos } = require('./projectile')

const data = {
  socketServer: null,
}

const configureWebSockets = server => {

  data.socketServer = new WebSocket.Server({ server })
  const { socketServer } = data

  socketServer.on('connection', ws => {

    ws.id = uuid()
    console.log(`created user: ${ws.id}`)

    ws.on('message', message => {
      const parsedMessage = JSON.parse(message)
      const { type, payload } = parsedMessage
      if (type !== 'join') return
      players.add(payload, ws.id)
      ws.send(JSON.stringify({ type: 'join', payload: {} }))

      /* only handle action/movement from now on */
      ws.on('message', players.handleInput(ws.id))
    })

    ws.on('close', () => {
      players.remove(ws.id)
      console.log(`removed user: ${ws.id}`)
    })
  })
}

const startGameLoop = interval => {
  addWalls()
  const { socketServer } = data
  setInterval(() => {

    const payload = {
      players: players.update(bodies, projectiles),
      bodies: bodies.getAll(),
      projectiles: projectiles.update(),
    }

    Object.entries(players.players).forEach(([key, player]) => {
      if (player.lives <= 0) {
        socketServer.clients.forEach(client => {
          if (client.readyState !== WebSocket.OPEN) return
          if (client.id === key) client.close()
        })
      }
    })

    emitToAll(socketServer, payload)
  }, interval)
}

const emitToAll = (socketServer, payload) => {
  const jsonData = JSON.stringify({ type: 'update', payload })
  socketServer.clients.forEach(client => {
    if (client.readyState !== WebSocket.OPEN) return
    client.send(jsonData)
  })
}

const addWalls = () => {
  // add all walls
  bodies.add({x: 0, y: 500}, {width: 1000, height: 50})
}

module.exports = {
  configureWebSockets,
  startGameLoop
}