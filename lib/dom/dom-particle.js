import { DomGameObject } from './dom-game-object';
function random(min, max) {
    return Math.random() * (max - min) + min;
}
export class DomParticleSystem extends DomGameObject {
    #particles = [];
    constructor(options) {
        super(options);
        this.el.style.pointerEvents = 'none';
    }
}
//# sourceMappingURL=dom-particle.js.map