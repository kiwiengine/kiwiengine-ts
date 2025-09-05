# 키위엔진

키위엔진은 **TypeScript 기반 2D 웹 게임 엔진**입니다.

## 특이사항

### 좌표계

일반적으로 다른 2D 엔진들은 화면 좌측 상단을 `0, 0`으로 하는데 반해, 키위엔진의 `0, 0`은 **화면 중앙**입니다.
이는 브라우저 화면이 주로 가변적인 웹의 특성 때문입니다. 화면의 가운데를 `0, 0`으로 해야 오브젝트나 UI를 구성하기가 쉬워집니다.

### 캔버스 크기

캔버스의 크기는 **캔버스 부모 엘리먼트의 크기와 동일**하게 설정됩니다.
부모 엘리먼트 크기가 변경되면 캔버스 크기도 변경됩니다. 부모 엘리먼트가 `body`이고 `body`가 윈도우 크기와 같다면, 캔버스 크기도 윈도우 크기와 동일하게 설정되며 윈도우 크기가 변경될 때 캔버스 크기도 함께 변경됩니다.

---

## API

### Delay 노드

`Delay` 노드는 일정 시간이 지난 후에 콜백 함수를 실행하는 노드입니다.

```typescript
const delayNode = new Delay(2, () => {
  console.log('2초가 지났습니다.');
});
parent.add(delayNode);
```

* `Delay` 노드는 실행 후 자동으로 부모 노드에서 제거됩니다.

---

### Renderer

`Renderer`는 화면에 오브젝트를 그리기 위한 렌더링 관리 클래스입니다.

```typescript
const renderer = new Renderer(document.body, {
  layers: [
    { name: 'background', drawOrder: 0 },
    { name: 'game', drawOrder: 1 },
    { name: 'ui', drawOrder: 2 },
  ],
});
```

* `layers`: 레이어 이름과 그리는 순서를 지정할 수 있습니다.

---

### GameObject

`GameObject`는 씬 내에서 **위치/회전/스케일 등의 변환**을 갖고, 자식 노드를 포함할 수 있는 기본 렌더러블 노드입니다.

```typescript
import { GameObject } from 'kiwiengine'

const player = new GameObject({
  x: 0,            // 화면 가운데를 0,0으로 하는 좌표계
  y: 0,
  scale: 1,
  rotation: 0,
  layer: 'game',   // Renderer에 등록된 레이어 이름
  useYSort: true,  // Y값 기반 drawOrder 정렬 사용 여부
  alpha: 1,
})

root.add(player)
```

#### 옵션 (`GameObjectOptions`)

* `x`, `y`: 로컬 좌표(기본 0).
* `scale`, `scaleX`, `scaleY`: 스케일.
* `pivotX`, `pivotY`: 회전/스케일의 기준점.
* `rotation`: 라디안 단위 회전.
* `alpha`: 투명도(0\~1).
* `layer`: 이 오브젝트를 그릴 레이어 이름.
* `useYSort`: `true`면 컨테이너의 `drawOrder`를 현재 `y`값으로 설정합니다.

#### 자식 관리

```typescript
const parent = new GameObject({ x: -100, y: 0, layer: 'game' })
const child  = new GameObject({ x: 50, y: 0 })

parent.add(child)   // 부모의 이동/회전/스케일이 자식에 전파됨
root.add(parent)
```

* `add(...children)`: 자식을 현재 노드에 추가.
* `remove()`: 자신과 자식이 모두 제거됨.
* `pause() / resume()`: 일시정지/재개가 계층적으로 전파됨.

#### Y-정렬 (`useYSort`)

```typescript
const a = new GameObject({ y: -50, useYSort: true })
const b = new GameObject({ y:  30, useYSort: true })
// 같은 부모에 있다면 b가 a보다 앞(drawOrder가 큼)에 렌더링됩니다.
```

---

## 라이센스

MIT

## 작성자

제이쓴
