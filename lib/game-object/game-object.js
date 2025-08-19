import { EventEmitter } from '@webtaku/event-emitter';
import { Sprite } from 'pixi.js';
import { textureLoader } from '../asset/loaders/texture';
import { GameObjectPhysics } from './game-object-physics';
import { GameObjectRendering } from './game-object-rendering';
import { LocalTransform, WorldTransform } from './transform';
export class GameObject extends EventEmitter {
    _lt = new LocalTransform();
    _wt = new WorldTransform();
    _rendering = new GameObjectRendering();
    #physics = new GameObjectPhysics(this);
    #world;
    #parent;
    #children = [];
    data = {};
    _setWorld(world) {
        this.#world = world;
        for (const child of this.#children) {
            child._setWorld(world);
        }
    }
    _getWorld() { return this.#world; }
    add(...children) {
        for (const child of children) {
            if (child.#parent) {
                const idx = child.#parent.#children.indexOf(child);
                if (idx !== -1)
                    child.#parent.#children.splice(idx, 1);
            }
            if (this.#world)
                child._setWorld(this.#world);
            child.#parent = this;
            this.#children.push(child);
            if (child.layer) {
                this.#world?._addToLayer(child, child.layer);
            }
            else {
                this._rendering.addChild(child._rendering);
            }
        }
    }
    remove() {
        if (this.#parent) {
            const idx = this.#parent.#children.indexOf(this);
            if (idx !== -1)
                this.#parent.#children.splice(idx, 1);
            this.#parent = undefined;
        }
        for (const child of this.#children) {
            child.#parent = undefined;
            child.remove();
        }
        this.#children.length = 0;
        this._rendering.destroy();
        this.#physics.destroy();
    }
    update(dt) { }
    _afterRender(dt) { }
    _engineUpdate(dt, pt) {
        this.update(dt);
        this._wt.update(pt, this._lt);
        this.#physics.applyChanges();
        this._rendering.applyChanges(this._lt);
        this._afterRender(dt);
        this._lt.markClean();
        this.emit('update', dt);
        for (const child of this.#children) {
            child._engineUpdate(dt, this._wt);
        }
        this._wt.markClean();
    }
    constructor(opts) {
        super();
        if (opts) {
            if (opts.x !== undefined)
                this.x = opts.x;
            if (opts.y !== undefined)
                this.y = opts.y;
            if (opts.pivotX !== undefined)
                this.pivotX = opts.pivotX;
            if (opts.pivotY !== undefined)
                this.pivotY = opts.pivotY;
            if (opts.scale !== undefined)
                this.scale = opts.scale;
            if (opts.scaleX !== undefined)
                this.scaleX = opts.scaleX;
            if (opts.scaleY !== undefined)
                this.scaleY = opts.scaleY;
            if (opts.rotation !== undefined)
                this.rotation = opts.rotation;
            if (opts.alpha !== undefined)
                this.alpha = opts.alpha;
            if (opts.drawOrder !== undefined)
                this.drawOrder = opts.drawOrder;
            if (opts.yBasedDrawOrder !== undefined)
                this.yBasedDrawOrder = opts.yBasedDrawOrder;
            if (opts.collider !== undefined)
                this.collider = opts.collider;
            if (opts.isStatic !== undefined)
                this.isStatic = opts.isStatic;
            if (opts.isSensor !== undefined)
                this.isSensor = opts.isSensor;
            if (opts.velocityX !== undefined)
                this.velocityX = opts.velocityX;
            if (opts.velocityY !== undefined)
                this.velocityY = opts.velocityY;
            if (opts.fixedRotation !== undefined)
                this.fixedRotation = opts.fixedRotation;
            if (opts.layer !== undefined)
                this.layer = opts.layer;
            if (opts.image !== undefined)
                this.image = opts.image;
        }
    }
    get x() { return this._lt.x.v; }
    set x(v) { this._lt.x.v = v; }
    get y() { return this._lt.y.v; }
    set y(v) { this._lt.y.v = v; }
    get pivotX() { return this._lt.pivotX.v; }
    set pivotX(v) { this._lt.pivotX.v = v; }
    get pivotY() { return this._lt.pivotY.v; }
    set pivotY(v) { this._lt.pivotY.v = v; }
    get scale() { return this._lt.scaleX.v; }
    set scale(v) { this._lt.scaleX.v = v; this._lt.scaleY.v = v; }
    get scaleX() { return this._lt.scaleX.v; }
    set scaleX(v) { this._lt.scaleX.v = v; }
    get scaleY() { return this._lt.scaleY.v; }
    set scaleY(v) { this._lt.scaleY.v = v; }
    get rotation() { return this._lt.rotation.v; }
    set rotation(v) { this._lt.rotation.v = v; }
    get alpha() { return this._lt.alpha.v; }
    set alpha(v) { this._lt.alpha.v = v; }
    get drawOrder() { return this._rendering.drawOrder; }
    set drawOrder(v) { this._rendering.drawOrder = v; }
    get yBasedDrawOrder() { return this._rendering.yBasedDrawOrder; }
    set yBasedDrawOrder(v) { this._rendering.yBasedDrawOrder = v; }
    get collider() { return this.#physics.collider; }
    set collider(v) { this.#physics.collider = v; }
    get isStatic() { return this.#physics.isStatic; }
    set isStatic(v) { this.#physics.isStatic = v; }
    get isSensor() { return this.#physics.isSensor; }
    set isSensor(v) { this.#physics.isSensor = v; }
    get velocityX() { return this.#physics.velocityX; }
    set velocityX(v) { this.#physics.velocityX = v; }
    get velocityY() { return this.#physics.velocityY; }
    set velocityY(v) { this.#physics.velocityY = v; }
    get fixedRotation() { return this.#physics.fixedRotation; }
    set fixedRotation(v) { this.#physics.fixedRotation = v; }
    _addPixiChild(child) { this._rendering._container.addChild(child); }
    #layer;
    get layer() { return this.#layer; }
    set layer(value) {
        this.#layer = value;
        if (value) {
            this.#world?._addToLayer(this, value);
        }
        else {
            this.#parent?._rendering.addChild(this._rendering);
        }
    }
    #image;
    get image() { return this.#image; }
    set image(value) {
        if (value) {
            if (!textureLoader.checkLoaded(value)) {
                console.info(`Image not preloaded. Loading now: ${value}`);
            }
            textureLoader.load(value).then((texture) => {
                if (texture)
                    this._addPixiChild(new Sprite({
                        texture,
                        anchor: { x: 0.5, y: 0.5 },
                        zIndex: -999999,
                    }));
            });
        }
    }
}
//# sourceMappingURL=game-object.js.map