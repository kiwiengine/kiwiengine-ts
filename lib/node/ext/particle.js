import { GameObject } from '../core/game-object';
function random(min, max) {
    return Math.random() * (max - min) + min;
}
export class ParticleSystem extends GameObject {
    #particles = [];
    constructor(options) {
        super(options);
    }
}
//# sourceMappingURL=particle.js.map