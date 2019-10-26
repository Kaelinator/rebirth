/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

let connection
let connected = false

const DEBUG = document.location.protocol === 'http:'

function preload() {

  const connectionAddress = `ws${DEBUG ? '' : 's'}://${document.location.host}`
  connection = new WebSocket(connectionAddress)
  connection.onopen = event => {
    connected = true
  }
}

function setup() {
  createCanvas(500, 500)
  background(51)
}

function draw() {
  if (connected)
    text('Connected', 0, 32)
}
