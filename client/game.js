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

function preload() {

  const connectionAddress = `ws${DEBUG ? '' : 's'}://${document.location.host}`
  connection.socket = new WebSocket(connectionAddress)

  connection.socket.onopen = event => {
    connection.connected = true
  }
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight)
  background(51)
}

function draw() {
  if (!connection.connected) return

  text('Connected', 0, 32)

  handleInput()
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