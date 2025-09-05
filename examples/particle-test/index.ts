import { enableDebug, ParticleSystem, preload, Renderer } from '../../src'

enableDebug()

await preload(['assets/bird.png'])

const renderer = new Renderer(document.body, {
  logicalWidth: 800,
  logicalHeight: 600,
  backgroundColor: '#304C79'
})

const ps = new ParticleSystem({
  texture: 'assets/bird.png',
  count: { min: 5, max: 10 },
  lifespan: { min: 0.5, max: 1.5 },
  angle: { min: 0, max: 2 * Math.PI },
  velocity: { min: 50, max: 100 },
  particleScale: { min: 0.5, max: 1 },
  fadeRate: -1,
  orientToVelocity: true,
  startAlpha: 1,
  blendMode: 'screen',
})
renderer.add(ps)

window.addEventListener('click', (e) => {
  ps.burst({ x: e.clientX, y: e.clientY })
})
