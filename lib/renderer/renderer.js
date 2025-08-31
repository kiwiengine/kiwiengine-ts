import { Layer } from './layer';
export class Renderer {
    target;
    #layers = {};
    constructor(target, options) {
        this.target = target;
        if (options?.layers) {
            for (const layer of options.layers) {
                this.#layers[layer.name] = new Layer(layer.drawOrder);
            }
        }
    }
    _addToLayer(node, layerName) {
        const layer = this.#layers[layerName];
        if (!layer)
            throw new Error(`Layer ${layerName} does not exist.`);
        layer.add(node);
    }
}
//# sourceMappingURL=renderer.js.map