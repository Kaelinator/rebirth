/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */


let player

let SPRITES = {
  'Lucy': {
    animations: {
      'animation1': {
        speed: 1,
        spritedata: null,
        spritesheet: null,
        images: []
      }
    }  
  },
  'RedBunner': {
    animations: {
      'walk': {
        speed: .1,
        spritedata: null,
        spritesheet: null,
        images: []
      },
      'idle': {
        speed: 1,
        spritedata: null,
        spritesheet: null,
        images: []
      }
    }  
  }
}

function preload(){
  let spriteKeys = Object.keys(SPRITES)
  //console.log(spriteKeys)
  spriteKeys.forEach(spriteKey => {
    //console.log(spriteValue)
    let animationKeys = Object.keys(SPRITES[spriteKey].animations)
    //console.log(animationKeys)
    animationKeys.forEach(animationKey => {
      //console.log( SPRITES[spriteKey].animations[animationKey])
      SPRITES[spriteKey].animations[animationKey].spritedata =  loadJSON(`./assets/sprites/${spriteKey}/${animationKey}_data.json`)
      SPRITES[spriteKey].animations[animationKey].spritesheet =  loadImage(`./assets/sprites/${spriteKey}/${animationKey}.png`)

    })
  })
}

function populateAnimationFrames(){
  let spriteKeys = Object.keys(SPRITES)

  spriteKeys.forEach(spriteKey => {

    let animationKeys = Object.keys(SPRITES[spriteKey].animations)

    animationKeys.forEach(animationKey => {
      let spritedata = SPRITES[spriteKey].animations[animationKey].spritedata
      let spritesheet = SPRITES[spriteKey].animations[animationKey].spritesheet
      let guymove = Object.values(spritedata.frames)

      SPRITES[spriteKey].animations[animationKey].images = guymove.map(({ frame }) => {
        const { x, y, w, h } = frame
        return spritesheet.get(x, y, w, h)
      })

    })

  })
  
}

function setup() {
  populateAnimationFrames()

  createCanvas(500, 500)
  background(255)

 
 
  playerSprite = new Sprite(SPRITES, 'RedBunner', 100, 100, 'idle')

}

function draw() {
  background(255)

  playerSprite.show()
  if(keyIsDown(RIGHT_ARROW) || keyIsDown(LEFT_ARROW))
    playerSprite.changeAnimation('walk')
  else 
    playerSprite.changeAnimation('idle')

  playerSprite.flipSprite(mouseX - playerSprite.x)

}

