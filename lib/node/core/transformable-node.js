import { DirtyNumber } from './dirty-number';
import { GameNode } from './game-node';
import { GlobalTransform, LocalTransform } from './transform';
export class TransformableNode extends GameNode {
    localTransform = new LocalTransform();
    globalTransform = new GlobalTransform();
    globalAlpha = new DirtyNumber(1);
}
//# sourceMappingURL=transformable-node.js.map