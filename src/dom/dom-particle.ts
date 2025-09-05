import { EventMap } from '@webtaku/event-emitter'
import { DomGameObject } from './dom-game-object'

export class DomParticleSystem<E extends EventMap = EventMap> extends DomGameObject<E> { }
