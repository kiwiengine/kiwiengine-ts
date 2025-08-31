import { EventMap } from '@webtaku/event-emitter'
import { GameNode } from '../core/game-node'
import { PixiContainerNode } from '../core/pixi-container-node'
import { PhysicsWorld } from './physics-world'

export class PhysicsObject<E extends EventMap> extends PixiContainerNode<E> {
  override set parent(parent: GameNode | undefined) {
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
