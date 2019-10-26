/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

let spritesheet
let spritedata

let animation = []

let player

let players = []

function preload() {
  spritedata = loadJSON('./assets/sprites/spritesheet_data/spritesheet.json')
  spritesheet = loadImage('./assets/sprites/spritesheets/spritesheet.png')
}

function setup() {
  createCanvas(500, 500)
  background(255)

  let images = Object.values(spritedata.frames)

  images.forEach(({ frame }) => {
    const { x, y, w, h } = frame
    const img = spritesheet.get(x, y, w, h)
    animation.push(img)
  })

  player = new Sprite(animation, 100, 100, .3)

}

function draw() {
  background(255)

  player.show()
  player.animate()
  
}
