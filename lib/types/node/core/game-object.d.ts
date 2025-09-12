import { EventMap } from '@webtaku/event-emitter';
import { Container as PixiContainer } from 'pixi.js';
import { TransformableNode, TransformableNodeOptions } from './transformable';
export type GameObjectOptions = {} & TransformableNodeOptions;
export declare class GameObject<E extends EventMap = {}> extends TransformableNode<PixiContainer, E> {
    constructor(options?: GameObjectOptions);
}
//# sourceMappingURL=game-object.d.ts.map