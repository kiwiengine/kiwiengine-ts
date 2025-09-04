export declare abstract class Loader<T> {
    #private;
    protected cachedAssets: Map<string, T>;
    protected loadingPromises: Map<string, Promise<T | undefined>>;
    protected hasActiveRef(id: string): boolean;
    protected abstract doLoad(id: string, ...args: any[]): Promise<T | undefined>;
    protected cleanup(id: string, asset: T): void;
    checkCached(id: string): boolean;
    getCached(id: string): T | undefined;
    load(id: string, ...args: any[]): Promise<T | undefined>;
    release(id: string): void;
}
//# sourceMappingURL=loader.d.ts.map