import { domPreload, DomSpriteNode, enableDebug, Ticker } from '../../src'

enableDebug()

await domPreload(['assets/bird.png'])

for (let i = 0; i < 100; i++) {
  const sprite = new DomSpriteNode({
    src: 'assets/bird.png',
    x: Math.random() * window.innerWidth - window.innerWidth / 2,
    y: Math.random() * window.innerHeight - window.innerHeight / 2
  })
  sprite.attachTo(document.body)
}

new Ticker(dt => {
})
