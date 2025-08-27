import { ObjectType } from '@kiwiengine/core'

export type GameObjectOptions = {
  type?: ObjectType
}

export class GameObject {
  #options: GameObjectOptions

  constructor(options: GameObjectOptions) {
    this.#options = options
  }
}
