import { GameObject, GameObjectOptions } from '../game-object/game-object';
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

  constructor(opts: WorldOptions) {
    super(opts);
    //TODO
  }
}
