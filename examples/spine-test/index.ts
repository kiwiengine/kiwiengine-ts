import { enableDebug, preload, Renderer, SpineNode } from '../../src'

enableDebug()

const renderer = new Renderer(document.body, {
  logicalWidth: 800,
  logicalHeight: 600,
  backgroundColor: '#304C79'
})

await preload([
  'assets/spine/spineboy.png',
  'assets/spine/spineboy.atlas',
  'assets/spine/spineboy.skel',
])

const spineboy = new SpineNode({
  atlas: 'assets/spine/spineboy.atlas',
  texture: 'assets/spine/spineboy.png',
  skel: 'assets/spine/spineboy.skel',
  animation: 'run',
})

spineboy.scale = 0.2
spineboy.on('animationend', (animation) => {
  if (animation === 'run') spineboy.animation = 'idle'
})

renderer.add(spineboy)
