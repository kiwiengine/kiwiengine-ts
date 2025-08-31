import Stats from 'stats.js';
export class FpsDisplay {
    #stats;
    constructor(container) {
        const stats = new Stats();
        stats.dom.style.position = 'absolute';
        stats.showPanel(0);
        container.appendChild(stats.dom);
        this.#stats = stats;
    }
    update() {
        this.#stats.update();
    }
    remove() {
        this.#stats.dom.remove();
    }
}
//# sourceMappingURL=fps-display.js.map