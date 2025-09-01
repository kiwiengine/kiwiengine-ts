import { Sprite as PixiSprite } from 'pixi.js'
import { textureLoader } from '../../asset/loaders/texture'
import { GameObject, GameObjectOptions } from '../core/game-object'

export type SpriteNodeOptions = {
  src: string
} & GameObjectOptions

export class SpriteNode extends GameObject {
  #src: string
  #sprite?: PixiSprite

  constructor(options: SpriteNodeOptions) {
    super(options)
    this.#src = options.src
    this.#load()
  }

  async #load() {
    if (!textureLoader.checkLoaded(this.#src)) {
      console.info(`Texture not preloaded. Loading now: ${this.#src}`)
    }

    //TODO
  }
}
