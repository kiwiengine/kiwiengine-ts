# Kiwi Engine

Kiwi Engine is a TypeScript-based 2D web game engine.

## Features

### Coordinate System

Unlike most other 2D engines that use the top-left corner of the screen as `0, 0`, Kiwi Engine sets `0, 0` at the center of the screen. This is due to the nature of the web, where browser screens are often dynamic. By placing `0, 0` at the center, it becomes easier to organize objects and UI elements.

### Canvas Size

The size of the canvas is set to match the size of its parent element. If the parent element’s size changes, the canvas size changes accordingly. When the parent element is `body` and `body` matches the size of the window, the canvas will also match the window size, and it will resize automatically when the window size changes.

---

## API

### Delay Node

The `Delay` node executes a callback function after a specified amount of time has passed.

```typescript
const delayNode = new Delay(2, () => {
  console.log('2 seconds have passed.');
});
parent.add(delayNode);
```

* After execution, the `Delay` node automatically removes itself from its parent node.

---

### Renderer

The `Renderer` is responsible for managing rendering and drawing objects on the screen.

```typescript
const renderer = new Renderer(document.body, {
  layers: [
    { name: 'background', drawOrder: 0 },
    { name: 'game', drawOrder: 1 },
    { name: 'ui', drawOrder: 2 },
  ],
});
```

* `layers`: Defines layer names and their drawing order.

---

### GameObject

A `GameObject` is a fundamental renderable node within the scene. It has **transform properties** (position, rotation, scale) and can contain child nodes.

```typescript
import { GameObject } from 'kiwiengine'

const player = new GameObject({
  x: 0,            // coordinate system with center as 0,0
  y: 0,
  scale: 1,
  rotation: 0,
  layer: 'game',   // Renderer layer name
  useYSort: true,  // Enable Y-based draw order sorting
  alpha: 1,
})

root.add(player)
```

#### Options (`GameObjectOptions`)

* `x`, `y`: Local position (default: 0).
* `scale`, `scaleX`, `scaleY`: Scaling.
* `pivotX`, `pivotY`: Pivot point for rotation and scaling.
* `rotation`: Rotation in radians.
* `alpha`: Transparency (0–1).
* `layer`: Layer name to render this object on.
* `useYSort`: If `true`, container `drawOrder` is set based on current `y` value.

#### Child Management

```typescript
const parent = new GameObject({ x: -100, y: 0, layer: 'game' })
const child  = new GameObject({ x: 50, y: 0 })

parent.add(child)   // parent’s transform propagates to child
root.add(parent)
```

* `add(...children)`: Add child nodes.
* `remove()`: Removes the node and all of its children.
* `pause() / resume()`: Pause or resume updates; propagates hierarchically.

#### Y-Sorting (`useYSort`)

```typescript
const a = new GameObject({ y: -50, useYSort: true })
const b = new GameObject({ y:  30, useYSort: true })
// If under the same parent, b will render in front of a
```

---

## License

MIT

## Author

Jason
