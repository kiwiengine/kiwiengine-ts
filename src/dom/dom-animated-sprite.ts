import { EventMap } from '@webtaku/event-emitter'
import { DomGameObject } from './dom-game-object'

export class DomAnimatedSpriteNode<E extends EventMap = EventMap> extends DomGameObject<E> {
  override render(dt: number) {
    super.render(dt)
  }
}
