import { EventEmitter, EventMap } from '@webtaku/event-emitter';
import { LocalTransform } from '../game-object/transform';
import { addRootObject, removeRootObject } from './dom-world';

export class DomGameObject<E extends EventMap = EventMap> extends EventEmitter<E & {
  update: (dt: number) => void
}> {
  #lt = new LocalTransform();
  protected _container = document.createElement('div');
  #parent?: DomGameObject;
  #children: DomGameObject[] = [];

  attachToDom(target: HTMLElement) {
    target.appendChild(this._container);
    addRootObject(this);
  }

  add(...children: DomGameObject[]) {
    for (const child of children) {
      if (child.#parent) {
        const idx = child.#parent.#children.indexOf(child);
        if (idx !== -1) child.#parent.#children.splice(idx, 1);
      }
      child.#parent = this;

      this.#children.push(child);
      this._container.appendChild(child._container);
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

    this._container.remove();
    removeRootObject(this);
  }

  protected update(dt: number): void { }

  protected _afterRender(dt: number) { }
  _engineUpdate(dt: number) {
    this.update(dt);

    if (
      this.#lt.x.dirty ||
      this.#lt.y.dirty ||
      this.#lt.scaleX.dirty ||
      this.#lt.scaleY.dirty ||
      this.#lt.rotation.dirty
    ) {
      this._container.style.transform = `
      translate(
        calc(-50% + ${this.#lt.x.v}px),
        calc(-50% + ${this.#lt.y.v}px)
      )
      scale(${this.#lt.scaleX.v}, ${this.#lt.scaleY.v})
      rotate(${this.#lt.rotation.v}rad)
    `;
    }
    if (this.#lt.alpha.dirty) this._container.style.opacity = this.#lt.alpha.v.toString();
    this._afterRender(dt);

    (this as any).emit('update', dt);

    for (const child of this.#children) {
      child._engineUpdate(dt);
    }
  }

  constructor(opts?: DomGameObjectOptions) {
    super();
    this._container.style.position = 'absolute';
    this._container.style.left = '0';
    this._container.style.top = '0';
    this._container.style.zIndex = '1';
    this._container.style.transform = 'translate(-50%, -50%)';

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
    }
  }

  get x() { return this.#lt.x.v; }
  set x(v: number) { this.#lt.x.v = v; }
  get y() { return this.#lt.y.v; }
  set y(v: number) { this.#lt.y.v = v; }
  get pivotX() { return this.#lt.pivotX.v; }
  set pivotX(v: number) { this.#lt.pivotX.v = v; }
  get pivotY() { return this.#lt.pivotY.v; }
  set pivotY(v: number) { this.#lt.pivotY.v = v; }
  get scale() { return this.#lt.scaleX.v; }
  set scale(v: number) { this.#lt.scaleX.v = v; this.#lt.scaleY.v = v; }
  get scaleX() { return this.#lt.scaleX.v; }
  set scaleX(v: number) { this.#lt.scaleX.v = v; }
  get scaleY() { return this.#lt.scaleY.v; }
  set scaleY(v: number) { this.#lt.scaleY.v = v; }
  get rotation() { return this.#lt.rotation.v; }
  set rotation(v: number) { this.#lt.rotation.v = v; }
  get alpha() { return this.#lt.alpha.v; }
  set alpha(v: number) { this.#lt.alpha.v = v; }
  get drawOrder() { return Number(this._container.style.zIndex); }
  set drawOrder(v: number) { this._container.style.zIndex = v.toString(); }
}

export type DomGameObjectOptions = {
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
}