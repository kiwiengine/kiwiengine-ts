import { Container } from 'pixi.js';
import { DisplayNode } from "./display-node";
export class GameObject extends DisplayNode {
    constructor(x, y, options) {
        super(new Container({ sortableChildren: true }), options ?? {});
        this.localTransform.x.v = x;
        this.localTransform.y.v = y;
    }
}
//# sourceMappingURL=game-object.js.map