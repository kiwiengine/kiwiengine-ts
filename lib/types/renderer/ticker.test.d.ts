/** @jest-environment jsdom */
/**
 * Test Suite — Ticker (Jest)
 * -------------------------------------------------------
 * Goals
 *  - Avoid floating-point pitfalls around fixed step boundaries
 *  - Validate uncapped, capped via blur (6fps), long frame split,
 *    focus/pageshow transitions, and remove()
 *  - In this implementation: no setFixedFps; debugMode + focus/blur/pageshow control fps cap
 *
 * Principles
 *  - Do not assert exactly at the boundary (e.g., prefer 170ms over ~166ms)
 *  - Validate deltaTime using toBeCloseTo + loose call count checks
 */
/** ----------------------- Time & RAF harness ----------------------- **/
type FrameCb = (time: number) => void;
declare let nowMs: number;
declare const rafCallbacks: Map<number, FrameCb>;
declare let nextRafId: number;
declare const installTimeAndRafMocks: () => void;
declare const resetHarness: () => void;
/**
 * Advance a single frame: move the clock by advanceMs and
 * run only the currently registered RAF callbacks
 * (callbacks registered during this step run on the next step).
 */
declare const step: (advanceMs: number) => void;
/** Advance multiple frames (helper) */
declare const advance: (totalMs: number, stepMs?: number) => void;
/**
 * Helper to (re)load Ticker with a specific debugMode value.
 * Uses jest.resetModules + jest.doMock to inject the desired export.
 */
declare const loadTickerWithDebug: (debug: boolean) => Promise<new (onTick: (dt: number) => void) => {
    remove(): void;
}>;
/** Small helpers to read arguments cleanly */
declare const argOf: (mockFn: jest.Mock, nthZeroBased: number) => number;
declare const lastArg: (mockFn: jest.Mock) => number;
//# sourceMappingURL=ticker.test.d.ts.map