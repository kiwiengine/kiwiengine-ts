import { checkCollision, ColliderType, enableDebug, GameObjectOptions, preload, RectangleCollider, Renderer, SpriteNode } from '../../src'

enableDebug()

await preload(['assets/cat.png'])

const renderer = new Renderer(document.body, {
  logicalWidth: 800,
  logicalHeight: 600,
  backgroundColor: '#304C79'
})

class Cat extends SpriteNode {
  collider: RectangleCollider = { type: ColliderType.Rectangle, width: 50, height: 50 }

  constructor(options: GameObjectOptions) {
    super({ src: 'assets/cat.png', ...options })
  }
}

const cat1 = new Cat({ x: -100, y: 0 })
const cat2 = new Cat({ x: 100, y: 0, scale: 2, rotation: Math.PI / 4 })
renderer.add(cat1, cat2)

renderer.on('update', (dt) => {
  cat1.x += dt * 30
  cat2.x -= dt * 30

  console.log(checkCollision(cat1.collider, cat1.worldTransform, cat2.collider, cat2.worldTransform))
})
