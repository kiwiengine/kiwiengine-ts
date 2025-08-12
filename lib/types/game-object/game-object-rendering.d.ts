import { Container } from 'pixi.js';
import { LocalTransform } from './transform';
export declare class GameObjectRendering {
    #private;
    _container: Container<import("pixi.js").ContainerChild>;
    addChild(child: GameObjectRendering): void;
    removeChild(child: GameObjectRendering): void;
    destroy(): void;
    applyChanges(lt: LocalTransform): void;
    get drawOrder(): number;
    set drawOrder(v: number);
    get yBasedDrawOrder(): boolean;
    set yBasedDrawOrder(v: boolean);
}
//# sourceMappingURL=game-object-rendering.d.ts.map