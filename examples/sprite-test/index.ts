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
      fire1: { frame: { x: 0, y: 0, w: 64, h: 64 } },
      fire2: { frame: { x: 64, y: 0, w: 64, h: 64 } },
      fire3: { frame: { x: 128, y: 0, w: 64, h: 64 } },
      fire4: { frame: { x: 192, y: 0, w: 64, h: 64 } },
      fire5: { frame: { x: 256, y: 0, w: 64, h: 64 } },
    },
    animations: {
      fire: ['fire1', 'fire2', 'fire3', 'fire4', 'fire5'],
    },
  },
  animation: 'fire',
  fps: 12,
  loop: true,
})
renderer.add(animatedSprite)
