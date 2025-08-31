import { Layer } from './layer';
export class Renderer {
    container;
    #layers = {};
    _isContainerSizeDirty = false;
    canvasLeft = 0;
    canvasTop = 0;
    viewportScale = 1;
    centerX = 0;
    centerY = 0;
    constructor(container, options) {
        this.container = container;
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