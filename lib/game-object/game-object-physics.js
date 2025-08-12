import Matter from 'matter-js';
import { debugMode } from '../utils/debug';
import { localOffsetToWorld, worldToLocalWithNewWorld } from './transform';
export class GameObjectPhysics {
    #collider;
    #isStatic = false;
    #isSensor = false;
    #velocityX = 0;
    #velocityY = 0;
    #fixedRotation = false;
    #go;
    #matterBody;
    constructor(go) {
        this.#go = go;
    }
    #removeBody() {
        const world = this.#go._getWorld();
        if (!world || !this.#matterBody)
            return;
        world._worldPhysics.removeBody(this.#matterBody);
    }
    #lastScaleX = 1;
    #lastScaleY = 1;
    #initialInertia;
    #createBody() {
        const world = this.#go._getWorld();
        if (!this.#collider || !world)
            return;
        const wt = this.#go._wt;
        const { x: ox, y: oy } = localOffsetToWorld(wt, this.#collider?.x ?? 0, this.#collider?.y ?? 0);
        const x = wt.x.v + ox;
        const y = wt.y.v + oy;
        const bodyOpts = {
            angle: wt.rotation.v,
            isStatic: this.#isStatic,
            isSensor: this.#isSensor,
            velocity: { x: this.#velocityX, y: this.#velocityY },
        };
        if (this.#collider.type === 'rect')
            this.#matterBody = Matter.Bodies.rectangle(x, y, this.#collider.width, this.#collider.height, bodyOpts);
        else if (this.#collider.type === 'circle')
            this.#matterBody = Matter.Bodies.circle(x, y, this.#collider.radius, bodyOpts);
        else if (this.#collider.type === 'vert')
            this.#matterBody = Matter.Bodies.fromVertices(x, y, [this.#collider.vertices], bodyOpts);
        else
            throw new Error('Invalid collider type');
        this.#matterBody.plugin.owner = this.#go;
        this.#lastScaleX = wt.scaleX.v;
        this.#lastScaleY = wt.scaleY.v;
        Matter.Body.scale(this.#matterBody, wt.scaleX.v, wt.scaleY.v);
        this.#initialInertia = this.#matterBody.inertia;
        if (this.#fixedRotation) {
            Matter.Body.setInertia(this.#matterBody, Infinity);
            Matter.Body.setAngularVelocity(this.#matterBody, 0);
        }
        world._worldPhysics.addBody(this.#matterBody);
        this.#setDebugRenderStyle();
    }
    applyChanges() {
        if (this.#collider && !this.#matterBody)
            this.#createBody();
        if (!this.#matterBody)
            return;
        const wt = this.#go._wt;
        const { x: ox, y: oy } = localOffsetToWorld(wt, this.#collider?.x ?? 0, this.#collider?.y ?? 0);
        if (wt.x.dirty || wt.scaleX.dirty || wt.y.dirty || wt.scaleY.dirty) {
            if ((wt.x.dirty || wt.scaleX.dirty) && (wt.y.dirty || wt.scaleY.dirty))
                Matter.Body.setPosition(this.#matterBody, { x: wt.x.v + ox, y: wt.y.v + oy });
            else if (wt.x.dirty || wt.scaleX.dirty)
                Matter.Body.setPosition(this.#matterBody, { x: wt.x.v + ox, y: this.#matterBody.position.y });
            else if (wt.y.dirty || wt.scaleY.dirty)
                Matter.Body.setPosition(this.#matterBody, { x: this.#matterBody.position.x, y: wt.y.v + oy });
        }
        if (wt.scaleX.dirty || wt.scaleY.dirty) {
            const scaleDiffX = wt.scaleX.v / this.#lastScaleX;
            const scaleDiffY = wt.scaleY.v / this.#lastScaleY;
            Matter.Body.scale(this.#matterBody, scaleDiffX, scaleDiffY);
            this.#lastScaleX = wt.scaleX.v;
            this.#lastScaleY = wt.scaleY.v;
        }
        if (wt.rotation.dirty)
            Matter.Body.setAngle(this.#matterBody, wt.rotation.v);
        const lt = this.#go._lt;
        if (!wt.x.dirty || !wt.y.dirty || !wt.rotation.dirty) {
            const { x, y, rotation, newWorldX, newWorldY, newWorldRotation } = worldToLocalWithNewWorld(wt, lt, this.#matterBody.position.x - ox, this.#matterBody.position.y - oy, this.#matterBody.angle);
            if (!wt.x.dirty) {
                lt.x.v = x;
                wt.x.v = newWorldX;
            }
            if (!wt.y.dirty) {
                lt.y.v = y;
                wt.y.v = newWorldY;
            }
            if (!wt.rotation.dirty) {
                lt.rotation.v = rotation;
                wt.rotation.v = newWorldRotation;
            }
        }
    }
    destroy() {
        this.#removeBody();
    }
    get collider() { return this.#collider; }
    set collider(value) {
        this.#removeBody();
        this.#collider = value;
    }
    get isStatic() {
        if (this.#matterBody)
            return this.#matterBody.isStatic;
        else
            return this.#isStatic;
    }
    set isStatic(value) {
        this.#isStatic = value;
        if (this.#matterBody)
            Matter.Body.setStatic(this.#matterBody, value);
        this.#setDebugRenderStyle();
    }
    get isSensor() {
        if (this.#matterBody)
            return this.#matterBody.isSensor;
        else
            return this.#isSensor;
    }
    set isSensor(value) {
        this.#isSensor = value;
        if (this.#matterBody)
            this.#matterBody.isSensor = value;
        this.#setDebugRenderStyle();
    }
    get velocityX() {
        if (this.#matterBody)
            return this.#matterBody.velocity.x;
        else
            return this.#velocityX;
    }
    set velocityX(value) {
        this.#velocityX = value;
        if (this.#matterBody)
            Matter.Body.setVelocity(this.#matterBody, { x: value, y: this.#velocityY });
    }
    get velocityY() {
        if (this.#matterBody)
            return this.#matterBody.velocity.y;
        else
            return this.#velocityY;
    }
    set velocityY(value) {
        this.#velocityY = value;
        if (this.#matterBody)
            Matter.Body.setVelocity(this.#matterBody, { x: this.#velocityX, y: value });
    }
    get fixedRotation() { return this.#fixedRotation; }
    set fixedRotation(value) {
        this.#fixedRotation = value;
        if (this.#matterBody) {
            if (value) {
                Matter.Body.setInertia(this.#matterBody, Infinity);
                Matter.Body.setAngularVelocity(this.#matterBody, 0);
            }
            else {
                Matter.Body.setInertia(this.#matterBody, this.#initialInertia);
                Matter.Body.setAngularVelocity(this.#matterBody, 0);
            }
        }
    }
    #setDebugRenderStyle() {
        if (!debugMode || !this.#matterBody)
            return;
        if (this.#isSensor) {
            this.#matterBody.render.fillStyle = 'rgba(255,255,0,0.1)';
            this.#matterBody.render.strokeStyle = 'rgba(255,255,0,0.25)';
            this.#matterBody.render.lineWidth = 1;
        }
        else if (this.#isStatic) {
            this.#matterBody.render.fillStyle = 'rgba(255,0,0,0.1)';
            this.#matterBody.render.strokeStyle = 'rgba(255,0,0,0.25)';
            this.#matterBody.render.lineWidth = 1;
        }
        else {
            this.#matterBody.render.fillStyle = 'rgba(0,255,0,0.1)';
            this.#matterBody.render.strokeStyle = 'rgba(0,255,0,0.25)';
            this.#matterBody.render.lineWidth = 1;
        }
    }
}
//# sourceMappingURL=game-object-physics.js.map