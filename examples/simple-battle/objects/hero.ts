import { AnimatedSpriteNode, ColliderType, GameObjectOptions } from '../../../src/index'
import { Character } from './character'
import heroAtlas from '../assets/spritesheets/hero-atlas.json'

export class Hero extends Character {
  #sprite: AnimatedSpriteNode

  constructor(options?: GameObjectOptions) {
    super({
      ...options,
      maxHp: 1000,
      hp: 1000,
      hitbox: { type: ColliderType.Rectangle, width: 32, height: 52, x: 24, y: -8 },
      hurtbox: { type: ColliderType.Rectangle, width: 24, height: 40, x: 0, y: -4 },
    })

    this.#sprite = new AnimatedSpriteNode({
      src: 'assets/spritesheets/hero.png',
      atlas: heroAtlas,
      animation: 'idle',
      fps: 10,
      loop: true,
      scale: 2
    })
    this.add(this.#sprite)
  }
}
