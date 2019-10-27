const CreateBody = (position, size) => ({
  positionVector: [position],
  bodySize: {width: size.x, height: size.y}
})

module.exports = {
  CreateBody
}
