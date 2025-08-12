import { AnimatedSpriteObject } from '../game-object-ext/animated-sprite';
import { DomContainerObject } from '../game-object-ext/dom-container';
import { RectangleObject } from '../game-object-ext/rect';
import { SpineObject } from '../game-object-ext/spine';
import { SpriteObject } from '../game-object-ext/sprite';
import { TextObject } from '../game-object-ext/text';
import { TilingSpriteObject } from '../game-object-ext/tiling-sprite';
import { GameObject } from '../game-object/game-object';
declare const GameObjectClassMap: {
    readonly go: typeof GameObject;
    readonly sprite: typeof SpriteObject;
    readonly 'animated-sprite': typeof AnimatedSpriteObject;
    readonly 'tiling-sprite': typeof TilingSpriteObject;
    readonly spine: typeof SpineObject;
    readonly dom: typeof DomContainerObject;
    readonly text: typeof TextObject;
    readonly rect: typeof RectangleObject;
};
type GameObjectNameMap = {
    [K in keyof typeof GameObjectClassMap]: InstanceType<(typeof GameObjectClassMap)[K]>;
};
type Name = '' | keyof GameObjectNameMap;
type GameObjectByName<T extends Name> = (T extends '' ? GameObject : (T extends keyof GameObjectNameMap ? GameObjectNameMap[T] : GameObject));
declare function go<T extends Name>(name?: T, ...args: (GameObjectByName<T> | Partial<GameObjectByName<T>>)[]): GameObjectByName<T>;
export { go };
//# sourceMappingURL=go.d.ts.map