import { AtlasAttachmentLoader, Spine as PixiSpine, SkeletonBinary, SkeletonJson, Skin, SpineTexture, TextureAtlas } from '@esotericsoftware/spine-pixi-v8'
import { EventMap } from '@webtaku/event-emitter'
import { Texture } from 'pixi.js'
import { binaryLoader } from '../../asset/loaders/binary'
import { textLoader } from '../../asset/loaders/text'
import { textureLoader } from '../../asset/loaders/texture'
import { GameObject, GameObjectOptions } from '../core/game-object'

export type SpineNodeOptions = {
  atlas: string
  texture: string | Record<string, string>

  rawSkeletonData?: any
  skel?: string
  json?: string

  skins?: string[]
  animation?: string
  loop?: boolean
} & GameObjectOptions

export class SpineNode<E extends EventMap = EventMap> extends GameObject<E & {
  animationend: (animation: string) => void
}> {
  #atlas: string
  #texture: string | Record<string, string>

  #rawSkeletonData?: any
  #skel?: string
  #json?: string

  #skins?: string[]
  #animation?: string
  #loop?: boolean

  #spine?: PixiSpine

  constructor(options: SpineNodeOptions) {
    super(options)
    this.#atlas = options.atlas
    this.#texture = options.texture
    this.#rawSkeletonData = options.rawSkeletonData
    this.#skel = options.skel
    this.#json = options.json
    this.#skins = options.skins
    this.#animation = options.animation
    this.#loop = options.loop
    this.#load()
  }

  #buildSkeletonData(
    atlasText: string,
    texture: Texture | undefined,
    textures: Record<string, Texture> | undefined,
    skeletonBinary: Uint8Array | undefined,
    textSkeletonData: string | undefined
  ) {
    if (!atlasText) return undefined
    if (!texture && !textures) return undefined
    if (!this.rawSkeletonData && !skeletonBinary && !textSkeletonData) return undefined

    // Create TextureAtlas and bind pages to provided textures
    const atlas = new TextureAtlas(atlasText)
    atlas.pages.forEach((page) => {
      if (texture) {
        page.setTexture(SpineTexture.from(texture.source))
      } else if (textures) {
        const t = textures[page.name]
        if (!t) throw new Error(`Missing texture for atlas page: ${page.name}`)
        page.setTexture(SpineTexture.from(t.source))
      }
    })

    const atlasLoader = new AtlasAttachmentLoader(atlas)

    // Parse skeleton data depending on available source
    if (this.rawSkeletonData) {
      const jsonLoader = new SkeletonJson(atlasLoader)
      return jsonLoader.readSkeletonData(this.rawSkeletonData)
    }
    if (skeletonBinary) {
      const binLoader = new SkeletonBinary(atlasLoader)
      return binLoader.readSkeletonData(skeletonBinary)
    }
    if (textSkeletonData) {
      const jsonLoader = new SkeletonJson(atlasLoader)
      return jsonLoader.readSkeletonData(textSkeletonData)
    }
    return undefined
  }

  #getCachedSkeletonData() {
    try {
      if (!this.#rawSkeletonData && !this.#skel && !this.#json) return undefined
      if (!textLoader.checkCached(this.#atlas)) return undefined

      const atlasText = textLoader.getCached(this.#atlas)!

      let texture: Texture | undefined
      let textures: Record<string, Texture> | undefined

      if (typeof this.#texture === 'string') {
        if (!textureLoader.checkCached(this.#texture)) return undefined
        texture = textureLoader.getCached(this.#texture)!
      } else if (this.#texture) {
        textures = {}
        for (const [key, path] of Object.entries(this.#texture)) {
          if (!textureLoader.checkCached(path)) return undefined
          textures[key] = textureLoader.getCached(path)!
        }
      } else {
        return undefined
      }

      let skeletonBinary: Uint8Array | undefined
      let textSkeletonData: string | undefined

      if (!this.#rawSkeletonData) {
        if (this.#skel) {
          if (!binaryLoader.checkCached(this.#skel)) return undefined
          skeletonBinary = binaryLoader.getCached(this.#skel)!
        } else if (this.#json) {
          if (!textLoader.checkCached(this.#json)) return undefined
          textSkeletonData = textLoader.getCached(this.#json)!
        }
      }

      return this.#buildSkeletonData(
        atlasText,
        texture,
        textures,
        skeletonBinary,
        textSkeletonData,
      )
    } catch (e) {
      console.error('Failed to build skeleton data from cache:', e)
      return undefined
    }
  }

  async #loadSkeletonData() {
    if (!this.#rawSkeletonData && !this.#skel && !this.#json) return undefined

    const promises: Promise<any>[] = []

    let atlasText: string | undefined
    let skeletonBinary: Uint8Array | undefined
    let textSkeletonData: string | undefined
    let texture: Texture | undefined
    let textures: Record<string, Texture> | undefined

    // Load atlas (text)
    if (!textLoader.checkCached(this.#atlas)) console.info(`Atlas not preloaded. Loading now: ${this.#atlas}`)
    promises.push((async () => (atlasText = await textLoader.load(this.#atlas)))())

    // Load skeleton (raw / binary / json)
    if (this.#rawSkeletonData) {
      // already provided
    } else if (this.#skel) {
      if (!binaryLoader.checkCached(this.#skel)) console.info(`Skeleton not preloaded. Loading now: ${this.#skel}`)
      promises.push((async () => (skeletonBinary = await binaryLoader.load(this.#skel!)))())
    } else if (this.#json) {
      if (!textLoader.checkCached(this.#json)) console.info(`Skeleton not preloaded. Loading now: ${this.#json}`)
      promises.push((async () => (textSkeletonData = await textLoader.load(this.#json!)))())
    } else {
      console.error('Either skel or json must be provided')
      return undefined
    }

    // Load textures (single or multiple)
    if (typeof this.#texture === 'string') {
      if (!textureLoader.checkCached(this.#texture)) console.info(`Texture not preloaded. Loading now: ${this.#texture}`)
      promises.push((async () => (texture = await textureLoader.load(this.#texture as string)))())
    } else if (this.#texture) {
      textures = {}
      for (const [key, path] of Object.entries(this.#texture)) {
        if (!textureLoader.checkCached(path)) console.info(`Texture not preloaded. Loading now: ${path}`)
        promises.push((async () => {
          const t = await textureLoader.load(path)
          if (t) textures![key] = t
        })())
      }
    }

    await Promise.all(promises)

    if (!atlasText) return undefined
    if (!texture && !(textures && Object.keys(textures).length)) return undefined

    return this.#buildSkeletonData(
      atlasText,
      texture,
      textures,
      skeletonBinary,
      textSkeletonData,
    )
  }

  async #load() {
    let skeletonData = this.#getCachedSkeletonData()
    if (!skeletonData) {
      skeletonData = await this.#loadSkeletonData()
    }

    this.#spine?.destroy()
    this.#spine = undefined

    if (skeletonData) {
      const s = new PixiSpine(skeletonData)
      s.state.addListener({
        complete: (e) => (this as any).emit('animationend', e.animation?.name ?? '')
      })
      this.#spine = s
      this.#updateAnimation()
      this.#updateSkins()
      this._pixiContainer.addChild(s)
    }
  }

  #updateSkins() {
    const s = this.#spine?.skeleton
    if (s && this.#skins) {
      const newSkin = new Skin('combined-skin')
      for (const skinName of this.#skins) {
        const skin = s.data.findSkin(skinName)
        if (skin) newSkin.addSkin(skin)
      }
      s.setSkin(newSkin)
      s.setSlotsToSetupPose()
    }
  }

  #updateAnimation() {
    const s = this.#spine
    if (s && this.#animation) {
      s.state.setAnimation(0, this.#animation, this.#loop ?? true)
      s.state.apply(s.skeleton)
    }
  }

  set atlas(atlas) {
    if (this.#atlas !== atlas) {
      this.#atlas = atlas
      this.#load()
    }
  }

  get atlas() { return this.#atlas }

  set texture(texture) {
    if (this.#texture !== texture) {
      this.#texture = texture
      this.#load()
    }
  }

  get texture() { return this.#texture }

  set rawSkeletonData(rawSkeletonData) {
    if (this.#rawSkeletonData !== rawSkeletonData) {
      this.#rawSkeletonData = rawSkeletonData
      this.#load()
    }
  }

  get rawSkeletonData() { return this.#rawSkeletonData }

  set skel(skel) {
    if (this.#skel !== skel) {
      this.#skel = skel
      this.#load()
    }
  }

  get skel() { return this.#skel }

  set json(json) {
    if (this.#json !== json) {
      this.#json = json
      this.#load()
    }
  }

  get json() { return this.#json }

  set skins(skins) {
    if (this.#skins !== skins) {
      this.#skins = skins
      this.#updateSkins()
    }
  }

  get skins() { return this.#skins }

  set animation(animation) {
    if (this.#animation !== animation) {
      this.#animation = animation
      this.#updateAnimation()
    }
  }

  get animation() { return this.#animation }

  set loop(loop) {
    if (this.#loop !== loop) {
      this.#loop = loop
      this.#updateAnimation()
    }
  }

  get loop() { return this.#loop }

  remove() {
    if (typeof this.#texture === 'string') {
      textureLoader.release(this.#texture)
    } else if (this.#texture) {
      for (const path of Object.values(this.#texture)) {
        textureLoader.release(path)
      }
    }
    super.remove()
  }
}
