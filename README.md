# Kiwi Engine

**Kiwi Engine** is a **TypeScript-based 2D web game engine**.

* **Center-origin coordinates**: `(0, 0)` is always the **center of the canvas** (not the top-left).
* **Responsive canvas**: the canvas **matches its parent element’s size** and resizes when the parent changes (e.g., `body` → full-window games).
* Built for **time-based updates**, mobile/desktop input, and both **Canvas** and **DOM-based** rendering nodes.

---

## Coordinate System

Most 2D engines use `(0, 0)` at the top-left. Kiwi flips that: the center of the canvas is `(0, 0)`.
This makes layout and UI easier on the web’s fluid screens.

* Top-left is `(-width/2, -height/2)`, bottom-right is `(width/2, height/2)`.
* Use `Renderer.screenToWorld(x, y)` to convert browser (screen) coordinates to **world** coordinates.

---

## Canvas Size

The canvas always **matches its parent element**. If the parent resizes, the canvas follows.
If the parent is `document.body` and the body fills the window, the canvas will also fill the window and resize on window changes.

---

## API

### Ticker (Game Loop)

`Ticker` is a **`requestAnimationFrame`-based loop manager**. It calls your `onTick(dt)` each frame so you can do **time-based updates**.

```ts
import { Ticker } from 'kiwiengine'

// dt = seconds since the previous tick (≈ 0.0167 at 60 FPS)
const speed = 120
const ticker = new Ticker((dt) => {
  player.x += speed * dt
})

// When done, clean up:
ticker.remove()
```

#### Constructor

```ts
new Ticker(onTick: (dt: number) => void)
```

* `dt` is in **seconds** and is valid even on the first frame.
* Called **once or more per frame** depending on internal catch-up behavior (see below).

#### Fixed Step & FPS Cap (Debug-only)

When **`debugMode`** is enabled and the browser tab is **unfocused or inactive**:

* The loop is **capped at 6 FPS** to save CPU/GPU.
* The loop switches to a **fixed step**:

  * Step size: `1 / fpsCap` (default: `1/6 ≈ 0.1667s`).
  * If accumulated lag exceeds one step, `onTick()` runs once with the **fixed step**.
  * If lag is **≥ 2×** the step, an **extra** `onTick()` runs with the **accumulated dt** to catch up.
* When the tab regains focus, the cap is lifted and the loop returns to normal rAF.
* On **`pageshow`** (e.g., returning from bfcache), the cap/lag state is reset and the normal loop resumes.

> `fpsCap` is internal; you don’t set it. It only activates in **debug mode** when the page is **not focused**.

#### Lifecycle

```ts
Ticker#remove(): void
```

* Stops the loop and removes focus/blur/page listeners.
* `Renderer.remove()` will also remove its internal `Ticker`.

#### Tips

* **Prefer time-based updates** (multiply by `dt`) for physics/movement/animation:

  ```ts
  velocity.y += GRAVITY * dt
  position.x += velocity.x * dt
  ```
* **Avoid double loops**: if your `Renderer` is already driving a frame loop, use its **update hooks** (e.g., `GameObject.update`) instead of starting another `Ticker`.
* **Always clean up**: call `remove()` on scene changes or unmount to prevent leaks.

---

## Renderer

`Renderer` manages **drawing**, **camera**, **layers**, **resizing**, and its **render loop** (internally powered by `Ticker`).

```ts
import { Renderer } from 'kiwiengine'

const renderer = new Renderer(document.body, {
  layers: [
    { name: 'background', drawOrder: 0 },
    { name: 'game',       drawOrder: 1 },
    { name: 'ui',         drawOrder: 2 },
  ],
  logicalWidth:  1920,
  logicalHeight: 1080,
  backgroundColor: 0x000000,
})
```

### Key Features

* **Layer system**: Define named layers with draw order; each `GameObject` chooses its `layer`.
* **Auto-resize**: Canvas follows parent size; transforms stay center-origin.
* **Camera**: Pan and zoom via `Renderer.camera`.
* **FPS display (debug)**: Shown when `debugMode` is on.
* **Screen → World conversion**: `screenToWorld(x, y)` converts `clientX/Y` into world space.
* **Loop management**: Uses `Ticker`; in debug mode, inherits the **6 FPS cap** on unfocused tabs.

### Options (`RendererOptions`)

```ts
type RendererOptions = {
  logicalWidth?: number
  logicalHeight?: number
  backgroundColor?: ColorSource
  layers?: { name: string; drawOrder: number }[]
}
```

* `logicalWidth/Height`: Set a **logical resolution**; the renderer scales proportionally to the screen.

### Methods

#### `screenToWorld(x: number, y: number): { x: number, y: number }`

```ts
const worldPos = renderer.screenToWorld(event.clientX, event.clientY)
```

#### `remove(): void`

Tears down the renderer, its **Ticker**, canvas, FPS overlay, and DOM bindings.

---

## GameObject

`GameObject` is the basic renderable node with **position/rotation/scale**, optional **children**, and **layer**.

```ts
import { GameObject } from 'kiwiengine'

const player = new GameObject({
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
  layer: 'game',
  useYSort: true, // draw in front if y is larger
  alpha: 1,
})

root.add(player)
```

### `GameObjectOptions`

* `x`, `y`: local position.
* `scale`, `scaleX`, `scaleY`: scaling.
* `pivotX`, `pivotY`: pivot for rotation/scale.
* `rotation`: radians.
* `alpha`: 0–1.
* `layer`: target layer name.
* `useYSort`: if `true`, container `drawOrder` follows current `y`.

### Children & Control

```ts
const parent = new GameObject({ x: -100, y: 0, layer: 'game' })
const child  = new GameObject({ x: 50, y: 0 })

parent.add(child) // parent transforms propagate
root.add(parent)

// Lifecycle helpers:
parent.pause()
parent.resume()
parent.remove()   // removes self and all descendants
```

### Y-Sorting Example

```ts
const a = new GameObject({ y: -50, useYSort: true })
const b = new GameObject({ y:  30, useYSort: true })
// If both share the same parent, b renders in front of a.
```

---

## Assets

### `preload(assets, progressCallback?) => () => void`

Preload textures/audio/fonts/spritesheets. Returns a **release** function to clear the cache.

```ts
import { preload } from 'kiwiengine'

const release = await preload(
  [
    'assets/player.png',
    { src: 'assets/atlas.png', atlas: atlasJson },
    { fnt: 'myFont', src: 'assets/myFont.fnt' },
    'assets/bgm.mp3',
  ],
  (p) => console.log(`loading: ${(p * 100) | 0}%`)
)

// later, when no longer needed:
release()
```

### `musicPlayer` (BGM)

Simple background-music player. Volume is persisted in `localStorage`.

```ts
import { musicPlayer } from 'kiwiengine'

musicPlayer.volume = 0.5     // 0..1
musicPlayer.play('bgm.mp3')  // reusing same src won’t duplicate
musicPlayer.pause()
musicPlayer.stop()
```

### `sfxPlayer` (SFX)

One-shot, lightweight effect playback. Volume persisted in `localStorage`.

```ts
import { sfxPlayer } from 'kiwiengine'

sfxPlayer.volume = 0.8
sfxPlayer.play('click.wav')
sfxPlayer.playRandom('hit1.ogg', 'hit2.ogg', 'hit3.ogg')
```

---

## Collision

### Collider Types

```ts
import {
  ColliderType,
  type RectangleCollider, type CircleCollider,
  type EllipseCollider,   type PolygonCollider,
  type Collider
} from 'kiwiengine'
```

* `RectangleCollider`: `{ type: Rectangle, width, height, x?, y? }`
* `CircleCollider`: `{ type: Circle, radius, x?, y? }`
* `EllipseCollider`: `{ type: Ellipse, width, height, x?, y? }`
* `PolygonCollider`: `{ type: Polygon, vertices: {x,y}[], x?, y? }`

### `checkCollision(ca, ta, cb, tb): boolean`

Generic collision test between rectangles/circles/ellipses/polygons.
`ta/tb` are the **world transforms** (position/rotation/scale) for each collider.

```ts
import { checkCollision } from 'kiwiengine'

const hit = checkCollision(colA, worldTransformA, colB, worldTransformB)
```

---

## Built-in Nodes & Extensions

### `AnimatedSpriteNode`

Spritesheet animation.

```ts
import { AnimatedSpriteNode } from 'kiwiengine'

const run = new AnimatedSpriteNode({
  src: 'atlas.png',
  atlas: atlasJson,
  animation: 'run',
  fps: 12,
  loop: true,
  x: 0, y: 0, layer: 'game',
})
run.on('animationend', (name) => console.log(name, 'ended'))
```

### `BitmapTextNode`

Bitmap-font text.

```ts
import { BitmapTextNode } from 'kiwiengine'

const txt = new BitmapTextNode({
  fnt: 'myFont',
  src: 'myFont.fnt',
  text: 'HELLO',
  layer: 'ui',
})
txt.changeFont('myFont2', 'myFont2.fnt')
```

### `CircleNode` / `RectangleNode`

Primitive shapes.

```ts
new CircleNode({ radius: 40, fill: 0xffffff, layer:'game' })
new RectangleNode({ width: 200, height: 80, stroke: { color: 0x00ff00, width: 2 } })
```

### `SpriteNode`

Single-texture sprite.

```ts
import { SpriteNode } from 'kiwiengine'
const logo = new SpriteNode({ src: 'logo.png', layer: 'ui' })
```

### `SpineNode`

[Spine](http://esotericsoftware.com/) animation support with `animationend` event.

```ts
import { SpineNode } from 'kiwiengine'

const spine = new SpineNode({
  atlas: 'spine.atlas',
  texture: { 'page0': 'spine_page0.png' }, // single or multi textures
  json: 'spine.json',                       // or skel/rawSkeletonData
  skins: ['base', 'hat'],
  animation: 'idle',
  loop: true,
})
spine.on('animationend', (a) => console.log(a, 'done'))
```

### `ParticleSystem`

Simple particle **burst**.

```ts
import { ParticleSystem } from 'kiwiengine'

const ps = new ParticleSystem({
  texture: 'spark.png',
  count: { min: 12, max: 20 },
  lifespan: { min: 0.4, max: 0.8 },
  angle: { min: 0, max: Math.PI * 2 },
  velocity: { min: 200, max: 400 },
  particleScale: { min: 0.5, max: 1.2 },
  startAlpha: 1,
  fadeRate: -1.5,
  orientToVelocity: true,
})

await ps.burst({ x: 0, y: 0 })
```

### `DelayNode`

Runs a callback after a delay, then removes itself from its parent.

```ts
import { DelayNode } from 'kiwiengine'

const delayNode = new DelayNode(2, () => {
  console.log('2 seconds have passed.')
})
parent.add(delayNode)
```

### `IntervalNode`

Game-loop-based `setInterval`-like callback.

```ts
import { IntervalNode } from 'kiwiengine'

const repeater = new IntervalNode(1, () => console.log('every 1 second'))
```

### `DomContainerNode`

Attach a DOM element that follows the **game coordinate system** (position, rotation, scale).

```ts
import { DomContainerNode } from 'kiwiengine'

const el = document.createElement('div')
const dom = new DomContainerNode(el, { x: 0, y: 0, layer: 'ui' })
```

---

## Physics

### `PhysicsWorld({ gravity? })`

A world that simulates gravity and collisions for **`PhysicsObject`** children.

```ts
import { PhysicsWorld } from 'kiwiengine'

const world = new PhysicsWorld({ gravity: 1000 })
world.gravity = 800
```

### `PhysicsObject(options)`

Creates a physics body from a **collider** and keeps its render transform in sync.

```ts
import { PhysicsObject, ColliderType } from 'kiwiengine'

const ball = new PhysicsObject({
  collider: { type: ColliderType.Circle, radius: 20 },
  x: 0, y: 200, velocityY: -600, useYSort: true,
})

ball.x += 10           // properties stay in sync
ball.isStatic = false
ball.disableCollisions() // remove from world (rendering stays)
```

---

## DOM Nodes (CSS Rendering)

DOM-rendered alternatives for UI/overlays.

### `DomSpriteNode`

Render an image with the DOM.

```ts
import { DomSpriteNode } from 'kiwiengine'
new DomSpriteNode({ src: 'ui/button.png', layer: 'ui' })
```

### `DomAnimatedSpriteNode`

Spritesheet animation with DOM.

```ts
import { DomAnimatedSpriteNode } from 'kiwiengine'

const anim = new DomAnimatedSpriteNode({
  src: 'atlas.png', atlas: atlasJson,
  animation: 'blink', fps: 8, loop: true,
})
anim.on('animationend', () => {})
```

### `DomParticleSystem`

CSS-driven lightweight particles (API mirrors `ParticleSystem`).

```ts
import { DomParticleSystem } from 'kiwiengine'

const dps = new DomParticleSystem({ /* similar to ParticleSystem */ })
await dps.burst({ x: 300, y: 100 })
```

### `domPreload(assets, progressCallback?)`

Preload **DOM** assets (images/fonts).

```ts
import { domPreload } from 'kiwiengine'

const releaseDom = await domPreload(['ui/button.png', 'Pretendard'])
releaseDom()
```

---

## Input

### `Joystick`

Unified **vector input** from mobile touch joystick **and** keyboard arrow keys.

```ts
import { Joystick } from 'kiwiengine'

const joy = new Joystick({
  onMove: (angleRad, strength) => {
    // angle in radians, strength in [0..1]
  },
  onRelease: () => {},
  // Optional touch skin
  joystickImage: document.getElementById('joy') as HTMLDivElement,
  knobImage: document.getElementById('knob') as HTMLDivElement,
  maxKnobDistance: 80,
  moveThreshold: 6,
})

// After layout changes, update idle position:
joy.setIdlePosition({ left: -999999, top: -999999 })
```

---

## Utils

### `isMobile: boolean`

Simple UA-based mobile detection.

```ts
import { isMobile } from 'kiwiengine'
if (isMobile) {
  // mobile-only logic
}
```

### `setStyle(el, styles)`

DOM style helper.

```ts
import { setStyle } from 'kiwiengine'
setStyle(div, { opacity: '0.8', pointerEvents: 'none' })
```

### `textStroke(target, width, color)`

Apply text outline using multiple `text-shadow`s.

```ts
import { textStroke } from 'kiwiengine'
textStroke(h1, 2, '#000')
```

---

## Debug

### `debugMode` / `enableDebug()`

Toggle debug features (e.g., **6 FPS fixed-step cap** in unfocused tabs for both `Ticker` and `Renderer`).

```ts
import { enableDebug, debugMode } from 'kiwiengine'

enableDebug()
console.log(debugMode) // true
```

---

## License

MIT

## Author

Jason
