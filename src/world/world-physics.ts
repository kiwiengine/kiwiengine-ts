import { EventEmitter } from '@webtaku/event-emitter';
import Matter from 'matter-js';
import { GameObject } from '../game-object/game-object';

export class WorldPhysics extends EventEmitter<{
  collisionStart: (a: GameObject, b: GameObject) => void;
}> {
  #engine?: Matter.Engine;
  #gravity = 0;

  get gravity() { return this.#gravity; }
  set gravity(v: number) {
    this.#gravity = v;
    if (this.#engine) this.#engine.gravity.y = v;
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
  }

  addBody(body: Matter.Body) {
    if (!this.#engine) this.#createEngine();
    Matter.World.add(this.#engine!.world, body);
  }

  removeBody(body: Matter.Body) {
    if (!this.#engine) return;
    Matter.World.remove(this.#engine!.world, body);
  }

  update(dt: number) {
    if (!this.#engine) return;
    const matterDt = dt * 1000;
    Matter.Engine.update(this.#engine, matterDt > 16.666 ? 16.666 : matterDt);
  }

  destroy() {
    if (this.#engine) Matter.Engine.clear(this.#engine);
    this.#engine = undefined;
  }
}
