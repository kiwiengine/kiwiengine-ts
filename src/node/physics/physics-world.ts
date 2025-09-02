import { EventMap } from '@webtaku/event-emitter'
import { Container as PixiContainer } from 'pixi.js'
import { RenderableNode } from '../core/renderable'

export class PhysicsWorld<E extends EventMap = EventMap> extends RenderableNode<PixiContainer, E> {
  constructor() {
    super(new PixiContainer({ sortableChildren: true }))
    this.worldTransform.x.v = 0
    this.worldTransform.y.v = 0
    this.worldTransform.resetDirty()
  }
}
