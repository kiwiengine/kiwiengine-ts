import { EventEmitter } from '@webtaku/event-emitter';
export class Camera extends EventEmitter {
    #x = 0;
    #y = 0;
    #scale = 1;
    get x() { return this.#x; }
    get y() { return this.#y; }
    get scale() { return this.#scale; }
    setPosition(x, y) {
        this.#x = x;
        this.#y = y;
        this.emit('positionChanged');
    }
    setScale(scale) {
        this.#scale = scale;
        this.emit('scaleChanged');
    }
}
//# sourceMappingURL=camera.js.map