import { enableDebug, Renderer } from '../../src'
import { Stage } from './stage'

enableDebug()

const renderer = new Renderer(document.body, {
  backgroundColor: '#304C79'
})

renderer.add(new Stage())
