import { EventMap } from '@webtaku/event-emitter'
import { Container } from 'pixi.js'
import { GameNode } from '../core/game-node'

export class PhysicsObject extends GameNode<EventMap> {
  #pixiContainer = new Container()
}
