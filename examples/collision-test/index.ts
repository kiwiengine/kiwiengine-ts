import { enableDebug, GameObjectOptions, preload, Renderer, SpriteNode } from '../../src'
import { Collider } from '../../src/collision/colliders'

enableDebug()

await preload(['assets/cat.png'])

const renderer = new Renderer(document.body, {
  logicalWidth: 800,
  logicalHeight: 600,
  backgroundColor: '#304C79'
})

class Cat extends SpriteNode {
  colliders: Collider[] = []

  constructor(options: GameObjectOptions) {
    super({ src: 'assets/cat.png', ...options })
  }
}

const cat1 = new Cat({ x: -100, y: 0 })
const cat2 = new Cat({ x: 100, y: 0 })
renderer.add(cat1, cat2)

renderer.on('update', (dt) => {
  cat1.x += dt * 30
  cat2.x -= dt * 30
})
