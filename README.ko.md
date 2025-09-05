# 키위엔진

키위엔진은 **TypeScript 기반 2D 웹 게임 엔진**입니다.

---

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

### Ticker (게임 루프)

`Ticker`는 **requestAnimationFrame 기반의 게임 루프 관리자**입니다. 매 프레임(또는 특정 상황에서 제한된 프레임)마다 `onTick(dt)` 콜백을 호출하여, **시간 기반 업데이트**를 수행할 수 있게 합니다. `Renderer` 내부 루프 또한 `Ticker`로 구동됩니다.

```ts
import { Ticker } from 'kiwiengine'

// dt: 직전 틱 이후 경과한 초(Seconds)
const ticker = new Ticker((dt) => {
  player.x += speed * dt
})

// 더 이상 필요 없을 때 정리
ticker.remove()
```

#### 생성자

```ts
new Ticker(onTick: (dt: number) => void)
```

* **`dt`(seconds)**: 이전 틱과의 시간 차를 초 단위로 전달합니다. 보통 60FPS 환경에서는 약 `0.0167`이 됩니다.
* 첫 프레임에서도 유효한 `dt`가 전달되며, 매 프레임마다 한 번 이상 호출됩니다.

#### 고정 스텝 & FPS 제한(디버그 전용)

* `debugMode`가 활성화된 상태에서 **브라우저 탭이 비활성화**되거나 포커스를 잃으면, 내부적으로 **6FPS로 제한**하여 CPU/GPU 점유를 낮춥니다.
* 이때 루프는 \*\*고정 스텝(fixed step)\*\*으로 동작합니다.

  * 고정 스텝 크기: `1 / fpsCap` (디폴트 6FPS인 경우 ≈ `0.1667s`).
  * 한 프레임에서 누적 지연(`lag`)이 고정 스텝을 초과하면 **고정 스텝 크기로 한 번** 업데이트합니다.
  * 지연이 더 커서 고정 스텝의 **두 배 이상**이면, 누적 보정용으로 **추가 한 번** 더 `onTick(dt 누적값)`을 호출해 상태를 따라잡습니다.
* 탭이 다시 포커스를 얻으면 제한이 해제되어 **정상 rAF 루프**로 복귀합니다.
* **페이지 복귀(`pageshow`)** 시 `bfcache`에서 돌아오는 경우를 감지하여, 제한을 초기화하고 정상 루프로 복귀합니다.

> 참고: FPS 제한 값(`fpsCap`)은 외부에서 설정하지 않으며, **디버그 모드 + 비포커스 상태**에서만 내부적으로 활성화됩니다.

#### 수명주기

```ts
Ticker#remove(): void
```

* 루프를 중지하고, 등록된 포커스/블러/페이지 이벤트 리스너를 해제합니다.
* `Renderer.remove()`는 내부적으로 자신이 보유한 `Ticker`까지 함께 제거합니다.

#### 사용 팁

* **시간기반 업데이트**: 물리/이동/애니메이션은 가능한 `dt`를 곱해 프레임레이트에 독립적으로 만드세요.

  ```ts
  velocity.y += GRAVITY * dt
  position.x += velocity.x * dt
  ```
* **이중 루프 지양**: 동일한 씬에 `Renderer`의 루프가 이미 있다면, 별도의 `Ticker`를 추가로 돌리지 말고 **업데이트 훅**(예: `GameObject`의 `update`)을 활용하는 쪽이 단순합니다.
* **정리 필수**: 씬 전환이나 페이지 언마운트 시 `remove()`를 호출해 메모리 누수를 예방하세요.

---

## Renderer

`Renderer`는 화면에 오브젝트를 그리는 **렌더링 관리자**로, 전체 게임의 **카메라, 레이어, 캔버스 리사이징, 렌더 루프** 등을 통합적으로 관리합니다.

```typescript
const renderer = new Renderer(document.body, {
  layers: [
    { name: 'background', drawOrder: 0 },
    { name: 'game', drawOrder: 1 },
    { name: 'ui', drawOrder: 2 },
  ],
});
```

### 주요 기능

* **레이어 시스템**: 레이어 이름과 그리는 순서를 지정할 수 있으며, 각 `GameObject`는 `layer` 속성으로 어느 레이어에 그릴지 지정합니다.
* **자동 리사이징**: 캔버스는 부모 엘리먼트의 크기를 따라 자동으로 리사이징되며, 중심 기준 좌표계에 맞춰 위치가 갱신됩니다.
* **중심 좌표계**: `(0, 0)`은 항상 **캔버스 중심**입니다. 화면 좌측 상단은 `(-width/2, -height/2)`가 됩니다.
* **카메라 이동/줌**: `Renderer.camera`를 통해 게임 화면의 위치와 확대/축소를 조절할 수 있습니다.
* **FPS 디스플레이 (디버그용)**: `debugMode`가 활성화된 경우 FPS 정보가 표시됩니다.
* **화면 좌표 → 월드 좌표 변환** 기능을 지원합니다.
* **렌더 루프 관리**: 내부적으로 `Ticker`를 사용해 루프를 구동하며, 디버그 모드에서 탭 비활성화 시 **자동 6FPS 제한**으로 성능을 보호합니다.

### 옵션 (`RendererOptions`)

```ts
type RendererOptions = {
  logicalWidth?: number        // 논리적 캔버스 너비
  logicalHeight?: number       // 논리적 캔버스 높이
  backgroundColor?: ColorSource  // 캔버스 배경색
  layers?: { name: string; drawOrder: number }[] // 레이어 정의
}
```

* `logicalWidth`와 `logicalHeight`를 지정하면, 논리 해상도를 설정할 수 있으며, 실제 화면에 비례해 자동 스케일링됩니다.

### 주요 메서드

#### `screenToWorld(x: number, y: number): { x: number, y: number }`

브라우저상의 마우스 좌표 등을 **월드 좌표계로 변환**합니다.

```ts
const worldPos = renderer.screenToWorld(event.clientX, event.clientY);
```

#### `remove()`

렌더러 및 관련 리소스를 정리하고 DOM에서 제거합니다. (**Ticker**, 캔버스, FPS 디스플레이 포함)

---

### 좌표계 설명

* 캔버스 중앙이 `(0, 0)`입니다.
* 좌측 상단은 `(-width/2, -height/2)`입니다.
* 마우스 위치를 오브젝트 위치로 사용하려면 `screenToWorld`를 통해 변환해야 합니다.
* `camera`를 통해 전체 화면을 이동하거나 확대/축소할 수 있습니다.

---

## GameObject

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

### 옵션 (`GameObjectOptions`)

* `x`, `y`: 로컬 좌표(기본 0).
* `scale`, `scaleX`, `scaleY`: 스케일.
* `pivotX`, `pivotY`: 회전/스케일의 기준점.
* `rotation`: 라디안 단위 회전.
* `alpha`: 투명도(0\~1).
* `layer`: 이 오브젝트를 그릴 레이어 이름.
* `useYSort`: `true`면 컨테이너의 `drawOrder`를 현재 `y`값으로 설정합니다.

### 자식 관리

```typescript
const parent = new GameObject({ x: -100, y: 0, layer: 'game' })
const child  = new GameObject({ x: 50, y: 0 })

parent.add(child)   // 부모의 이동/회전/스케일이 자식에 전파됨
root.add(parent)
```

* `add(...children)`: 자식을 현재 노드에 추가.
* `remove()`: 자신과 자식이 모두 제거됨.
* `pause() / resume()`: 일시정지/재개가 계층적으로 전파됨.

### Y-정렬 (`useYSort`)

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
