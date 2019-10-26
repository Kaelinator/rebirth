const express = require('express')
const WebSocket = require('ws')
const http = require('http')
const app = express()


app.get('/', (req, res) => {
  res.send('Testing')
})

const server = http.createServer(app)

const socketServer = new WebSocket.Server({ server });

server.listen(process.env.PORT || 3000, () => {
  console.log(`WE'RE LIVE! ${server.address().port}`)
})