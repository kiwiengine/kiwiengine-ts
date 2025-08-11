import { EventContainer } from '@webtaku/event-container';
import { Collider, GameObjectPhysics } from './game-object-physics';
import { GameObjectRendering } from './game-object-rendering';
import { GlobalTransform, LocalTransform } from './transform';

export class GameObject extends EventContainer {
  #lt = new LocalTransform();
  protected _gt = new GlobalTransform();

  #rendering = new GameObjectRendering();
  #physics = new GameObjectPhysics();

  #parent?: GameObject;
  #children: GameObject[] = [];

  add(...children: GameObject[]) {
    for (const child of children) {
      if (child.#parent) {
        const idx = child.#parent.#children.indexOf(child);
        if (idx !== -1) child.#parent.#children.splice(idx, 1);
        child.#parent.#rendering.removeChild(child.#rendering);
      }
      child.#physics.setWorldFromParent(this.#physics);
      child.#parent = this;

      this.#children.push(child);
      this.#rendering.addChild(child.#rendering);
    }
  }

  remove() {
    if (this.#parent) {
      const idx = this.#parent.#children.indexOf(this);
      if (idx !== -1) this.#parent.#children.splice(idx, 1);
      this.#parent = undefined;
    }

    for (const child of this.#children) {
      child.#parent = undefined;
      child.remove();
    }
    this.#children.length = 0;

    this.#rendering.destroy();
    this.#physics.destroy();
  }

  protected update(dt: number): void { }

  _engineUpdate(dt: number) {
    this.update(dt);

    this.#rendering.applyChanges(this._gt);
    this.#physics.applyChanges(this._gt);

    for (const child of this.#children) {
      child._engineUpdate(dt);
    }
  }

  constructor(opts?: GameObjectOptions) {
    super();
    if (opts) {
      if (opts.x !== undefined) this.x = opts.x;
      if (opts.y !== undefined) this.y = opts.y;
      if (opts.pivotX !== undefined) this.pivotX = opts.pivotX;
      if (opts.pivotY !== undefined) this.pivotY = opts.pivotY;
      if (opts.scale !== undefined) this.scale = opts.scale;
      if (opts.scaleX !== undefined) this.scaleX = opts.scaleX;
      if (opts.scaleY !== undefined) this.scaleY = opts.scaleY;
      if (opts.rotation !== undefined) this.rotation = opts.rotation;
      if (opts.alpha !== undefined) this.alpha = opts.alpha;

      if (opts.drawOrder !== undefined) this.drawOrder = opts.drawOrder;
      if (opts.yBasedDrawOrder !== undefined) this.yBasedDrawOrder = opts.yBasedDrawOrder;

      if (opts.collider !== undefined) this.collider = opts.collider;
      if (opts.isStatic !== undefined) this.isStatic = opts.isStatic;
      if (opts.isSensor !== undefined) this.isSensor = opts.isSensor;
      if (opts.velocityX !== undefined) this.velocityX = opts.velocityX;
      if (opts.velocityY !== undefined) this.velocityY = opts.velocityY;
      if (opts.fixedRotation !== undefined) this.fixedRotation = opts.fixedRotation;
    }
  }

  get x() { return this.#lt.x; }
  set x(v: number) { this.#lt.x = v; }
  get y() { return this.#lt.y; }
  set y(v: number) { this.#lt.y = v; }
  get pivotX() { return this.#lt.pivotX; }
  set pivotX(v: number) { this.#lt.pivotX = v; }
  get pivotY() { return this.#lt.pivotY; }
  set pivotY(v: number) { this.#lt.pivotY = v; }
  get scale() { return this.#lt.scaleX; }
  set scale(v: number) { this.#lt.scaleX = v; this.#lt.scaleY = v; }
  get scaleX() { return this.#lt.scaleX; }
  set scaleX(v: number) { this.#lt.scaleX = v; }
  get scaleY() { return this.#lt.scaleY; }
  set scaleY(v: number) { this.#lt.scaleY = v; }
  get rotation() { return this.#lt.rotation; }
  set rotation(v: number) { this.#lt.rotation = v; }
  get alpha() { return this.#lt.alpha; }
  set alpha(v: number) { this.#lt.alpha = v; }

  get drawOrder() { return this.#rendering.drawOrder; }
  set drawOrder(v: number) { this.#rendering.drawOrder = v; }
  get yBasedDrawOrder() { return this.#rendering.yBasedDrawOrder; }
  set yBasedDrawOrder(v: boolean) { this.#rendering.yBasedDrawOrder = v; }

  get collider() { return this.#physics.collider; }
  set collider(v: Collider | undefined) { this.#physics.collider = v; }
  get isStatic() { return this.#physics.isStatic; }
  set isStatic(v: boolean) { this.#physics.isStatic = v; }
  get isSensor() { return this.#physics.isSensor; }
  set isSensor(v: boolean) { this.#physics.isSensor = v; }
  get velocityX() { return this.#physics.velocityX; }
  set velocityX(v: number) { this.#physics.velocityX = v; }
  get velocityY() { return this.#physics.velocityY; }
  set velocityY(v: number) { this.#physics.velocityY = v; }
  get fixedRotation() { return this.#physics.fixedRotation; }
  set fixedRotation(v: boolean) { this.#physics.fixedRotation = v; }
}

export type GameObjectOptions = {
  x?: number;
  y?: number;
  pivotX?: number;
  pivotY?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotation?: number;
  alpha?: number;

  drawOrder?: number;
  yBasedDrawOrder?: boolean;

  collider?: Collider;
  isStatic?: boolean;
  isSensor?: boolean;
  velocityX?: number;
  velocityY?: number;
  fixedRotation?: boolean;
};
