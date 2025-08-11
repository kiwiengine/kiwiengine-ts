import Matter from 'matter-js';
import { GlobalTransform } from './transform';

type BaseCollider = { x?: number; y?: number; };
type RectangleCollider = BaseCollider & { type: 'rect'; width: number; height: number };
type CircleCollider = BaseCollider & { type: 'circle'; radius: number };
type VerticesCollider = BaseCollider & { type: 'vert'; vertices: { x: number; y: number }[] };
export type Collider = RectangleCollider | CircleCollider | VerticesCollider;

export class GameObjectPhysics {
  #collider?: Collider;
  #isStatic = false;
  #isSensor = false;
  #velocityX = 0;
  #velocityY = 0;
  #fixedRotation = false;

  #matterWorld?: Matter.World;
  #matterBody?: Matter.Body;

  setWorldFromParent(parent: GameObjectPhysics) {
    this.#matterWorld = parent.#matterWorld;
  }

  destroy() {
    if (!this.#matterWorld || !this.#matterBody) return;
    Matter.World.remove(this.#matterWorld, this.#matterBody);
  }

  applyChanges(gt: GlobalTransform) { /* TODO */ }

  get collider() { return this.#collider; }
  set collider(value: Collider | undefined) {
    this.#collider = value;
  }

  get isStatic() { return this.#isStatic; }
  set isStatic(value: boolean) {
    this.#isStatic = value;
  }

  get isSensor() { return this.#isSensor; }
  set isSensor(value: boolean) {
    this.#isSensor = value;
  }

  get velocityX() { return this.#velocityX; }
  set velocityX(value: number) {
    this.#velocityX = value;
  }

  get velocityY() { return this.#velocityY; }
  set velocityY(value: number) {
    this.#velocityY = value;
  }

  get fixedRotation() { return this.#fixedRotation; }
  set fixedRotation(value: boolean) {
    this.#fixedRotation = value;
  }
}
