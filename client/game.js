/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const DEBUG = document.location.protocol === 'http:'

const CONTROLS = [
  {
    keyCode: 65,
    action: 'isStrafingRight'
  },
  {
    keyCode: 68,
    action: 'isStrafingLeft'
  },
  {
    keyCode: 32,
    action: 'isJumping'
  }
]

const connection = {
  socket: null,
  connected: false
}

const movement = {
  isStrafingLeft: false,
  isStrafingRight: false,
  isJumping: false
}

const environment = {
  players: {}
}

function preload() {

  const connectionAddress = `ws${DEBUG ? '' : 's'}://${document.location.host}`
  connection.socket = new WebSocket(connectionAddress)

  connection.socket.onopen = event => {
    connection.connected = true

  }
  connection.socket.onmessage = ({ data }) => {
    environment.players = JSON.parse(data)
  }
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight)
  noStroke()
  fill(255)
}

function draw() {
  if (!connection.connected) return

  background(51)

  text('Connected', 0, 32)

  handleInput()

  environment.players.forEach(drawPlayer)
}

const handleInput = () => {
  let inputChanged = false

  CONTROLS.forEach(({ keyCode, action }) => {
    const isKeyDown = keyIsDown(keyCode)
    const changed = movement[action] !== isKeyDown
    if (!changed) return
    movement[action] = isKeyDown
    inputChanged = true
  })

  if (inputChanged)
    sendInputs(connection.socket)
}

const sendInputs = socket => {
  socket.send(JSON.stringify(movement))
}

const drawPlayer = ({position}) => {
  ellipse(position[0], position[1], 10)
}