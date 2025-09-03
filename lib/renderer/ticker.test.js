"use strict";
/** @jest-environment jsdom */
// Simulated monotonic clock (ms)
let nowMs = 0;
// RAF callback registry: id -> cb
const rafCallbacks = new Map();
let nextRafId = 1;
const installTimeAndRafMocks = () => {
    jest.spyOn(performance, 'now').mockImplementation(() => nowMs);
    jest
        .spyOn(window, 'requestAnimationFrame')
        .mockImplementation((cb) => {
        const id = nextRafId++;
        rafCallbacks.set(id, cb);
        return id;
    });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
        rafCallbacks.delete(id);
    });
};
const resetHarness = () => {
    nowMs = 0;
    rafCallbacks.clear();
    nextRafId = 1;
};
/**
 * Advance a single frame: move the clock by advanceMs and
 * run only the currently registered RAF callbacks
 * (callbacks registered during this step run on the next step).
 */
const step = (advanceMs) => {
    nowMs += advanceMs;
    const cbs = [...rafCallbacks.values()];
    rafCallbacks.clear();
    for (const cb of cbs)
        cb(nowMs);
};
/** Advance multiple frames (helper) */
const advance = (totalMs, stepMs = 16) => {
    const n = Math.floor(totalMs / stepMs);
    for (let i = 0; i < n; i++)
        step(stepMs);
    const remain = totalMs - n * stepMs;
    if (remain > 0)
        step(remain);
};
/**
 * Helper to (re)load Ticker with a specific debugMode value.
 * Uses jest.resetModules + jest.doMock to inject the desired export.
 */
const loadTickerWithDebug = async (debug) => {
    jest.resetModules();
    jest.doMock('../debug', () => ({ debugMode: debug }), { virtual: true });
    const mod = await import('./ticker');
    return mod.Ticker;
};
/** Small helpers to read arguments cleanly */
const argOf = (mockFn, nthZeroBased) => mockFn.mock.calls[nthZeroBased][0];
const lastArg = (mockFn) => {
    const i = mockFn.mock.calls.length - 1;
    return mockFn.mock.calls[i][0];
};
/** ----------------------- Lifecycle -------------------------- **/
beforeEach(() => {
    resetHarness();
    jest.restoreAllMocks();
    installTimeAndRafMocks();
});
afterEach(() => {
    jest.restoreAllMocks();
    resetHarness();
});
/** ----------------------- Tests ------------------------------ **/
describe('uncapped mode (debugMode=false)', () => {
    it('calls onTick once per frame with raw deltaTime (seconds)', async () => {
        const Ticker = await loadTickerWithDebug(false);
        const spy = jest.fn();
        const ticker = new Ticker(spy); // default: uncapped
        step(10); // 0.010
        step(20); // 0.020
        step(30); // 0.030
        expect(spy).toHaveBeenCalledTimes(3);
        // Assert shapes, then values
        expect(spy).toHaveBeenNthCalledWith(1, expect.any(Number));
        expect(spy).toHaveBeenNthCalledWith(2, expect.any(Number));
        expect(spy).toHaveBeenNthCalledWith(3, expect.any(Number));
        expect(argOf(spy, 0)).toBeCloseTo(0.010, 6);
        expect(argOf(spy, 1)).toBeCloseTo(0.020, 6);
        expect(argOf(spy, 2)).toBeCloseTo(0.030, 6);
        ticker.remove();
    });
    it('does not call onTick when deltaTime <= 0', async () => {
        const Ticker = await loadTickerWithDebug(false);
        const spy = jest.fn();
        const ticker = new Ticker(spy);
        step(0);
        expect(spy).not.toHaveBeenCalled();
        step(5);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenLastCalledWith(expect.any(Number));
        expect(lastArg(spy)).toBeCloseTo(0.005, 6);
        ticker.remove();
    });
});
describe('capped mode via blur (debugMode=true -> 6fps)', () => {
    it('accumulates lag and calls at fixed-step boundaries (avoid exact boundary)', async () => {
        const Ticker = await loadTickerWithDebug(true);
        jest.spyOn(document, 'hasFocus').mockReturnValue(true);
        const spy = jest.fn();
        const ticker = new Ticker(spy);
        // Apply 6fps cap using blur (fixedStep ≈ 1/6 ≈ 0.1666667s)
        window.dispatchEvent(new Event('blur'));
        // 100 + 70 = 170ms -> crosses one boundary -> one call ≈ fixedStep
        step(100);
        step(70);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenLastCalledWith(expect.any(Number));
        expect(lastArg(spy)).toBeCloseTo(1 / 6, 6);
        // Remaining lag ≈ 0.0033s
        step(91); // still below another boundary
        expect(spy).toHaveBeenCalledTimes(1);
        step(80); // crosses again
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenLastCalledWith(expect.any(Number));
        expect(lastArg(spy)).toBeCloseTo(1 / 6, 6);
        ticker.remove();
    });
    it('long frame (delta >= 2*fixedStep) triggers two calls: fixedStep then raw delta; then lag resets', async () => {
        const Ticker = await loadTickerWithDebug(true);
        jest.spyOn(document, 'hasFocus').mockReturnValue(true);
        const spy = jest.fn();
        const ticker = new Ticker(spy);
        window.dispatchEvent(new Event('blur')); // enable 6fps cap
        // 500ms (0.5s) >= 2 * (1/6 ≈ 0.3333s)
        step(500);
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenNthCalledWith(1, expect.any(Number));
        expect(argOf(spy, 0)).toBeCloseTo(1 / 6, 6);
        expect(spy).toHaveBeenNthCalledWith(2, expect.any(Number));
        expect(argOf(spy, 1)).toBeCloseTo(0.5, 6);
        // Repeat pattern
        step(500);
        expect(spy).toHaveBeenCalledTimes(4);
        expect(spy).toHaveBeenNthCalledWith(3, expect.any(Number));
        expect(argOf(spy, 2)).toBeCloseTo(1 / 6, 6);
        expect(spy).toHaveBeenNthCalledWith(4, expect.any(Number));
        expect(argOf(spy, 3)).toBeCloseTo(0.5, 6);
        ticker.remove();
    });
});
describe('runtime transitions via focus/pageshow (debugMode=true)', () => {
    it('blur -> capped(6fps) / focus -> uncapped: after focus, raw delta behavior resumes', async () => {
        const Ticker = await loadTickerWithDebug(true);
        jest.spyOn(document, 'hasFocus').mockReturnValue(true);
        const spy = jest.fn();
        const ticker = new Ticker(spy);
        // Enter capped mode and get one fixed-step call
        window.dispatchEvent(new Event('blur'));
        step(170);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenLastCalledWith(expect.any(Number));
        expect(lastArg(spy)).toBeCloseTo(1 / 6, 6);
        // Back to uncapped
        window.dispatchEvent(new Event('focus'));
        spy.mockClear();
        step(16);
        step(33);
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenNthCalledWith(1, expect.any(Number));
        expect(argOf(spy, 0)).toBeCloseTo(0.016, 6);
        expect(spy).toHaveBeenNthCalledWith(2, expect.any(Number));
        expect(argOf(spy, 1)).toBeCloseTo(0.033, 6);
        ticker.remove();
    });
    it('pageshow(persisted=true) sets fpsCap to uncapped again', async () => {
        const Ticker = await loadTickerWithDebug(true);
        jest.spyOn(document, 'hasFocus').mockReturnValue(true);
        const spy = jest.fn();
        const ticker = new Ticker(spy);
        window.dispatchEvent(new Event('blur'));
        step(200); // > 1/6s => fixed-step call
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenLastCalledWith(expect.any(Number));
        expect(lastArg(spy)).toBeCloseTo(1 / 6, 6);
        // Create a pageshow event with persisted=true (jsdom lacks PageTransitionEvent)
        const evt = new Event('pageshow');
        Object.defineProperty(evt, 'persisted', { value: true });
        window.dispatchEvent(evt);
        spy.mockClear();
        step(25);
        step(40);
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenNthCalledWith(1, expect.any(Number));
        expect(argOf(spy, 0)).toBeCloseTo(0.025, 6);
        expect(spy).toHaveBeenNthCalledWith(2, expect.any(Number));
        expect(argOf(spy, 1)).toBeCloseTo(0.040, 6);
        ticker.remove();
    });
});
describe('remove()', () => {
    it('cancels next RAF and stops future ticks; also cleans up listeners', async () => {
        const Ticker = await loadTickerWithDebug(true);
        // Ensure the ticker starts in uncapped mode so the first small step triggers a tick.
        jest.spyOn(document, 'hasFocus').mockReturnValue(true);
        const spy = jest.fn();
        const cancelSpy = jest.spyOn(window, 'cancelAnimationFrame');
        const ticker = new Ticker(spy);
        step(16); // ~0.016s -> should tick in uncapped mode
        expect(spy).toHaveBeenCalledTimes(1);
        ticker.remove();
        expect(cancelSpy).toHaveBeenCalled();
        spy.mockClear();
        advance(200, 16);
        expect(spy).not.toHaveBeenCalled();
        // Listeners are cleaned up (dispatching events does nothing and does not throw)
        expect(() => window.dispatchEvent(new Event('blur'))).not.toThrow();
        expect(() => window.dispatchEvent(new Event('focus'))).not.toThrow();
    });
});
describe('long-running sanity (ragged frames, capped=6fps)', () => {
    it('produces a reasonable number of calls; includes fixedStep calls', async () => {
        const Ticker = await loadTickerWithDebug(true);
        jest.spyOn(document, 'hasFocus').mockReturnValue(true);
        const spy = jest.fn();
        const ticker = new Ticker(spy);
        window.dispatchEvent(new Event('blur')); // 6fps -> fixedStep ≈ 0.1667
        // Total ~1000ms with some long frames to trigger the split branch
        const frames = [33, 33, 35, 201, 51, 61, 41, 201, 201, 251];
        for (const ms of frames)
            step(ms);
        const calls = spy.mock.calls.length;
        // With lag resets/rounding, tolerate a loose range
        expect(calls).toBeGreaterThanOrEqual(5);
        expect(calls).toBeLessThanOrEqual(9);
        // At least one call should be exactly the fixed step (~1/6)
        const hasFixedStep = spy.mock.calls.some(([dt]) => Math.abs(dt - 1 / 6) < 1e-6);
        expect(hasFixedStep).toBe(true);
        ticker.remove();
    });
});
//# sourceMappingURL=ticker.test.js.map