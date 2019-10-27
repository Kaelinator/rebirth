
const WebSocket = require('ws')
const uuid = require('uuid/v4')
const { createPlayer, updatePlayerPos, handleInput} = require('./player')
//const { updateProjectilePos } = require('./projectile')

const data = {
  players: {},
  projectiles: {},
  bodies: {},
  socketServer: null,
}

const configureWebSockets = server => {

  data.socketServer = new WebSocket.Server({ server })
  const { socketServer, players } = data

  socketServer.on('connection', ws => {

    ws.id = uuid()
    console.log(`created user: ${ws.id}`)

    ws.on('message', message => {
      const parsedMessage = JSON.parse(message)
      const { type, payload } = parsedMessage
      if (type !== 'join') return
      players[ws.id] = createPlayer(payload)
      console.log(`creating player: ${payload.name}`)
      ws.send(JSON.stringify({ type: 'join', payload: {} }))

      /* only handle action/movement from now on */
      ws.on('message', handleInput(players[ws.id]))
    })

    ws.on('close', () => {
      delete players[ws.id]
      console.log(`removed user: ${ws.id}`)
    })
  })
}

const startGameLoop = interval => {
  const { socketServer, players } = data
  setInterval(() => {
    const updatedPlayerPos = Object
      .values(players)
      .map(updatePlayerPos)
    emitToAll(socketServer, updatedPlayerPos)

    // const updatedProjectilePos = Object
    //   .values(projectiles)
    //   .map(updateProjectilePos)
    // emitToAll(socketServer, updatedProjectilePos)
  }, interval)
}

const emitToAll = (socketServer, payload) => {
  const jsonData = JSON.stringify({ type: 'update', payload })
  socketServer.clients.forEach(client => {
    if (client.readyState !== WebSocket.OPEN) return
    client.send(jsonData)
  })
}

module.exports = {
  configureWebSockets,
  startGameLoop
}