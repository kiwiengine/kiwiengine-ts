import Matter from 'matter-js';

export class WorldPhysics {
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
}
