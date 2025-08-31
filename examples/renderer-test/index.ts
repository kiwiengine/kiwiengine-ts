import { enableDebug, Renderer } from '../../src'

enableDebug()

new Renderer(document.body, {
  logicalWidth: 800,
  logicalHeight: 600,
  backgroundColor: '#304C79'
})
