import { Loader } from './loader';
declare class TextLoader extends Loader<string> {
    protected _load(src: string): Promise<string | undefined>;
}
export declare const textLoader: TextLoader;
export {};
//# sourceMappingURL=text.d.ts.map