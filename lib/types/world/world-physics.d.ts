import { EventEmitter } from '@webtaku/event-emitter';
import Matter from 'matter-js';
import { GameObject } from '../game-object/game-object';
export declare class WorldPhysics extends EventEmitter<{
    engineCreated: (engine: Matter.Engine) => void;
    collisionStart: (a: GameObject, b: GameObject) => void;
}> {
    #private;
    get gravity(): number;
    set gravity(v: number);
    addBody(body: Matter.Body): void;
    removeBody(body: Matter.Body): void;
    update(dt: number): void;
    destroy(): void;
}
//# sourceMappingURL=world-physics.d.ts.map