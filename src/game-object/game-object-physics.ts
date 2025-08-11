import Matter, { IChamferableBodyDefinition } from 'matter-js';
import { GameObject } from './game-object';

type BaseCollider = { x?: number; y?: number; };
type RectangleCollider = BaseCollider & { type: 'rect'; width: number; height: number };
type CircleCollider = BaseCollider & { type: 'circle'; radius: number };
type VerticesCollider = BaseCollider & { type: 'vert'; vertices: { x: number; y: number }[] };
export type Collider = RectangleCollider | CircleCollider | VerticesCollider;

export class GameObjectPhysics {
  #collider?: Collider;
  #isStatic = false;
  #isSensor = false;
  #velocityX = 0;
  #velocityY = 0;
  #fixedRotation = false;

  #matterWorld?: Matter.World;
  #matterBody?: Matter.Body;

  setWorldFromParent(parent: GameObjectPhysics) {
    this.#matterWorld = parent.#matterWorld;
  }

  #removeBody() {
    if (!this.#matterWorld || !this.#matterBody) return;
    Matter.World.remove(this.#matterWorld, this.#matterBody);
  }

  #lastScaleX = 1;
  #lastScaleY = 1;
  #initialInertia?: number;

  #createBody(go: GameObject) {
    if (!this.#collider || !this.#matterWorld) return;

    const gt = go._gt;
    const bodyOpts: IChamferableBodyDefinition = {
      angle: gt.rotation.v,
      isStatic: this.#isStatic,
      isSensor: this.#isSensor,
      velocity: { x: this.#velocityX, y: this.#velocityY },
    };

    if (this.#collider.type === 'rect') this.#matterBody = Matter.Bodies.rectangle(0, 0, this.#collider.width, this.#collider.height, bodyOpts);
    else if (this.#collider.type === 'circle') this.#matterBody = Matter.Bodies.circle(0, 0, this.#collider.radius, bodyOpts);
    else if (this.#collider.type === 'vert') this.#matterBody = Matter.Bodies.fromVertices(0, 0, [this.#collider.vertices], bodyOpts);
    else throw new Error('Invalid collider type');

    this.#matterBody.plugin.owner = go;
    this.#lastScaleX = gt.scaleX.v;
    this.#lastScaleY = gt.scaleY.v;
    Matter.Body.scale(this.#matterBody, gt.scaleX.v, gt.scaleY.v);

    this.#initialInertia = this.#matterBody.inertia;
    if (this.#fixedRotation) {
      Matter.Body.setInertia(this.#matterBody, Infinity);
      Matter.Body.setAngularVelocity(this.#matterBody, 0);
    }

    Matter.World.add(this.#matterWorld, this.#matterBody);
    this.#setDebugRenderStyle();
  }

  applyChanges(go: GameObject) {
    if (this.#collider && !this.#matterBody) this.#createBody(go);
    if (!this.#matterBody) return;

    const gt = go._gt;
    if (gt.x.dirty && gt.y.dirty) Matter.Body.setPosition(this.#matterBody, { x: gt.x.v, y: gt.y.v });
    else if (gt.x.dirty) Matter.Body.setPosition(this.#matterBody, { x: gt.x.v, y: this.#matterBody.position.y });
    else if (gt.y.dirty) Matter.Body.setPosition(this.#matterBody, { x: this.#matterBody.position.x, y: gt.y.v });

    if (gt.scaleX.dirty || gt.scaleY.dirty) {
      const scaleDiffX = gt.scaleX.v / this.#lastScaleX;
      const scaleDiffY = gt.scaleY.v / this.#lastScaleY;
      Matter.Body.scale(this.#matterBody, scaleDiffX, scaleDiffY);
      this.#lastScaleX = gt.scaleX.v;
      this.#lastScaleY = gt.scaleY.v;
    }

    if (gt.rotation.dirty) Matter.Body.setAngle(this.#matterBody, gt.rotation.v);
  }

  destroy() {
    this.#removeBody();
  }

  get collider() { return this.#collider; }
  set collider(value: Collider | undefined) {
    this.#removeBody();
    this.#collider = value;
  }

  get isStatic() { return this.#isStatic; }
  set isStatic(value: boolean) {
    this.#isStatic = value;
    if (this.#matterBody) Matter.Body.setStatic(this.#matterBody, value);
    this.#setDebugRenderStyle();
  }

  get isSensor() { return this.#isSensor; }
  set isSensor(value: boolean) {
    this.#isSensor = value;
    if (this.#matterBody) this.#matterBody.isSensor = value;
    this.#setDebugRenderStyle();
  }

  get velocityX() { return this.#velocityX; }
  set velocityX(value: number) {
    this.#velocityX = value;
    if (this.#matterBody) Matter.Body.setVelocity(this.#matterBody, { x: value, y: this.#velocityY });
  }

  get velocityY() { return this.#velocityY; }
  set velocityY(value: number) {
    this.#velocityY = value;
    if (this.#matterBody) Matter.Body.setVelocity(this.#matterBody, { x: this.#velocityX, y: value });
  }

  get fixedRotation() { return this.#fixedRotation; }
  set fixedRotation(value: boolean) {
    this.#fixedRotation = value;
    if (this.#matterBody) {
      if (value) {
        Matter.Body.setInertia(this.#matterBody, Infinity);
        Matter.Body.setAngularVelocity(this.#matterBody, 0);
      } else {
        Matter.Body.setInertia(this.#matterBody, this.#initialInertia!);
        Matter.Body.setAngularVelocity(this.#matterBody, 0);
      }
    }
  }

  #setDebugRenderStyle() {
    if (!this.#matterBody) return;

    if (this.#isSensor) {
      this.#matterBody.render.fillStyle = 'rgba(255,255,0,0.1)';
      this.#matterBody.render.strokeStyle = 'rgba(255,255,0,0.25)';
      this.#matterBody.render.lineWidth = 1;
    }
    else if (this.#isStatic) {
      this.#matterBody.render.fillStyle = 'rgba(255,0,0,0.1)';
      this.#matterBody.render.strokeStyle = 'rgba(255,0,0,0.25)';
      this.#matterBody.render.lineWidth = 1;
    }
    else {
      this.#matterBody.render.fillStyle = 'rgba(0,255,0,0.1)';
      this.#matterBody.render.strokeStyle = 'rgba(0,255,0,0.25)';
      this.#matterBody.render.lineWidth = 1;
    }
  }
}
