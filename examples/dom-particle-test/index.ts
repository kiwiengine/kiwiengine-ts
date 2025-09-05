import { DomParticleSystem, domPreload, enableDebug, Ticker } from '../../src'

enableDebug()

await domPreload(['assets/bird.png'])

const ps = new DomParticleSystem({
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
ps.attachTo(document.body)

new Ticker(dt => ps.render(dt))

window.addEventListener('click', (e) => {
  ps.burst({ x: e.clientX, y: e.clientY })
})
