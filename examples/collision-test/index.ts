import { enableDebug, preload, Renderer, SpriteNode } from '../../src'

enableDebug()

await preload(['assets/cat.png'])

const renderer = new Renderer(document.body, {
  logicalWidth: 800,
  logicalHeight: 600,
  backgroundColor: '#304C79'
})

const cat1 = new SpriteNode({ x: -100, y: 0, src: 'assets/cat.png' })
const cat2 = new SpriteNode({ x: 100, y: 0, src: 'assets/cat.png' })
renderer.add(cat1, cat2)

renderer.on('update', (dt) => {
  cat1.x += dt * 30
  cat2.x -= dt * 30
})
