import { Layer } from './layer'

export type RendererOptions = {
  layers?: { name: string; drawOrder: number }[]
}

export class Renderer {
  #layers: { [name: string]: Layer } = {};

  constructor(public target: HTMLElement, options?: RendererOptions) { }
}
