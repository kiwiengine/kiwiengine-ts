import { AtlasAttachmentLoader, SkeletonBinary, SkeletonJson, Skin, Spine, SpineTexture, TextureAtlas } from '@esotericsoftware/spine-pixi-v8';
import { binaryLoader } from '../asset/loaders/binary';
import { textLoader } from '../asset/loaders/text';
import { textureLoader } from '../asset/loaders/texture';
import { GameObject } from '../game-object/game-object';
class SpineObject extends GameObject {
    #spine;
    #atlas;
    #skeletonData;
    #skel;
    #json;
    #texture;
    #skins;
    #animation;
    #loop;
    constructor(opts) {
        super(opts);
        if (opts) {
            if (opts.atlas)
                this.atlas = opts.atlas;
            if (opts.skeletonData)
                this.skeletonData = opts.skeletonData;
            if (opts.skel)
                this.skel = opts.skel;
            if (opts.json)
                this.json = opts.json;
            if (opts.texture)
                this.texture = opts.texture;
            if (opts.skins)
                this.skins = opts.skins;
            if (opts.animation)
                this.animation = opts.animation;
            if (opts.loop)
                this.loop = opts.loop;
        }
    }
    async #load() {
        if (this.#atlas && (this.#skeletonData ||
            this.#skel ||
            this.#json)) {
            const promises = [];
            let textAtlasData;
            let skeletonBynary;
            let textSkeletonData;
            let texture;
            let textures;
            if (!textLoader.checkLoaded(this.#atlas))
                console.info(`Atlas not preloaded. Loading now: ${this.#atlas}`);
            promises.push((async () => textAtlasData = await textLoader.load(this.#atlas))());
            if (this.#skeletonData) {
                // Skeleton data is already loaded, no need to load again
            }
            else if (this.#skel) {
                if (!binaryLoader.checkLoaded(this.#skel))
                    console.info(`Skeleton not preloaded. Loading now: ${this.#skel}`);
                promises.push((async () => skeletonBynary = await binaryLoader.load(this.#skel))());
            }
            else if (this.#json) {
                if (!textLoader.checkLoaded(this.#json))
                    console.info(`Skeleton not preloaded. Loading now: ${this.#json}`);
                promises.push((async () => textSkeletonData = await textLoader.load(this.#json))());
            }
            else {
                console.error('Either skel or json must be provided');
                return;
            }
            if (typeof this.#texture === 'string') {
                if (!textureLoader.checkLoaded(this.#texture))
                    console.info(`Texture not preloaded. Loading now: ${this.#texture}`);
                promises.push((async () => texture = await textureLoader.load(this.#texture))());
            }
            else if (this.#texture) {
                textures = {};
                for (const [key, path] of Object.entries(this.#texture)) {
                    if (!textureLoader.checkLoaded(path))
                        console.info(`Texture not preloaded. Loading now: ${path}`);
                    promises.push((async () => {
                        const texture = await textureLoader.load(path);
                        if (texture)
                            textures[key] = texture;
                    })());
                }
            }
            await Promise.all(promises);
            if (texture || textures) {
                const atlas = new TextureAtlas(textAtlasData);
                atlas.pages.forEach((page) => {
                    if (texture)
                        page.setTexture(SpineTexture.from(texture.source));
                    else if (textures) {
                        page.setTexture(SpineTexture.from(textures[page.name].source));
                    }
                });
                const atlasLoader = new AtlasAttachmentLoader(atlas);
                let skeletonData;
                if (this.#skeletonData) {
                    const jsonLoader = new SkeletonJson(atlasLoader);
                    skeletonData = jsonLoader.readSkeletonData(this.#skeletonData);
                }
                else if (skeletonBynary) {
                    const binaryLoader = new SkeletonBinary(atlasLoader);
                    skeletonData = binaryLoader.readSkeletonData(skeletonBynary);
                }
                else if (textSkeletonData) {
                    const jsonLoader = new SkeletonJson(atlasLoader);
                    skeletonData = jsonLoader.readSkeletonData(textSkeletonData);
                }
                else {
                    console.error('Either skel or json must be provided');
                    return;
                }
                this.#spine = new Spine(skeletonData);
                this.#spine.state.addListener({
                    complete: (entry) => this.emit('animationend', entry.animation?.name ?? ""),
                });
                this.#applyAnimation();
                this.#applySkins();
                this._addPixiChild(this.#spine);
            }
        }
        this.emit('load');
    }
    #applyAnimation() {
        if (this.#spine && this.#animation) {
            this.#spine.state.setAnimation(0, this.#animation, this.#loop ?? true);
            this.#spine.state.apply(this.#spine.skeleton);
        }
    }
    #applySkins() {
        if (this.#spine && this.#skins) {
            const newSkin = new Skin('combined-skin');
            for (const skinName of this.#skins) {
                const skin = this.#spine.skeleton.data.findSkin(skinName);
                if (skin)
                    newSkin.addSkin(skin);
            }
            this.#spine.skeleton.setSkin(newSkin);
            this.#spine.skeleton.setSlotsToSetupPose();
        }
    }
    get atlas() {
        return this.#atlas;
    }
    set atlas(atlas) {
        this.#atlas = atlas;
        this.#load();
    }
    get skeletonData() {
        return this.#skeletonData;
    }
    set skeletonData(skeletonData) {
        this.#skeletonData = skeletonData;
        this.#load();
    }
    get skel() {
        return this.#skel;
    }
    set skel(skel) {
        this.#skel = skel;
        this.#load();
    }
    get json() {
        return this.#json;
    }
    set json(json) {
        this.#json = json;
        this.#load();
    }
    get texture() {
        return this.#texture;
    }
    set texture(texture) {
        this.#texture = texture;
        this.#load();
    }
    get skins() {
        return this.#skins;
    }
    set skins(skins) {
        this.#skins = skins;
        this.#applySkins();
    }
    get animation() {
        return this.#animation;
    }
    set animation(animation) {
        this.#animation = animation;
        this.#applyAnimation();
    }
    get loop() {
        return this.#loop;
    }
    set loop(loop) {
        this.#loop = loop;
        this.#applyAnimation();
    }
    remove() {
        if (typeof this.#texture === 'string') {
            textureLoader.release(this.#texture);
        }
        else if (this.#texture) {
            for (const path of Object.values(this.#texture)) {
                textureLoader.release(path);
            }
        }
        super.remove();
    }
}
export { SpineObject };
//# sourceMappingURL=spine.js.map