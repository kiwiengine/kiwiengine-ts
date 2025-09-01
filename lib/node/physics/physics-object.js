import { GameObject } from '../core/game-object';
import { PhysicsWorld } from './physics-world';
export class PhysicsObject extends GameObject {
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
}
//# sourceMappingURL=physics-object.js.map