declare abstract class Loader<T> {
    #private;
    protected loadedAssets: Map<string, T>;
    protected loadingPromises: Map<string, Promise<T | undefined>>;
    protected hasActiveRef(id: string): boolean;
    protected abstract _load(id: string, ...args: any[]): Promise<T | undefined>;
    protected _dispose(id: string, asset: T): void;
    checkLoaded(id: string): boolean;
    load(id: string, ...args: any[]): Promise<T | undefined>;
    release(id: string): void;
}
export { Loader };
//# sourceMappingURL=loader.d.ts.map