import { GameObject } from '../node/core/game-object';
const ARROW_CODES = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
function isArrow(code) {
    return ARROW_CODES.has(code);
}
function clampVector(dx, dy, maxR) {
    const dist = Math.hypot(dx, dy);
    if (dist <= maxR || dist === 0)
        return { x: dx, y: dy, dist };
    const s = maxR / dist;
    return { x: dx * s, y: dy * s, dist: maxR };
}
export class Joystick extends GameObject {
    // 키보드 상태
    #codesPressed = new Set();
    #arrowCodesPressed = new Set();
    // 터치 상태
    #activeTouchId;
    #touchStartX = 0;
    #touchStartY = 0;
    #isMoving = false;
    // DOM (터치용)
    #joystickImage;
    #knobImage;
    #maxKnobDistance;
    #moveThreshold;
    #imageDefaultPosition;
    // 콜백
    #onMove;
    #onRelease;
    #onKeydown;
    constructor(options) {
        super();
        this.#onMove = options.onMove;
        this.#onRelease = options.onRelease;
        this.#onKeydown = options.onKeydown;
        this.#joystickImage = options.joystickImage;
        this.#knobImage = options.knobImage;
        this.#maxKnobDistance = options.maxKnobDistance ?? 80;
        this.#moveThreshold = options.moveThreshold ?? 0;
        this.#imageDefaultPosition = options.imageDefaultPosition ?? { left: -999999, top: -999999 };
        window.addEventListener('keydown', this.#onKeyDown);
        window.addEventListener('keyup', this.#onKeyUp);
        window.addEventListener('blur', this.#onBlur);
    }
    set renderer(renderer) {
        super.renderer = renderer;
        if (renderer) {
            const c = renderer.container;
            c.addEventListener('touchstart', this.#onTouchStart);
            c.addEventListener('touchmove', this.#onTouchMove);
            c.addEventListener('touchend', this.#onTouchEnd);
            c.addEventListener('touchcancel', this.#onTouchEnd);
            if (this.#joystickImage) {
                Object.assign(this.#joystickImage.style, {
                    left: `${this.#imageDefaultPosition.left}px`,
                    top: `${this.#imageDefaultPosition.top}px`,
                    zIndex: '999998',
                    transform: 'translate(-50%, -50%)',
                });
                c.appendChild(this.#joystickImage);
            }
            if (this.#knobImage) {
                Object.assign(this.#knobImage.style, {
                    left: `${this.#imageDefaultPosition.left}px`,
                    top: `${this.#imageDefaultPosition.top}px`,
                    zIndex: '999998',
                    transform: 'translate(-50%, -50%)',
                });
                c.appendChild(this.#knobImage);
            }
        }
    }
    get renderer() {
        return super.renderer;
    }
    #onTouchStart = (event) => {
    };
    #onTouchMove = (event) => {
    };
    #onTouchEnd = (event) => {
    };
    #calculateRadianFromArrows() {
        let dx = 0;
        let dy = 0;
        if (this.#arrowCodesPressed.has('ArrowUp'))
            dy -= 1;
        if (this.#arrowCodesPressed.has('ArrowDown'))
            dy += 1;
        if (this.#arrowCodesPressed.has('ArrowLeft'))
            dx -= 1;
        if (this.#arrowCodesPressed.has('ArrowRight'))
            dx += 1;
        if (dx !== 0 || dy !== 0) {
            const radian = Math.atan2(dy, dx);
            // 키보드: distance=1 로 일관 전달
            this.#onMove(radian, 1);
        }
    }
    #onKeyDown = (event) => {
    };
    #onKeyUp = (event) => {
    };
    #onBlur = () => {
    };
    // 조이스틱 이미지의 기본 위치(숨김 좌표) 설정
    setImageDefaultPosition(position) {
        this.#imageDefaultPosition = position;
        // 드래그 중이면 즉시 반영하지 않음
        if (this.#activeTouchId !== undefined)
            return;
        if (this.#joystickImage)
            Object.assign(this.#joystickImage.style, {
                left: `${this.#imageDefaultPosition.left}px`,
                top: `${this.#imageDefaultPosition.top}px`,
            });
        if (this.#knobImage)
            Object.assign(this.#knobImage.style, {
                left: `${this.#imageDefaultPosition.left}px`,
                top: `${this.#imageDefaultPosition.top}px`,
            });
    }
    remove() {
        const renderer = this.renderer;
        if (renderer) {
            const c = renderer.container;
            c.removeEventListener('touchstart', this.#onTouchStart);
            c.removeEventListener('touchmove', this.#onTouchMove);
            c.removeEventListener('touchend', this.#onTouchEnd);
            c.removeEventListener('touchcancel', this.#onTouchEnd);
        }
        window.removeEventListener('keydown', this.#onKeyDown);
        super.remove();
    }
}
//# sourceMappingURL=joystick.js.map