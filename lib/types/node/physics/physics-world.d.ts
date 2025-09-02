import { EventMap } from '@webtaku/event-emitter';
import Matter from 'matter-js';
import { Container as PixiContainer } from 'pixi.js';
import { RenderableNode } from '../core/renderable';
export type PhysicsWorldOptions = {
    gravity?: number;
};
export declare class PhysicsWorld<E extends EventMap = EventMap> extends RenderableNode<PixiContainer, E> {
    #private;
    constructor(options?: PhysicsWorldOptions);
    set gravity(v: number);
    get gravity(): number;
    addBody(body: Matter.Body): void;
    removeBody(body: Matter.Body): void;
    protected update(dt: number): void;
    remove(): void;
}
//# sourceMappingURL=physics-world.d.ts.map