import { enableDebug, preload, Renderer, SpriteNode } from '../../src'

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
    x: Math.random() * 800 - renderer.canvasWidth / 2,
    y: Math.random() * 600 - renderer.canvasHeight / 2
  })
  renderer.add(sprite)
}

/*const animatedSprite = new AnimatedSpriteNode({
  src: 'assets/fire.png',
  frameWidth: 64,
  frameHeight: 64,
  frameCount: 5,
  fps: 12,
  loop: true,
})
renderer.add(animatedSprite);
*/

