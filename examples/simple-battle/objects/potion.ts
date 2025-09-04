import { debugMode } from '../../../src/debug'
import { AnimatedSpriteNode, CircleCollider, CircleNode, ColliderType } from '../../../src/index'
import { GameObject, GameObjectOptions } from '../../../src/node/core/game-object'
import potionAtlas from '../assets/spritesheets/potion-atlas.json'

export type PotionOptions = {
  healAmount?: number
} & GameObjectOptions

export class Potion extends GameObject {
  triggerCollider: CircleCollider = { type: ColliderType.Circle, radius: 16 }
  healAmount: number

  constructor(options?: PotionOptions) {
    super({ ...options, useYSort: true })
    this.healAmount = options?.healAmount ?? 100

    this.add(new AnimatedSpriteNode({
      src: 'assets/spritesheets/potion.png',
      atlas: potionAtlas,
      animation: 'animation',
      fps: 10,
      loop: true,
      scale: 2
    }))

    if (debugMode) {
      this.add(new CircleNode({ ...this.triggerCollider, stroke: 'green', alpha: 0.5, layer: 'hud' }))
    }
  }
}
