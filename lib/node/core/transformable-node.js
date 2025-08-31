import { GameNode } from './game-node';
import { DirtyNumber } from './dirty-number';
import { GlobalTransform } from './transform';
export class TransformableNode extends GameNode {
    globalTransform = new GlobalTransform();
    globalAlpha = new DirtyNumber(1);
}
//# sourceMappingURL=transformable-node.js.map