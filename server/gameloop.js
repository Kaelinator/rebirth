
const WebSocket = require('ws')
const uuid = require('uuid/v4')

const configureWebSockets = server => {

  const socketServer = new WebSocket.Server({ server })
  socketServer.on('connection', ws => {
    ws.id = uuid()
    console.log(`new user: ${ws.id}`)
    ws.on('message', message => {
      console.log(`recieved ${message}`)
    })
  })

}


module.exports = {
  configureWebSockets
}