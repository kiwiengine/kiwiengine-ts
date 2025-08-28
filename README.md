# Kiwi Engine

Kiwi Engine is a TypeScript-based 2D web game engine.

## Features

### Coordinate System

Unlike most other 2D engines that use the top-left corner of the screen as `0, 0`, Kiwi Engine sets `0, 0` at the center of the screen. This is due to the nature of the web, where browser screens are often dynamic. By placing `0, 0` at the center, it becomes easier to organize objects and UI elements.

### Canvas Size

The size of the canvas is set to match the size of its parent element. If the parent element’s size changes, the canvas size changes accordingly. When the parent element is `body` and `body` matches the size of the window, the canvas will also match the window size, and it will resize automatically when the window size changes.

## License

MIT

## Author

Jason
