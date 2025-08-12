import { EventEmitter } from '@webtaku/event-emitter';
import Matter from 'matter-js';
export class WorldPhysics extends EventEmitter {
    #engine;
    #gravity = 0;
    get gravity() { return this.#gravity; }
    set gravity(v) {
        this.#gravity = v;
        if (this.#engine)
            this.#engine.gravity.y = v;
    }
    #createEngine() {
        this.#engine = Matter.Engine.create();
        this.#engine.gravity.y = this.#gravity;
        Matter.Events.on(this.#engine, 'collisionStart', (event) => {
            event.pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;
                this.emit('collisionStart', bodyA.plugin.owner, bodyB.plugin.owner);
            });
        });
        this.emit('engineCreated', this.#engine);
    }
    addBody(body) {
        if (!this.#engine)
            this.#createEngine();
        Matter.World.add(this.#engine.world, body);
    }
    removeBody(body) {
        if (!this.#engine)
            return;
        Matter.World.remove(this.#engine.world, body);
    }
    update(dt) {
        if (!this.#engine)
            return;
        const matterDt = dt * 1000;
        Matter.Engine.update(this.#engine, matterDt > 16.666 ? 16.666 : matterDt);
    }
    destroy() {
        if (this.#engine)
            Matter.Engine.clear(this.#engine);
        this.#engine = undefined;
    }
}
//# sourceMappingURL=world-physics.js.map