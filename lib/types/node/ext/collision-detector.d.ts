import { GameNode } from '../core/game-node';
import { Collidable } from '../../collision/collidable';
export declare class CollisionDetectorNode<A extends Collidable, B extends Collidable> extends GameNode<{
    collisionDetected: (a: A, b: B) => void;
}> {
}
//# sourceMappingURL=collision-detector.d.ts.map