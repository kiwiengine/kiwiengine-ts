import { DirtyNumber } from '../node/core/dirty-number';
import { GameNode } from '../node/core/game-node';
import { LocalTransform, WorldTransform } from '../node/core/transform';
import { setStyle } from './dom-utils';
export function isDomGameObject(v) {
    return v.worldTransform !== undefined;
}
class DomRootNode extends GameNode {
    worldTransform = new WorldTransform();
    worldAlpha = new DirtyNumber(1);
    constructor() {
        super();
        this.worldTransform.x.v = 0;
        this.worldTransform.y.v = 0;
        this.worldTransform.resetDirty();
    }
}
export class DomGameObject extends GameNode {
    el = document.createElement('div');
    #localTransform = new LocalTransform();
    worldTransform = new WorldTransform();
    alpha = 1;
    worldAlpha = new DirtyNumber(1);
    #useYSort = false;
    constructor(options) {
        super();
        setStyle(this.el, {
            position: 'absolute',
            left: '50%',
            top: '50%',
            zIndex: '1',
            transform: 'translate(-50%, -50%)',
        });
        if (options) {
            if (options.x !== undefined)
                this.x = options.x;
            if (options.y !== undefined)
                this.y = options.y;
            if (options.scale !== undefined)
                this.scale = options.scale;
            if (options.scaleX !== undefined)
                this.scaleX = options.scaleX;
            if (options.scaleY !== undefined)
                this.scaleY = options.scaleY;
            if (options.pivotX !== undefined)
                this.pivotX = options.pivotX;
            if (options.pivotY !== undefined)
                this.pivotY = options.pivotY;
            if (options.rotation !== undefined)
                this.rotation = options.rotation;
            if (options.alpha !== undefined)
                this.alpha = options.alpha;
            if (options.drawOrder !== undefined)
                this.drawOrder = options.drawOrder;
            this.#useYSort = options.useYSort ?? false;
        }
    }
    render(dt) {
        this.update(dt);
        this.#updateWorldTransform();
    }
    #updateWorldTransform() {
        const parent = this.parent;
        if (parent && isDomGameObject(parent)) {
            this.worldTransform.update(parent.worldTransform, this.#localTransform);
            this.worldAlpha.v = parent.worldAlpha.v * this.alpha;
        }
        if (this.worldTransform.dirty) {
            const wt = this.worldTransform;
            this.el.style.transform = `
        translate(
          calc(-50% + ${wt.x.v}px),
          calc(-50% + ${wt.y.v}px)
        )
        scale(${wt.scaleX.v}, ${wt.scaleY.v})
        rotate(${wt.rotation.v}rad)
      `;
            if (this.#useYSort)
                this.drawOrder = wt.y.v;
        }
        if (this.worldAlpha.dirty)
            this.el.style.opacity = this.worldAlpha.v.toString();
        for (const child of this.children) {
            if (isDomGameObject(child))
                child.#updateWorldTransform();
        }
        this.worldTransform.resetDirty();
    }
    attachTo(target) {
        target.appendChild(this.el);
        this.parent = new DomRootNode();
        this.#updateWorldTransform();
        return this;
    }
    set x(v) { this.#localTransform.x = v; }
    get x() { return this.#localTransform.x; }
    set y(v) { this.#localTransform.y = v; }
    get y() { return this.#localTransform.y; }
    set scale(v) { this.#localTransform.scaleX = v; this.#localTransform.scaleY = v; }
    get scale() { return this.#localTransform.scaleX; }
    set scaleX(v) { this.#localTransform.scaleX = v; }
    get scaleX() { return this.#localTransform.scaleX; }
    set scaleY(v) { this.#localTransform.scaleY = v; }
    get scaleY() { return this.#localTransform.scaleY; }
    set pivotX(v) { this.#localTransform.pivotX = v; }
    get pivotX() { return this.#localTransform.pivotX; }
    set pivotY(v) { this.#localTransform.pivotY = v; }
    get pivotY() { return this.#localTransform.pivotY; }
    set rotation(v) { this.#localTransform.rotation = v; }
    get rotation() { return this.#localTransform.rotation; }
    set drawOrder(v) { this.el.style.zIndex = v.toString(); }
    get drawOrder() { return Number(this.el.style.zIndex); }
}
//# sourceMappingURL=dom-game-object.js.map