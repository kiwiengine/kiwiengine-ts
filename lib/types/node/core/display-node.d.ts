import { EventMap } from '@webtaku/event-emitter';
import { TransformableNode } from './transformable-node';
import { Container } from 'pixi.js';
export declare abstract class DisplayNode<E extends EventMap> extends TransformableNode<E> {
    #private;
    constructor(container: Container);
    remove(): void;
}
//# sourceMappingURL=display-node.d.ts.map