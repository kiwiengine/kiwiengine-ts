import { AnimatedSpriteNode, enableDebug, preload, Renderer, SpriteNode } from '../../src'

enableDebug()

const renderer = new Renderer(document.body, {
  logicalWidth: 800,
  logicalHeight: 600,
  backgroundColor: '#304C79'
})

await preload(['assets/bird.png'])

for (let i = 0; i < 100; i++) {
  const sprite = new SpriteNode({
    src: 'assets/bird.png',
    x: Math.random() * renderer.canvasWidth - renderer.canvasWidth / 2,
    y: Math.random() * renderer.canvasHeight - renderer.canvasHeight / 2
  })
  renderer.add(sprite)
}

const animatedSprite = new AnimatedSpriteNode({
  src: 'assets/fire.png',
  atlas: {
    frames: {
      fire1: { x: 0, y: 0, w: 64, h: 64 },
      fire2: { x: 64, y: 0, w: 64, h: 64 },
      fire3: { x: 128, y: 0, w: 64, h: 64 },
      fire4: { x: 192, y: 0, w: 64, h: 64 },
      fire5: { x: 256, y: 0, w: 64, h: 64 },
    },
    animations: {
      fire: { frames: ['fire1', 'fire2', 'fire3', 'fire4', 'fire5'], fps: 12, loop: true },
    },
  },
  animation: 'fire',
})
renderer.add(animatedSprite)
