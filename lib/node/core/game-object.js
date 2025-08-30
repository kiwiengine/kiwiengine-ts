import { DisplayNode } from "./display-node";
import { Container } from 'pixi.js';
export class GameObject extends DisplayNode {
    constructor(opts) {
        super(new Container());
    }
}
//# sourceMappingURL=game-object.js.map