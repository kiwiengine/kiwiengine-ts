import { AnimatedSpriteObject } from '../game-object-ext/animated-sprite';
import { DomContainerObject } from '../game-object-ext/dom-container';
import { RectangleObject } from '../game-object-ext/rect';
import { SpineObject } from '../game-object-ext/spine';
import { SpriteObject } from '../game-object-ext/sprite';
import { TextObject } from '../game-object-ext/text';
import { TilingSpriteObject } from '../game-object-ext/tiling-sprite';
import { GameObject } from '../game-object/game-object';
const GameObjectClassMap = {
    'go': GameObject,
    'sprite': SpriteObject,
    'animated-sprite': AnimatedSpriteObject,
    'tiling-sprite': TilingSpriteObject,
    'spine': SpineObject,
    'dom': DomContainerObject,
    'text': TextObject,
    'rect': RectangleObject,
};
function go(name = '', ...args) {
    const go = new GameObjectClassMap[(name || 'go')]();
    for (const arg of args) {
        if (arg instanceof GameObject)
            go.add(arg);
        else if (arg) {
            for (const key in arg) {
                go[key] = arg[key];
            }
        }
    }
    return go;
}
export { go };
//# sourceMappingURL=go.js.map