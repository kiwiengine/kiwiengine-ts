import { ObjectStateTree, ObjectType, ROOT } from '@kiwiengine/core'

export type GameObjectOptions = {
  type: ObjectType
}

export class GameObject {
  #options: GameObjectOptions
  #children: GameObject[] = []

  protected _id?: number
  protected _tree?: ObjectStateTree

  constructor(options: GameObjectOptions) {
    this.#options = options
  }

  set tree(tree: ObjectStateTree) {
    if (this._tree) throw new Error('GameObject is already in a tree')

    const id = tree.create()
    tree.setObjectType(id, this.#options.type)

    this._id = id
    this._tree = tree

    for (const child of this.#children) {
      if (!child._tree) child.tree = tree
      tree.insert(id, child._id!)
    }
  }

  add(...children: GameObject[]) {
    for (const child of children) {
      if (this._tree && this._id !== undefined) {
        if (!child._tree) child.tree = this._tree
        this._tree.insert(this._id, child._id!)
      }
      this.#children.push(child)
    }
  }

  destroy() {
    if (!this._tree || this._id === undefined) throw new Error('GameObject is not in a tree')

    this._tree.remove(this._id)
    this._tree = undefined
    this._id = undefined
  }
}

export class RootObject extends GameObject {
  constructor(tree: ObjectStateTree) {
    super({ type: ObjectType.CONTAINER })
    this._id = ROOT
    this._tree = tree
  }
}
