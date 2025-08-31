import { GameNode } from '../node/core/game-node'
import { Layer } from './layer'

export type RendererOptions = {
  layers?: { name: string; drawOrder: number }[]
}

export class Renderer {
  #layers: { [name: string]: Layer } = {};

  constructor(public target: HTMLElement, options?: RendererOptions) {
    if (options?.layers) {
      for (const layer of options.layers) {
        this.#layers[layer.name] = new Layer(layer.drawOrder)
      }
    }
  }

  _addToLayer(node: GameNode, layerName: string) {
    const layer = this.#layers[layerName]
    if (!layer) throw new Error(`Layer ${layerName} does not exist.`)
    layer.add(node)
  }
}
