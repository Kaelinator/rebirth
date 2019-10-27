/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const MAP_SIZE = 1000

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
  connected: false,
  playing: false
}

const movement = {
  isStrafingLeft: false,
  isStrafingRight: false,
  isJumping: false,
  isShooting: false,
  mouse: { x: 0, y: 0 }
}

const environment = {
  players: [],
  bodies: [],
  projectiles: []
}

function preload() {

  const connectionAddress = `ws${DEBUG ? '' : 's'}://${document.location.host}`
  connection.socket = new WebSocket(connectionAddress)

  connection.socket.onopen = event => {
    connection.connected = true

  }
  connection.socket.onmessage = ({ data }) => {
    const { type, payload } = JSON.parse(data)
    if (type !== 'join') return
    hideLogin()
    connection.socket.onmessage = handleEnvironmentChange
  }
}

function setup() {
  SCALE = window.innerWidth / MAP_SIZE
  createCanvas(window.innerWidth, window.innerHeight)
  noStroke()
  fill(255)
  textAlign(CENTER)
}

function draw() {
  if (!connection.connected) return

  background(173, 216, 230)

  text('Connected', 32, 32)

  handleInput()

  environment.players.forEach(drawPlayer)
  environment.bodies.forEach(drawBody)
  environment.projectiles.forEach(drawProjectile)
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

  const mouse = {
    x: mouseX / SCALE,
    y: mouseY / SCALE
  }

  if (movement.mouse.x !== mouse.x || movement.mouse.y !== mouse.y) {
    inputChanged = true
    movement.mouse = mouse
  }

  if (inputChanged)
    sendInputs(connection.socket)
}

const sendInputs = socket => {
  socket.send(JSON.stringify({ type: 'movement', payload: movement }))
}

const drawPlayer = (player) => {
  const { name, position } = player

  const x = position.x * SCALE
  const y = position.y * SCALE
  text(name, x, y - 20)
  ellipse(x, y, 10)
}

const drawBody = (body) => {
  const { position, size } = body

  const x = position.x * SCALE
  const y = position.y * SCALE
  const w = size.width * SCALE
  const h = size.height * SCALE

  rect(x, y, w, h)
}

const drawProjectile = (projectile) => {
  const {position} = projectile

  const x = position.x * SCALE
  const y = position.y * SCALE
  
  ellipse(x, y, 10)
}

const handleEnvironmentChange = ({ data }) => {
  const { type, payload } = JSON.parse(data)
  if (type !== 'update') return

  environment.players = payload.players
  environment.bodies = payload.bodies
  environment.projectiles = payload.projectiles
}

const joinGame = name => {
  const { socket, connected } = connection
  if (!connected) return
  socket.send(JSON.stringify({ type: 'join', payload: { name } }))
}