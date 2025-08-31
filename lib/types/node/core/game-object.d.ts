import { EventMap } from '@webtaku/event-emitter';
import { DisplayNode, DisplayNodeOptions } from "./display-node";
export type GameObjectOptions = {} & DisplayNodeOptions;
export declare class GameObject<E extends EventMap> extends DisplayNode<E> {
    constructor(options?: GameObjectOptions);
}
//# sourceMappingURL=game-object.d.ts.map