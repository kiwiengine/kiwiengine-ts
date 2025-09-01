import { GlobalTransform } from '../node/core/transform'
import { CircleCollider, Collider, ColliderType, EllipseCollider, Point, PolygonCollider, RectangleCollider } from './colliders'

type Transform = GlobalTransform

// =====================================================================================
// Utility (scalar-only)
// =====================================================================================

function dot(ax: number, ay: number, bx: number, by: number) { return ax * bx + ay * by }
function clamp(v: number, lo: number, hi: number) { return v < lo ? lo : (v > hi ? hi : v) }

// =====================================================================================
// Rectangle–Rectangle (OBB–OBB) — SAT with 4 axes (scalar-only)
// =====================================================================================

function obbRadiusOnAxis(
  Lx: number, Ly: number,
  ux: number, uy: number, vx: number, vy: number, hx: number, hy: number
) {
  const Lu = Lx * ux + Ly * uy
  const Lv = Lx * vx + Ly * vy
  const a = hx * (Lu < 0 ? -Lu : Lu)
  const b = hy * (Lv < 0 ? -Lv : Lv)
  return a + b
}

function axisSeparates(
  Lx: number, Ly: number, dx: number, dy: number,
  aux: number, auy: number, avx: number, avy: number, ahx: number, ahy: number,
  bux: number, buy: number, bvx: number, bvy: number, bhx: number, bhy: number
) {
  const dist = dx * Lx + dy * Ly; const ad = dist < 0 ? -dist : dist
  const rA = obbRadiusOnAxis(Lx, Ly, aux, auy, avx, avy, ahx, ahy)
  const rB = obbRadiusOnAxis(Lx, Ly, bux, buy, bvx, bvy, bhx, bhy)
  return ad > (rA + rB)
}

function checkRectRectCollision(
  ca: RectangleCollider, ta: Transform,
  cb: RectangleCollider, tb: Transform
): boolean {
  const asx = ta.scaleX.v, asy = ta.scaleY.v
  const bsx = tb.scaleX.v, bsy = tb.scaleY.v

  const ahx = (ca.width * asx) * 0.5
  const ahy = (ca.height * asy) * 0.5
  const bhx = (cb.width * bsx) * 0.5
  const bhy = (cb.height * bsy) * 0.5

  const ax = ta.x.v + (ca.x || 0) * asx
  const ay = ta.y.v + (ca.y || 0) * asy
  const bx = tb.x.v + (cb.x || 0) * bsx
  const by = tb.y.v + (cb.y || 0) * bsy

  const rotA = ta.rotation.v, rotB = tb.rotation.v
  if ((rotA === 0 || rotA === 0.0) && (rotB === 0 || rotB === 0.0)) {
    const dx = bx - ax; const adx = dx < 0 ? -dx : dx
    const dy = by - ay; const ady = dy < 0 ? -dy : dy
    return (adx <= ahx + bhx) && (ady <= ahy + bhy)
  }

  const cA = ta.rotation.cos, sA = ta.rotation.sin
  const cB = tb.rotation.cos, sB = tb.rotation.sin

  const aux = cA, auy = sA
  const avx = -sA, avy = cA

  const bux = cB, buy = sB
  const bvx = -sB, bvy = cB

  const dx = bx - ax
  const dy = by - ay

  if (axisSeparates(aux, auy, dx, dy, aux, auy, avx, avy, ahx, ahy, bux, buy, bvx, bvy, bhx, bhy)) return false
  if (axisSeparates(avx, avy, dx, dy, aux, auy, avx, avy, ahx, ahy, bux, buy, bvx, bvy, bhx, bhy)) return false
  if (axisSeparates(bux, buy, dx, dy, aux, auy, avx, avy, ahx, ahy, bux, buy, bvx, bvy, bhx, bhy)) return false
  if (axisSeparates(bvx, bvy, dx, dy, aux, auy, avx, avy, ahx, ahy, bux, buy, bvx, bvy, bhx, bhy)) return false

  return true
}

// =====================================================================================
// Circle–Circle (scalar-only)
// =====================================================================================

function checkCircleCircleCollision(
  ca: CircleCollider, ta: Transform, cb: CircleCollider, tb: Transform
): boolean {
  const ax = ta.x.v + (ca.x || 0) * ta.scaleX.v
  const ay = ta.y.v + (ca.y || 0) * ta.scaleY.v
  const bx = tb.x.v + (cb.x || 0) * tb.scaleX.v
  const by = tb.y.v + (cb.y || 0) * tb.scaleY.v

  // isotropic approx for non-uniform scale
  const ra = ca.radius * 0.5 * ((ta.scaleX.v < 0 ? -ta.scaleX.v : ta.scaleX.v) + (ta.scaleY.v < 0 ? -ta.scaleY.v : ta.scaleY.v))
  const rb = cb.radius * 0.5 * ((tb.scaleX.v < 0 ? -tb.scaleX.v : tb.scaleX.v) + (tb.scaleY.v < 0 ? -tb.scaleY.v : tb.scaleY.v))

  const dx = bx - ax, dy = by - ay
  const r = ra + rb
  return (dx * dx + dy * dy) <= r * r
}

// =====================================================================================
// Rect–Circle (scalar-only, OBB vs circle via closest-point in rect local space)
// =====================================================================================

function checkRectCircleCollision(
  r: RectangleCollider, tr: Transform,
  c: CircleCollider, tc: Transform
): boolean {
  const sx = tr.scaleX.v, sy = tr.scaleY.v
  const cxr = tr.x.v + (r.x || 0) * sx
  const cyr = tr.y.v + (r.y || 0) * sy
  const hx = (r.width * sx) * 0.5
  const hy = (r.height * sy) * 0.5

  const cs = tr.rotation.cos, sn = tr.rotation.sin
  const ux = cs, uy = sn
  const vx = -sn, vy = cs

  const pcx = tc.x.v + (c.x || 0) * tc.scaleX.v
  const pcy = tc.y.v + (c.y || 0) * tc.scaleY.v
  const rr = c.radius * 0.5 * ((tc.scaleX.v < 0 ? -tc.scaleX.v : tc.scaleX.v) + (tc.scaleY.v < 0 ? -tc.scaleY.v : tc.scaleY.v))

  const dx = pcx - cxr, dy = pcy - cyr
  const qx = dx * ux + dy * uy
  const qy = dx * vx + dy * vy

  const clx = qx < -hx ? -hx : (qx > hx ? hx : qx)
  const cly = qy < -hy ? -hy : (qy > hy ? hy : qy)

  const ddx = qx - clx
  const ddy = qy - cly
  return (ddx * ddx + ddy * ddy) <= rr * rr
}

// =====================================================================================
// Polygon helpers — scalar-only projections (INLINE loops; no returns that allocate)
// =====================================================================================

// Polygon–Polygon (SAT). Assumes both polygons in WORLD space.
function checkPolyPolyCollision(a: PolygonCollider, b: PolygonCollider): boolean {
  const av = a.vertices, bv = b.vertices
  let n = av.length; if (n === 0) return false
  let m = bv.length; if (m === 0) return false

  // A's edges
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const ex = av[j].x - av[i].x
    const ey = av[j].y - av[i].y
    const nx = -ey, ny = ex

    let minA = Infinity, maxA = -Infinity
    for (let k = 0; k < n; k++) {
      const p = nx * av[k].x + ny * av[k].y
      if (p < minA) minA = p
      if (p > maxA) maxA = p
    }
    let minB = Infinity, maxB = -Infinity
    for (let k = 0; k < m; k++) {
      const p = nx * bv[k].x + ny * bv[k].y
      if (p < minB) minB = p
      if (p > maxB) maxB = p
    }
    if (maxA < minB || maxB < minA) return false
  }

  // B's edges
  for (let i = 0; i < m; i++) {
    const j = (i + 1) % m
    const ex = bv[j].x - bv[i].x
    const ey = bv[j].y - bv[i].y
    const nx = -ey, ny = ex

    let minA = Infinity, maxA = -Infinity
    for (let k = 0; k < n; k++) {
      const p = nx * av[k].x + ny * av[k].y
      if (p < minA) minA = p
      if (p > maxA) maxA = p
    }
    let minB = Infinity, maxB = -Infinity
    for (let k = 0; k < m; k++) {
      const p = nx * bv[k].x + ny * bv[k].y
      if (p < minB) minB = p
      if (p > maxB) maxB = p
    }
    if (maxA < minB || maxB < minA) return false
  }

  return true
}

// Polygon–Circle (SAT using edges + closest-vertex axis)
function checkPolyCircleCollision(poly: PolygonCollider, c: CircleCollider, tc: Transform): boolean {
  const v = poly.vertices; const n = v.length; if (n === 0) return false

  const px = tc.x.v + (c.x || 0) * tc.scaleX.v
  const py = tc.y.v + (c.y || 0) * tc.scaleY.v
  const rr = c.radius * 0.5 * ((tc.scaleX.v < 0 ? -tc.scaleX.v : tc.scaleX.v) + (tc.scaleY.v < 0 ? -tc.scaleY.v : tc.scaleY.v))

  // Edge normals
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const ex = v[j].x - v[i].x
    const ey = v[j].y - v[i].y
    const nx = -ey, ny = ex
    const nlen = Math.hypot(nx, ny)

    let minP = Infinity, maxP = -Infinity
    for (let k = 0; k < n; k++) {
      const p = nx * v[k].x + ny * v[k].y
      if (p < minP) minP = p
      if (p > maxP) maxP = p
    }
    const centerProj = nx * px + ny * py
    const minC = centerProj - rr * nlen
    const maxC = centerProj + rr * nlen
    if (maxP < minC || maxC < minP) return false
  }

  // Closest vertex axis
  let bestDx = 0, bestDy = 0, bestD2 = Infinity
  for (let i = 0; i < n; i++) {
    const dx = px - v[i].x
    const dy = py - v[i].y
    const d2 = dx * dx + dy * dy
    if (d2 < bestD2) { bestD2 = d2; bestDx = dx; bestDy = dy }
  }
  if (bestD2 === 0) return true
  const nx = bestDx, ny = bestDy
  const nlen = Math.hypot(nx, ny)

  let minP = Infinity, maxP = -Infinity
  for (let i = 0; i < n; i++) {
    const p = nx * v[i].x + ny * v[i].y
    if (p < minP) minP = p
    if (p > maxP) maxP = p
  }
  const centerProj = nx * px + ny * py
  const minC = centerProj - rr * nlen
  const maxC = centerProj + rr * nlen
  return !(maxP < minC || maxC < minP)
}

// Polygon–Rect (SAT: polygon edges + rect two axes)
function checkPolyRectCollision(poly: PolygonCollider, r: RectangleCollider, tr: Transform): boolean {
  const v = poly.vertices; const n = v.length; if (n === 0) return false

  const sx = tr.scaleX.v, sy = tr.scaleY.v
  const cx = tr.x.v + (r.x || 0) * sx
  const cy = tr.y.v + (r.y || 0) * sy
  const hx = (r.width * sx) * 0.5
  const hy = (r.height * sy) * 0.5
  const c = tr.rotation.cos, s = tr.rotation.sin
  const ux = c, uy = s
  const vx = -s, vy = c

  // A) polygon edge normals
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const ex = v[j].x - v[i].x
    const ey = v[j].y - v[i].y
    const nx = -ey, ny = ex

    let minP = Infinity, maxP = -Infinity
    for (let k = 0; k < n; k++) {
      const p = nx * v[k].x + ny * v[k].y
      if (p < minP) minP = p
      if (p > maxP) maxP = p
    }

    const nu = nx * ux + ny * uy
    const nv = nx * vx + ny * vy
    const rRad = (hx * (nu < 0 ? -nu : nu)) + (hy * (nv < 0 ? -nv : nv))
    const cProj = nx * cx + ny * cy
    const minR = cProj - rRad
    const maxR = cProj + rRad
    if (maxP < minR || maxR < minP) return false
  }

  // B) rect axes u, v
  // axis u
  {
    const nx = ux, ny = uy
    let minP = Infinity, maxP = -Infinity
    for (let i = 0; i < n; i++) {
      const p = nx * v[i].x + ny * v[i].y
      if (p < minP) minP = p
      if (p > maxP) maxP = p
    }
    const cProj = nx * cx + ny * cy
    const minR = cProj - hx
    const maxR = cProj + hx
    if (maxP < minR || maxR < minP) return false
  }
  // axis v
  {
    const nx = vx, ny = vy
    let minP = Infinity, maxP = -Infinity
    for (let i = 0; i < n; i++) {
      const p = nx * v[i].x + ny * v[i].y
      if (p < minP) minP = p
      if (p > maxP) maxP = p
    }
    const cProj = nx * cx + ny * cy
    const minR = cProj - hy
    const maxR = cProj + hy
    if (maxP < minR || maxR < minP) return false
  }

  return true
}

// =====================================================================================
// Ellipse interactions — GJK (scalar-only, no allocations)
// =====================================================================================

// Global scratch for support output (no object creation)
let _sx = 0, _sy = 0  // support result x,y

function setSupportCircle(dx: number, dy: number, cx: number, cy: number, r: number) {
  const len = Math.hypot(dx, dy)
  if (len === 0) { _sx = cx; _sy = cy; return }
  const inv = 1 / len
  _sx = cx + dx * inv * r
  _sy = cy + dy * inv * r
}

function setSupportOBB(
  dx: number, dy: number,
  cx: number, cy: number, ux: number, uy: number, vx: number, vy: number, hx: number, hy: number
) {
  const du = dx * ux + dy * uy
  const dv = dx * vx + dy * vy
  const sx = du >= 0 ? 1 : -1
  const sy = dv >= 0 ? 1 : -1
  _sx = cx + ux * hx * sx + vx * hy * sy
  _sy = cy + uy * hx * sx + vy * hy * sy
}

function setSupportEllipse(
  dx: number, dy: number,
  cx: number, cy: number, ux: number, uy: number, vx: number, vy: number, rx: number, ry: number
) {
  const du = dx * ux + dy * uy
  const dv = dx * vx + dy * vy
  const rxx = rx * rx, ryy = ry * ry
  const mx = du * (ux * rxx) + dv * (vx * ryy)
  const my = du * (uy * rxx) + dv * (vy * ryy)
  const m = Math.hypot(mx, my)
  if (m === 0) { _sx = cx; _sy = cy; return }
  const inv = 1 / m
  _sx = cx + mx * inv
  _sy = cy + my * inv
}

function setSupportPoly(dx: number, dy: number, verts: Point[]) {
  let best = 0, bestDot = -Infinity
  for (let i = 0, n = verts.length; i < n; i++) {
    const vx = verts[i].x, vy = verts[i].y
    const d = dx * vx + dy * vy
    if (d > bestDot) { bestDot = d; best = i }
  }
  _sx = verts[best].x
  _sy = verts[best].y
}

// GJK core — returns true if intersection. Uses scalar-only simplex.
function gjkIntersects(getSupportA: (dx: number, dy: number) => void,
  getSupportB: (dx: number, dy: number) => void): boolean {
  let dx = 1, dy = 0

  // simplex points (up to 3)
  let ax = 0, ay = 0, bx = 0, by = 0, cx = 0, cy = 0
  let n = 0

  function addPoint() {
    // p = supportA(d) - supportB(-d)
    getSupportA(dx, dy); const pax = _sx, pay = _sy
    getSupportB(-dx, -dy); const pbx = _sx, pby = _sy
    const px = pax - pbx, py = pay - pby
    if (n === 0) { ax = px; ay = py }
    else if (n === 1) { bx = px; by = py }
    else { cx = px; cy = py }
    n++
  }

  addPoint()
  dx = -ax; dy = -ay

  for (let iter = 0; iter < 20; iter++) {
    addPoint()

    const lx = (n === 1) ? ax : (n === 2 ? bx : cx)
    const ly = (n === 1) ? ay : (n === 2 ? by : cy)
    if (lx * dx + ly * dy <= 0) return false

    if (n === 2) {
      const abx = bx - ax, aby = by - ay
      const aox = -ax, aoy = -ay
      // normal toward origin
      let nx = aby, ny = -abx
      if (nx * aox + ny * aoy < 0) { nx = -nx; ny = -ny }
      dx = nx; dy = ny
    } else if (n === 3) {
      const abx = bx - ax, aby = by - ay
      const bcx = cx - bx, bcy = cy - by
      const cax = ax - cx, cay = ay - cy

      const aoX = -ax, aoY = -ay
      const boX = -bx, boY = -by
      const coX = -cx, coY = -cy

      const abnX = aby, abnY = -abx
      const bcnX = bcy, bcnY = -bcx
      const canX = cay, canY = -cax

      const abSide = (abnX * aoX + abnY * aoY) > 0
      const bcSide = (bcnX * boX + bcnY * boY) > 0
      const caSide = (canX * coX + canY * coY) > 0

      if (!abSide) { cx = 0; cy = 0; n = 2; dx = abnX; dy = abnY; continue }
      if (!bcSide) { ax = bx; ay = by; bx = cx; by = cy; cx = 0; cy = 0; n = 2; dx = bcnX; dy = bcnY; continue }
      if (!caSide) { bx = ax; by = ay; ax = cx; ay = cy; cx = 0; cy = 0; n = 2; dx = canX; dy = canY; continue }

      return true
    }
  }
  return true
}

// Ellipse–Rect via GJK
function checkEllipseRectCollision(
  e: EllipseCollider, te: Transform,
  r: RectangleCollider, tr: Transform
): boolean {
  const esx = te.scaleX.v, esy = te.scaleY.v
  const ecx = te.x.v + (e.x || 0) * esx
  const ecy = te.y.v + (e.y || 0) * esy
  const erx = (e.width * esx) * 0.5
  const ery = (e.height * esy) * 0.5
  const ecs = te.rotation.cos, esn = te.rotation.sin
  const eux = ecs, euy = esn
  const evx = -esn, evy = ecs

  const rsx = tr.scaleX.v, rsy = tr.scaleY.v
  const rcx = tr.x.v + (r.x || 0) * rsx
  const rcy = tr.y.v + (r.y || 0) * rsy
  const rhx = (r.width * rsx) * 0.5
  const rhy = (r.height * rsy) * 0.5
  const rcs = tr.rotation.cos, rsn = tr.rotation.sin
  const rux = rcs, ruy = rsn
  const rvx = -rsn, rvy = rcs

  const suppA = (dx: number, dy: number) => setSupportEllipse(dx, dy, ecx, ecy, eux, euy, evx, evy, erx, ery)
  const suppB = (dx: number, dy: number) => setSupportOBB(dx, dy, rcx, rcy, rux, ruy, rvx, rvy, rhx, rhy)
  return gjkIntersects(suppA, suppB)
}

// Ellipse–Circle via GJK
function checkEllipseCircleCollision(
  e: EllipseCollider, te: Transform,
  c: CircleCollider, tc: Transform
): boolean {
  const esx = te.scaleX.v, esy = te.scaleY.v
  const ecx = te.x.v + (e.x || 0) * esx
  const ecy = te.y.v + (e.y || 0) * esy
  const erx = (e.width * esx) * 0.5
  const ery = (e.height * esy) * 0.5
  const ecs = te.rotation.cos, esn = te.rotation.sin
  const eux = ecs, euy = esn
  const evx = -esn, evy = ecs

  const ccx = tc.x.v + (c.x || 0) * tc.scaleX.v
  const ccy = tc.y.v + (c.y || 0) * tc.scaleY.v
  const rr = c.radius * 0.5 * ((tc.scaleX.v < 0 ? -tc.scaleX.v : tc.scaleX.v) + (tc.scaleY.v < 0 ? -tc.scaleY.v : tc.scaleY.v))

  const suppA = (dx: number, dy: number) => setSupportEllipse(dx, dy, ecx, ecy, eux, euy, evx, evy, erx, ery)
  const suppB = (dx: number, dy: number) => setSupportCircle(dx, dy, ccx, ccy, rr)
  return gjkIntersects(suppA, suppB)
}

// Ellipse–Ellipse via GJK
function checkEllipseEllipseCollision(
  a: EllipseCollider, ta: Transform,
  b: EllipseCollider, tb: Transform
): boolean {
  const asx = ta.scaleX.v, asy = ta.scaleY.v
  const acx = ta.x.v + (a.x || 0) * asx
  const acy = ta.y.v + (a.y || 0) * asy
  const arx = (a.width * asx) * 0.5
  const ary = (a.height * asy) * 0.5
  const acs = ta.rotation.cos, asn = ta.rotation.sin
  const aux = acs, auy = asn
  const avx = -asn, avy = acs

  const bsx = tb.scaleX.v, bsy = tb.scaleY.v
  const bcx = tb.x.v + (b.x || 0) * bsx
  const bcy = tb.y.v + (b.y || 0) * bsy
  const brx = (b.width * bsx) * 0.5
  const bry = (b.height * bsy) * 0.5
  const bcs = tb.rotation.cos, bsn = tb.rotation.sin
  const bux = bcs, buy = bsn
  const bvx = -bsn, bvy = bcs

  const suppA = (dx: number, dy: number) => setSupportEllipse(dx, dy, acx, acy, aux, auy, avx, avy, arx, ary)
  const suppB = (dx: number, dy: number) => setSupportEllipse(dx, dy, bcx, bcy, bux, buy, bvx, bvy, brx, bry)
  return gjkIntersects(suppA, suppB)
}

// Polygon–Ellipse via GJK
function checkPolyEllipseCollision(poly: PolygonCollider, e: EllipseCollider, te: Transform): boolean {
  const esx = te.scaleX.v, esy = te.scaleY.v
  const ecx = te.x.v + (e.x || 0) * esx
  const ecy = te.y.v + (e.y || 0) * esy
  const erx = (e.width * esx) * 0.5
  const ery = (e.height * esy) * 0.5
  const ecs = te.rotation.cos, esn = te.rotation.sin
  const eux = ecs, euy = esn
  const evx = -esn, evy = ecs

  const suppA = (dx: number, dy: number) => setSupportPoly(dx, dy, poly.vertices)
  const suppB = (dx: number, dy: number) => setSupportEllipse(dx, dy, ecx, ecy, eux, euy, evx, evy, erx, ery)
  return gjkIntersects(suppA, suppB)
}

// =====================================================================================
// Dispatcher
// =====================================================================================

export function checkCollision(ca: Collider, ta: Transform, cb: Collider, tb: Transform): boolean {
  // Rectangle–Rectangle
  if (ca.type === ColliderType.Rectangle && cb.type === ColliderType.Rectangle)
    return checkRectRectCollision(ca as RectangleCollider, ta, cb as RectangleCollider, tb)

  // Circle–Circle
  if (ca.type === ColliderType.Circle && cb.type === ColliderType.Circle)
    return checkCircleCircleCollision(ca as CircleCollider, ta, cb as CircleCollider, tb)

  // Rect–Circle (both orders)
  if (ca.type === ColliderType.Rectangle && cb.type === ColliderType.Circle)
    return checkRectCircleCollision(ca as RectangleCollider, ta, cb as CircleCollider, tb)
  if (ca.type === ColliderType.Circle && cb.type === ColliderType.Rectangle)
    return checkRectCircleCollision(cb as RectangleCollider, tb, ca as CircleCollider, ta)

  // Polygon–Polygon
  if (ca.type === ColliderType.Polygon && cb.type === ColliderType.Polygon)
    return checkPolyPolyCollision(ca as PolygonCollider, cb as PolygonCollider)

  // Polygon–Circle (both orders)
  if (ca.type === ColliderType.Polygon && cb.type === ColliderType.Circle)
    return checkPolyCircleCollision(ca as PolygonCollider, cb as CircleCollider, tb)
  if (ca.type === ColliderType.Circle && cb.type === ColliderType.Polygon)
    return checkPolyCircleCollision(cb as PolygonCollider, ca as CircleCollider, ta)

  // Polygon–Rect (both orders)
  if (ca.type === ColliderType.Polygon && cb.type === ColliderType.Rectangle)
    return checkPolyRectCollision(ca as PolygonCollider, cb as RectangleCollider, tb)
  if (ca.type === ColliderType.Rectangle && cb.type === ColliderType.Polygon)
    return checkPolyRectCollision(cb as PolygonCollider, ca as RectangleCollider, ta)

  // Ellipse interactions via GJK
  if (ca.type === ColliderType.Ellipse && cb.type === ColliderType.Rectangle)
    return checkEllipseRectCollision(ca as EllipseCollider, ta, cb as RectangleCollider, tb)
  if (ca.type === ColliderType.Rectangle && cb.type === ColliderType.Ellipse)
    return checkEllipseRectCollision(cb as EllipseCollider, tb, ca as RectangleCollider, ta)

  if (ca.type === ColliderType.Ellipse && cb.type === ColliderType.Circle)
    return checkEllipseCircleCollision(ca as EllipseCollider, ta, cb as CircleCollider, tb)
  if (ca.type === ColliderType.Circle && cb.type === ColliderType.Ellipse)
    return checkEllipseCircleCollision(cb as EllipseCollider, tb, ca as CircleCollider, ta)

  if (ca.type === ColliderType.Ellipse && cb.type === ColliderType.Ellipse)
    return checkEllipseEllipseCollision(ca as EllipseCollider, ta, cb as EllipseCollider, tb)

  if (ca.type === ColliderType.Polygon && cb.type === ColliderType.Ellipse)
    return checkPolyEllipseCollision(ca as PolygonCollider, cb as EllipseCollider, tb)
  if (ca.type === ColliderType.Ellipse && cb.type === ColliderType.Polygon)
    return checkPolyEllipseCollision(cb as PolygonCollider, ca as EllipseCollider, ta)

  return false
}
