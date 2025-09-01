import { EventMap } from '@webtaku/event-emitter';
import { Container } from 'pixi.js';
import { DisplayNode, DisplayNodeOptions } from "./display-node";
export type GameObjectOptions = {} & DisplayNodeOptions;
export declare class GameObject<E extends EventMap = EventMap> extends DisplayNode<Container, E> {
    constructor(x: number, y: number, options?: GameObjectOptions);
}
//# sourceMappingURL=game-object.d.ts.map