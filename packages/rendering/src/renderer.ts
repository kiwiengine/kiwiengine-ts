import { autoDetectRenderer, Container, DOMAdapter, ICanvas, WebWorkerAdapter } from 'pixi.js'

export type CreateRendererParameters = {
  canvas: ICanvas
}

export type Renderer = {
  root: Container
  render: () => void
}

export async function createRenderer(parameters: CreateRendererParameters): Promise<Renderer> {
  const root = new Container()
  const pixiRenderer = await autoDetectRenderer({
    canvas: parameters.canvas,
  })

  return {
    root,
    render: () => { pixiRenderer.render(root) }
  }
}

export async function createWebWorkerRenderer(parameters: CreateRendererParameters): Promise<Renderer> {
  DOMAdapter.set(WebWorkerAdapter)
  return await createRenderer(parameters)
}
