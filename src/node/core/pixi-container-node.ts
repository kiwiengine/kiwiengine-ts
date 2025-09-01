import { EventMap } from '@webtaku/event-emitter'
import { Container } from 'pixi.js'
import { GameNode } from '../core/game-node'
import { HasPixiContainer } from '../core/has-pixi-container'

export function isHasPixiContainer(v: unknown): v is HasPixiContainer {
  return (v as HasPixiContainer)._pixiContainer !== undefined
}

export abstract class PixiContainerNode<E extends EventMap = EventMap>
  extends GameNode<E>
  implements HasPixiContainer {
  _pixiContainer = new Container({ sortableChildren: true })

  override add(...children: GameNode<EventMap>[]) {
    super.add(...children)

    for (const child of children) {
      if (isHasPixiContainer(child)) {
        this._pixiContainer.addChild(child._pixiContainer)
      }
    }
  }

  override remove() {
    this._pixiContainer.destroy({ children: true })
    super.remove()
  }
}
