import Stats from 'stats.js';
import { debugMode } from '../utils/debug';

export class WorldDebug {
  #container: HTMLElement;
  #stats?: Stats;

  constructor(container: HTMLElement) {
    this.#container = container;
    if (debugMode) {
      const stats = new Stats();
      stats.dom.style.position = 'absolute';
      stats.showPanel(0);
      container.appendChild(stats.dom);
      this.#stats = stats;
    }
  }
}
