const rootObjects = [];
let isLoopRunning = false;
let rafId = null;
export function addRootObject(go) {
    rootObjects.push(go);
    if (!isLoopRunning) {
        startLoop();
    }
}
export function removeRootObject(go) {
    const index = rootObjects.indexOf(go);
    if (index !== -1) {
        rootObjects.splice(index, 1);
    }
    if (rootObjects.length === 0) {
        stopLoop();
    }
}
function startLoop() {
    isLoopRunning = true;
    let lastTime = performance.now();
    function loop(now) {
        const delta = (now - lastTime) / 1000;
        lastTime = now;
        for (const obj of rootObjects) {
            obj._engineUpdate(delta);
        }
        if (isLoopRunning) {
            rafId = requestAnimationFrame(loop);
        }
    }
    rafId = requestAnimationFrame(loop);
}
function stopLoop() {
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    isLoopRunning = false;
}
//# sourceMappingURL=dom-world.js.map