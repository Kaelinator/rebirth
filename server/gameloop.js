
const WebSocket = require('ws')
const uuid = require('uuid/v4')
const { createPlayer, updatePlayerPos } = require('./player')
const { updateProjectilePos } = require('./projectile')

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
    players[ws.id] = createPlayer()
    console.log(`created user: ${ws.id}`)

    ws.on('message', message => {
      players[ws.id].movement = JSON.parse(message)
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