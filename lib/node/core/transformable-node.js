import { GameNode } from './game-node';
import { GlobalTransform, LocalTransform } from './transform';
export class TransformableNode extends GameNode {
    localTransform = new LocalTransform();
    globalTransform = new GlobalTransform();
}
//# sourceMappingURL=transformable-node.js.map