import { Container } from 'pixi.js';
import { GlobalTransform } from './transform';

export class GameObjectRendering {
  #container = new Container({ sortableChildren: true });
  #drawOrder = 0;
  #yBasedDrawOrder = false;

  addChild(child: GameObjectRendering) { this.#container.addChild(child.#container); }
  removeChild(child: GameObjectRendering) { this.#container.removeChild(child.#container); }
  destroy() { this.#container.destroy({ children: true }); }

  applyChanges(gt: GlobalTransform) { /* TODO */ }

  get drawOrder() { return this.#drawOrder; }
  set drawOrder(v: number) { this.#drawOrder = v; }
  get yBasedDrawOrder() { return this.#yBasedDrawOrder; }
  set yBasedDrawOrder(v: boolean) { this.#yBasedDrawOrder = v; }
}
