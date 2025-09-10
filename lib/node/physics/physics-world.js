import Matter from 'matter-js';
import { Container as PixiContainer } from 'pixi.js';
import { RenderableNode } from '../core/renderable';
export class PhysicsWorld extends RenderableNode {
    #matterEngine = Matter.Engine.create();
    constructor(options) {
        super(new PixiContainer({ sortableChildren: true }));
        this.worldTransform.x.v = 0;
        this.worldTransform.y.v = 0;
        this.worldTransform.resetDirty();
        this.gravity = options?.gravity ?? 0;
    }
    set gravity(v) { this.#matterEngine.gravity.y = v; }
    get gravity() { return this.#matterEngine.gravity.y; }
    addBody(body) { Matter.World.add(this.#matterEngine.world, body); }
    removeBody(body) { Matter.World.remove(this.#matterEngine.world, body); }
    update(dt) {
        if (this.paused)
            return;
        super.update(dt);
        const matterDt = dt * 1000;
        Matter.Engine.update(this.#matterEngine, matterDt > 16.666 ? 16.666 : matterDt);
    }
    remove() {
        Matter.Engine.clear(this.#matterEngine);
        super.remove();
    }
}
//# sourceMappingURL=physics-world.js.map