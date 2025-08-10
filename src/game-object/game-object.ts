import { EventContainer } from '@webtaku/event-container';
import { GameObjectPhysics } from './game-object-physics';
import { GameObjectRendering } from './game-object-rendering';
import { GlobalTransform, LocalTransform } from './transform';

export class GameObject extends EventContainer {
  #lt = new LocalTransform();
  protected _gt = new GlobalTransform();

  #rendering = new GameObjectRendering();
  #physics?: GameObjectPhysics;
}
