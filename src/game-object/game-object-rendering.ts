import { Container } from 'pixi.js';
import { LocalTransform } from './transform';

export class GameObjectRendering {
  _container = new Container({ sortableChildren: true });
  #yBasedDrawOrder = false;

  addChild(child: GameObjectRendering) { this._container.addChild(child._container); }
  removeChild(child: GameObjectRendering) { this._container.removeChild(child._container); }
  destroy() { this._container.destroy({ children: true }); }

  applyChanges(lt: LocalTransform) {
    if (lt.x.dirty) this._container.x = lt.x.v;
    if (lt.y.dirty) { this._container.y = lt.y.v; if (this.#yBasedDrawOrder) this.drawOrder = lt.y.v; }
    if (lt.pivotX.dirty) this._container.pivot.x = lt.pivotX.v;
    if (lt.pivotY.dirty) this._container.pivot.y = lt.pivotY.v;
    if (lt.scaleX.dirty) this._container.scale.x = lt.scaleX.v;
    if (lt.scaleY.dirty) this._container.scale.y = lt.scaleY.v;
    if (lt.rotation.dirty) this._container.rotation = lt.rotation.v;
    if (lt.alpha.dirty) this._container.alpha = lt.alpha.v;
  }

  get drawOrder() { return this._container.zIndex; }
  set drawOrder(v: number) { this._container.zIndex = v; }
  get yBasedDrawOrder() { return this.#yBasedDrawOrder; }
  set yBasedDrawOrder(v: boolean) { this.#yBasedDrawOrder = v; if (v) this.drawOrder = this._container.y; }
}
