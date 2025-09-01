import { Container } from 'pixi.js';
import { DisplayNode } from "./display-node";
export class GameObject extends DisplayNode {
    constructor(options) {
        super(new Container({ sortableChildren: true }), options ?? {});
    }
}
//# sourceMappingURL=game-object.js.map