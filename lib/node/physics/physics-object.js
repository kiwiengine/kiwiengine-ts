import Matter from 'matter-js';
import { ColliderType } from '../../collision/colliders';
import { PixiContainerNode } from '../core/pixi-container-node';
import { LocalTransform } from '../core/transform';
import { isTransformableNode } from '../core/transformable-node';
import { PhysicsWorld } from './physics-world';
function createEllipseBody(x, y, width, height, options = {}, 
// segLen은 "인접 정점 사이의 목표 간격(px)" 정도로 생각하면 됩니다.
segLen = 6) {
    const rx = width / 2;
    const ry = height / 2;
    // 주변길이 ~ π(a+b) 근사 → 그 길이를 segLen 간격으로 쪼개서 정점 수 결정
    const perimeterApprox = Math.PI * (rx + ry);
    const segments = Math.max(12, Math.ceil(perimeterApprox / segLen));
    const verts = Array.from({ length: segments }, (_, i) => {
        const t = (i / segments) * Math.PI * 2;
        return { x: Math.cos(t) * rx, y: Math.sin(t) * ry };
    });
    // fromVertices는 로컬 기준이므로 x,y는 중심 위치로 넘깁니다.
    return Matter.Bodies.fromVertices(x, y, [verts], options);
}
export class PhysicsObject extends PixiContainerNode {
    #localTransform = new LocalTransform();
    #matterBody;
    constructor(options) {
        super();
        const x = options.x ?? 0;
        const y = options.y ?? 0;
        const r = options.rotation ?? 0;
        const c = options.collider;
        const bodyOptions = {
            angle: r,
        };
        if (c.type === ColliderType.Rectangle) {
            this.#matterBody = Matter.Bodies.rectangle(x, y, c.width, c.height, bodyOptions);
        }
        else if (c.type === ColliderType.Circle) {
            this.#matterBody = Matter.Bodies.circle(x, y, c.radius, bodyOptions);
        }
        else if (c.type === ColliderType.Ellipse) {
            this.#matterBody = createEllipseBody(x, y, c.width, c.height, bodyOptions, 
            /* segLen= */ 6 // 더 매끄럽게 하고 싶으면 더 작게
            );
        }
        else if (c.type === ColliderType.Polygon) {
            this.#matterBody = Matter.Bodies.fromVertices(x, y, [c.vertices], bodyOptions);
        }
        else {
            throw new Error('Invalid collider type');
        }
    }
    set parent(parent) {
        if (!(parent instanceof PhysicsWorld)) {
            const actual = parent === undefined
                ? 'undefined'
                : parent.constructor?.name ?? typeof parent;
            throw new Error(`PhysicsObject parent must be PhysicsWorld, but got ${actual}`);
        }
        super.parent = parent;
    }
    get parent() {
        return super.parent;
    }
    update(dt) {
        super.update(dt);
        const mb = this.#matterBody;
        const pc = this._pixiContainer;
        pc.position.set(mb.position.x, mb.position.y);
        pc.rotation = mb.angle;
        const lt = this.#localTransform;
        lt.x = mb.position.x;
        lt.y = mb.position.y;
        lt.rotation = mb.angle;
        const parent = this.parent;
        if (parent && isTransformableNode(parent)) {
            this.worldTransform.update(parent.worldTransform, lt);
        }
    }
    set x(v) { Matter.Body.setPosition(this.#matterBody, { x: v, y: this.#matterBody.position.y }); }
    get x() { return this.#matterBody.position.x; }
    set y(v) { Matter.Body.setPosition(this.#matterBody, { x: this.#matterBody.position.x, y: v }); }
    get y() { return this.#matterBody.position.y; }
    set rotation(v) { Matter.Body.setAngle(this.#matterBody, v); }
    get rotation() { return this.#matterBody.angle; }
}
//# sourceMappingURL=physics-object.js.map