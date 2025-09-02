export declare abstract class Loader<T> {
    #private;
    protected loadedAssets: Map<string, T>;
    protected loadingPromises: Map<string, Promise<T | undefined>>;
    protected hasActiveRef(id: string): boolean;
    protected abstract doLoad(id: string, ...args: any[]): Promise<T | undefined>;
    protected cleanup(id: string, asset: T): void;
    checkLoaded(id: string): boolean;
    get(id: string): T | undefined;
    load(id: string, ...args: any[]): Promise<T | undefined>;
    release(id: string): void;
}
//# sourceMappingURL=loader.d.ts.map