
const WebSocket = require('ws')
const uuid = require('uuid/v4')

const data = {
  players: {},
  socketServer: null
}

const configureWebSockets = server => {

  data.socketServer = new WebSocket.Server({ server })
  const { socketServer, players } = data

  socketServer.on('connection', ws => {

    ws.id = uuid()
    players[ws.id] = {}
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
    const updated = Object.values(players).map(changeVelocity)
    emitToAll(socketServer, updated)
  }, interval)
}

const changeVelocity = player => ({
  ...player
})


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