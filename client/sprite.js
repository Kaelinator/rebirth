/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */





class Sprite {

  constructor(SPRITES, spriteName, x, y, idleAnimationName) {
    //console.log(SPRITES)
    this.x = x
    this.y = y
    this.spriteName = spriteName
    this.index = 0
    this.flipped = false

    //console.log(idleAnimationName)
    this.idleAnimation = this.getFrames(idleAnimationName)
    //console.log(this.idleAnimation)
    this.currentAnimationName = idleAnimationName
    this.currentAnimation = this.idleAnimation
  }
  show() {
    //console.log(SPRITES[this.spriteName].animations['animation1'].images)
    //console.log(this.getFrames('animation1'))
    let index = floor(this.index) % this.currentAnimation.length
    imageMode(CENTER)

    push()
    if(this.flipped){
      scale(-1, 1)
      translate(-width,0)
    }else{
      scale(1, 1)
    }
    image(this.currentAnimation[index], this.x, this.y, this.currentAnimation[index].width , this.currentAnimation[index].height)
    pop()

    this.update()
  }

  flipSprite(flipNumber){
    if(flipNumber < 0)
      this.flipped = true
    else
      this.flipped = false
  }

  changeAnimation(newAnimation){
    this.currentAnimationName = newAnimation
    this.currentAnimation = this.getFrames(newAnimation)
  }


  update(){
    this.index += SPRITES[this.spriteName].animations[this.currentAnimationName].speed
  }

  getFrames(animationName){
    return SPRITES[this.spriteName].animations[animationName].images
  }

  setPos(x, y) {
    this.x = x
    this.y = y
  }
}
