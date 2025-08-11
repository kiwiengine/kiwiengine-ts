import { WorldPhysics } from "./world-physics";
import { WorldRendering } from "./world-rendering";

export class World {
  #rendering = new WorldRendering();
  #physics = new WorldPhysics();
}
