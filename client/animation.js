/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

let spritesheet
let spritedata

let animation = []

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

}

function draw() {
  background(255)
  image(animation[frameCount % animation.length], 0, 0)
}
