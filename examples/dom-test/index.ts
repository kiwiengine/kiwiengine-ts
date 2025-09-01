import { DomContainerNode, enableDebug, Renderer } from '../../src'

enableDebug()

const renderer = new Renderer(document.body, {
  logicalWidth: 800,
  logicalHeight: 600,
  backgroundColor: '#304C79'
})

const el = document.createElement('div')
el.textContent = 'Hello World'
el.style.color = 'red'
el.onclick = () => alert('click')

const node = new DomContainerNode(el)
node.alpha = 0.5
renderer.add(node)

renderer.on('update', (dt) => {
  node.rotation += dt
})
