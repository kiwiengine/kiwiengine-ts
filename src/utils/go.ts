import { DomContainerObject } from '../game-object-ext/dom-container';
import { GameObject } from '../game-object/game-object';

const GameObjectClassMap = {
  'go': GameObject,
  'sprite': SpriteObject,
  'animated-sprite': AnimatedSpriteObject,
  'tiling-sprite': TilingSpriteObject,
  'spine': SpineObject,
  'dom': DomContainerObject,
  'text': TextObject,
  'rect': RectangleObject,
} as const;

type GameObjectNameMap = {
  [K in keyof typeof GameObjectClassMap]: InstanceType<(typeof GameObjectClassMap)[K]>;
};

type Name = '' | keyof GameObjectNameMap;

type GameObjectByName<T extends Name> = (
  T extends '' ? GameObject
  : (
    T extends keyof GameObjectNameMap ? GameObjectNameMap[T]
    : GameObject
  )
);

function go<T extends Name>(
  name: T = '' as T,
  ...args: (GameObjectByName<T> | Partial<GameObjectByName<T>>)[]
): GameObjectByName<T> {
  const go = new GameObjectClassMap[(name || 'go') as keyof GameObjectNameMap]();

  for (const arg of args) {
    if (arg instanceof GameObject) {
      go.appendChild(arg);
    } else if (arg) {
      for (const key in arg) {
        (go as any)[key] = arg[key];
      }
    }
  }

  return go as GameObjectByName<T>;
}

export { go };
