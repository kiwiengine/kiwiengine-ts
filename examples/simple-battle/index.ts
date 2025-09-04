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
  { fnt: 'assets/bitmap-fonts/white-peaberry.fnt', src: 'assets/bitmap-fonts/white-peaberry.png' },
  'assets/bgm/battle.mp3',
  'assets/sfx/hero/hit/hit1.wav',
  'assets/sfx/hero/hit/hit2.wav',
  'assets/sfx/hero/hit/hit3.wav',
  'assets/sfx/hero/miss/miss1.wav',
  'assets/sfx/hero/miss/miss2.wav',
  'assets/sfx/hero/miss/miss3.wav',
  'assets/sfx/hero/heal/heal.wav',
  'assets/sfx/hero/die/die.wav',
  'assets/sfx/orc/hit/hit1.wav',
  'assets/sfx/orc/hit/hit2.wav',
  'assets/sfx/orc/hit/hit3.wav',
  'assets/sfx/orc/miss/miss1.wav',
  'assets/sfx/orc/miss/miss2.wav',
  'assets/sfx/orc/miss/miss3.wav',
  'assets/sfx/orc/die/die.wav',
])

const renderer = new Renderer(document.body, {
  backgroundColor: '#304C79',
  layers: [
    { name: 'hud', drawOrder: 1 }
  ],
})

renderer.add(new Stage())
