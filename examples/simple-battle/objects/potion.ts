import { debugMode } from '../../../src/debug'
import { AnimatedSpriteNode, CircleCollider, CircleNode, ColliderType } from '../../../src/index'
import { GameObject } from '../../../src/node/core/game-object'
import potionAtlas from '../assets/spritesheets/potion-atlas.json'

export class Potion extends GameObject {
  triggerBox: CircleCollider = { type: ColliderType.Circle, radius: 16 }

  constructor() {
    super()
    this.add(new AnimatedSpriteNode({
      src: 'assets/spritesheets/potion.png',
      atlas: potionAtlas,
      animation: 'animation',
      fps: 10,
      loop: true,
      scale: 2
    }))

    if (debugMode) this.add(new CircleNode({ ...this.triggerBox, stroke: 'green' }))
  }
}
