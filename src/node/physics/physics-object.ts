import { EventMap } from '@webtaku/event-emitter'
import { GameNode } from '../core/game-node'
import { GameObject } from '../core/game-object'
import { PhysicsWorld } from './physics-world'

export class PhysicsObject<E extends EventMap> extends GameObject<E> {
  override set parent(parent: GameNode<EventMap> | undefined) {
    if (!(parent instanceof PhysicsWorld)) {
      const actual = parent === undefined
        ? 'undefined'
        : parent.constructor?.name ?? typeof parent
      throw new Error(`PhysicsObject parent must be PhysicsWorld, but got ${actual}`)
    }
    super.parent = parent
  }

  override get parent() {
    return super.parent
  }
}
