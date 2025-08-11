import { GameObject, GameObjectOptions } from "../game-object/game-object";

type DomContainerObjectOptions = {
  el: HTMLElement;
} & GameObjectOptions;

export class DomContainerObject extends GameObject {
  #el?: HTMLElement;

  constructor(opts?: DomContainerObjectOptions) {
    super(opts);
    if (opts) {
      //TODO
    }
  }
}
