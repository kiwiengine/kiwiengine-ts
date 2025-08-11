import { Container } from 'pixi.js';
import { LocalTransform } from './transform';

export class GameObjectRendering {
  #container = new Container({ sortableChildren: true });
  #drawOrder = 0;
  #yBasedDrawOrder = false;

  addChild(child: GameObjectRendering) { this.#container.addChild(child.#container); }
  removeChild(child: GameObjectRendering) { this.#container.removeChild(child.#container); }
  destroy() { this.#container.destroy({ children: true }); }

  applyChanges(lt: LocalTransform) {
    if (lt.x.dirty) this.#container.x = lt.x.v;
    if (lt.y.dirty) this.#container.y = lt.y.v;
    if (lt.pivotX.dirty) this.#container.pivot.x = lt.pivotX.v;
    if (lt.pivotY.dirty) this.#container.pivot.y = lt.pivotY.v;
    if (lt.scaleX.dirty) this.#container.scale.x = lt.scaleX.v;
    if (lt.scaleY.dirty) this.#container.scale.y = lt.scaleY.v;
    if (lt.rotation.dirty) this.#container.rotation = lt.rotation.v;
    if (lt.alpha.dirty) this.#container.alpha = lt.alpha.v;
  }

  get drawOrder() { return this.#drawOrder; }
  set drawOrder(v: number) { this.#drawOrder = v; }
  get yBasedDrawOrder() { return this.#yBasedDrawOrder; }
  set yBasedDrawOrder(v: boolean) { this.#yBasedDrawOrder = v; }
}
