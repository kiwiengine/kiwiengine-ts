import { GameObject, GameObjectOptions } from '../game-object/game-object';
import { WorldDebug } from './world-debug';
import { WorldPhysics } from "./world-physics";
import { WorldRendering } from "./world-rendering";

export type WorldOptions = {
  width: number;
  height: number;
} & GameObjectOptions;

export class World extends GameObject {
  container = document.createElement('div');
  #rendering = new WorldRendering();
  #physics = new WorldPhysics();
  #debug = new WorldDebug(this.container);

  constructor(opts: WorldOptions) {
    super(opts);
  }
}
