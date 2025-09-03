import { enableDebug, preload, Renderer } from '../../src'
import heroAtlas from './assets/spritesheets/hero-atlas.json'
import orcAtlas from './assets/spritesheets/orc-atlas.json'
import potionAtlas from './assets/spritesheets/potion-atlas.json'
import { Stage } from './stage'

if (process.env.NODE_ENV === 'development') {
  enableDebug()
}

await preload([
  { src: 'assets/spritesheets/hero.png', atlas: heroAtlas },
  { src: 'assets/spritesheets/orc.png', atlas: orcAtlas },
  { src: 'assets/spritesheets/potion.png', atlas: potionAtlas },
])

const renderer = new Renderer(document.body, {
  backgroundColor: '#304C79',
  layers: [
    { name: 'hud', drawOrder: 1 }
  ],
})

renderer.add(new Stage())
