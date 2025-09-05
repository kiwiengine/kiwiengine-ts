import { DomAnimatedSpriteNode, domPreload, DomSpriteNode, enableDebug, Ticker } from '../../src'

enableDebug()

await domPreload([
  'assets/bird.png',
  'assets/fire.png'
])

for (let i = 0; i < 100; i++) {
  new DomSpriteNode({
    src: 'assets/bird.png',
    x: Math.random() * window.innerWidth - window.innerWidth / 2,
    y: Math.random() * window.innerHeight - window.innerHeight / 2
  }).attachTo(document.body)
}

const animatedSprite = new DomAnimatedSpriteNode({
  src: 'assets/fire.png',
  atlas: {
    frames: {
      fire1: { frame: { x: 0, y: 0, w: 64, h: 64 } },
      fire2: { frame: { x: 64, y: 0, w: 64, h: 64 } },
      fire3: { frame: { x: 128, y: 0, w: 64, h: 64 } },
      fire4: { frame: { x: 192, y: 0, w: 64, h: 64 } },
      fire5: { frame: { x: 256, y: 0, w: 64, h: 64 } },
    },
    meta: { scale: 1 },
    animations: {
      fire: ['fire1', 'fire2', 'fire3', 'fire4', 'fire5'],
    },
  },
  animation: 'fire',
  fps: 12,
  loop: true,
}).attachTo(document.body)

new Ticker(dt => animatedSprite.render(dt))
