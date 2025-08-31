import { debugMode } from '../debug';
export class Ticker {
    #fpsCap;
    #frameId = 0;
    constructor(onTick) {
        let prevTime = 0;
        let lagSeconds = 0;
        const step = (timestamp) => {
            const dt = (timestamp - prevTime) / 1000;
            if (dt > 0) {
                const fpsCap = this.#fpsCap;
                if (fpsCap !== undefined && fpsCap > 0) {
                    lagSeconds += dt;
                    const fixedStep = 1 / fpsCap;
                    if (lagSeconds >= fixedStep) {
                        onTick(fixedStep);
                        if (lagSeconds >= fixedStep * 2) {
                            onTick(dt);
                            lagSeconds = 0;
                        }
                        else {
                            lagSeconds -= fixedStep;
                        }
                    }
                }
                else {
                    onTick(dt);
                }
                prevTime = timestamp;
            }
            this.#frameId = requestAnimationFrame(step);
        };
        this.#frameId = requestAnimationFrame(step);
        if (debugMode) {
            if (!document.hasFocus())
                this.#fpsCap = 6;
            window.addEventListener('blur', this.#blurListener);
            window.addEventListener('focus', this.#focusListener);
            window.addEventListener('pageshow', this.#pageshowListener);
        }
    }
    #blurListener = () => { this.#fpsCap = 6; };
    #focusListener = () => { this.#fpsCap = undefined; };
    #pageshowListener = (event) => {
        if (event.persisted) {
            this.#fpsCap = undefined;
        }
    };
    remove() {
        cancelAnimationFrame(this.#frameId);
        window.removeEventListener('blur', this.#blurListener);
        window.removeEventListener('focus', this.#focusListener);
        window.removeEventListener('pageshow', this.#pageshowListener);
    }
}
//# sourceMappingURL=ticker.js.map