const express = require('express')
const game = require('./server/gameloop')
const http = require('http')
const app = express()
const path = require('path')

app.use('/', express.static(path.join(__dirname, 'client')))

const server = http.createServer(app)

game.configureWebSockets(server)

server.listen(process.env.PORT || 3000, () => {
  console.log(`PORT ${server.address().port} WE'RE LIVE!`)
})
