import { GameObject, GameObjectOptions } from '../core/game-object';
export type SpriteNodeOptions = {
    src: string;
} & GameObjectOptions;
export declare class SpriteNode extends GameObject {
    #private;
    constructor(options: SpriteNodeOptions);
}
//# sourceMappingURL=sprite.d.ts.map