import { ColliderType } from './colliders';
// =====================================================================================
// Utilities (scalar-only, no allocations)
// =====================================================================================
const abs = (v) => (v < 0 ? -v : v);
// =====================================================================================
// OBB helpers (scalar-only)
// =====================================================================================
function obbRadiusOnAxis(Lx, Ly, ux, uy, vx, vy, hx, hy) {
    // hx, hy must be >= 0; project axis onto OBB's local axes and scale by half extents.
    const Lu = Lx * ux + Ly * uy;
    const Lv = Lx * vx + Ly * vy;
    const a = hx * (Lu < 0 ? -Lu : Lu);
    const b = hy * (Lv < 0 ? -Lv : Lv);
    return a + b;
}
function axisSeparates(Lx, Ly, dx, dy, aux, auy, avx, avy, ahx, ahy, bux, buy, bvx, bvy, bhx, bhy) {
    const dist = dx * Lx + dy * Ly;
    const ad = dist < 0 ? -dist : dist;
    const rA = obbRadiusOnAxis(Lx, Ly, aux, auy, avx, avy, ahx, ahy);
    const rB = obbRadiusOnAxis(Lx, Ly, bux, buy, bvx, bvy, bhx, bhy);
    return ad > (rA + rB);
}
// =====================================================================================
// Rectangle–Rectangle (OBB–OBB) — SAT with 4 axes (no allocations)
// =====================================================================================
function checkRectRectCollision(ca, ta, cb, tb) {
    // A frame (half extents must be non-negative)
    const asx = ta.scaleX.v, asy = ta.scaleY.v;
    const ahx = abs(ca.width * asx) * 0.5;
    const ahy = abs(ca.height * asy) * 0.5;
    const cA = ta.rotation.cos, sA = ta.rotation.sin;
    const aux = cA, auy = sA;
    const avx = -sA, avy = cA;
    // apply rotated local offset for center
    const aox = (ca.x || 0) * asx;
    const aoy = (ca.y || 0) * asy;
    const ax = ta.x.v + aux * aox + avx * aoy;
    const ay = ta.y.v + auy * aox + avy * aoy;
    // B frame
    const bsx = tb.scaleX.v, bsy = tb.scaleY.v;
    const bhx = abs(cb.width * bsx) * 0.5;
    const bhy = abs(cb.height * bsy) * 0.5;
    const cB = tb.rotation.cos, sB = tb.rotation.sin;
    const bux = cB, buy = sB;
    const bvx = -sB, bvy = cB;
    const box = (cb.x || 0) * bsx;
    const boy = (cb.y || 0) * bsy;
    const bx = tb.x.v + bux * box + bvx * boy;
    const by = tb.y.v + buy * box + bvy * boy;
    // Fast axis-aligned branch if both rotations are zero
    const rotA = ta.rotation.v, rotB = tb.rotation.v;
    if ((rotA === 0 || rotA === 0.0) && (rotB === 0 || rotB === 0.0)) {
        const dx0 = bx - ax;
        const adx0 = dx0 < 0 ? -dx0 : dx0;
        const dy0 = by - ay;
        const ady0 = dy0 < 0 ? -dy0 : dy0;
        return (adx0 <= ahx + bhx) && (ady0 <= ahy + bhy);
    }
    const dx = bx - ax;
    const dy = by - ay;
    if (axisSeparates(aux, auy, dx, dy, aux, auy, avx, avy, ahx, ahy, bux, buy, bvx, bvy, bhx, bhy))
        return false;
    if (axisSeparates(avx, avy, dx, dy, aux, auy, avx, avy, ahx, ahy, bux, buy, bvx, bvy, bhx, bhy))
        return false;
    if (axisSeparates(bux, buy, dx, dy, aux, auy, avx, avy, ahx, ahy, bux, buy, bvx, bvy, bhx, bhy))
        return false;
    if (axisSeparates(bvx, bvy, dx, dy, aux, auy, avx, avy, ahx, ahy, bux, buy, bvx, bvy, bhx, bhy))
        return false;
    return true;
}
// =====================================================================================
// Circle–Circle (no allocations)
// =====================================================================================
function circleScaledRadius(c, t) {
    const sx = abs(t.scaleX.v), sy = abs(t.scaleY.v);
    return c.radius * (sx > sy ? sx : sy); // conservative
}
function circleCenter(c, t, out) {
    // out is a pre-existing struct from caller (do not allocate new)
    const sx = t.scaleX.v, sy = t.scaleY.v;
    const cos = t.rotation.cos, sin = t.rotation.sin;
    const ux = cos, uy = sin;
    const vx = -sin, vy = cos;
    const ox = (c.x || 0) * sx;
    const oy = (c.y || 0) * sy;
    out.x = t.x.v + ux * ox + vx * oy;
    out.y = t.y.v + uy * ox + vy * oy;
}
function checkCircleCircleCollision(ca, ta, cb, tb) {
    // reuse stack scalars; no objects created here
    const A = { x: 0, y: 0 };
    const B = { x: 0, y: 0 };
    circleCenter(ca, ta, A);
    circleCenter(cb, tb, B);
    const ra = circleScaledRadius(ca, ta);
    const rb = circleScaledRadius(cb, tb);
    const dx = B.x - A.x, dy = B.y - A.y;
    const r = ra + rb;
    return (dx * dx + dy * dy) <= r * r;
}
// =====================================================================================
// Rect–Circle (no allocations)
// =====================================================================================
function checkRectCircleCollision(r, tr, c, tc) {
    // Rect frame
    const rsx = tr.scaleX.v, rsy = tr.scaleY.v;
    const rhx = abs(r.width * rsx) * 0.5;
    const rhy = abs(r.height * rsy) * 0.5;
    const rc = tr.rotation.cos, rs = tr.rotation.sin;
    const rux = rc, ruy = rs;
    const rvx = -rs, rvy = rc;
    const rox = (r.x || 0) * rsx;
    const roy = (r.y || 0) * rsy;
    const rcx = tr.x.v + rux * rox + rvx * roy;
    const rcy = tr.y.v + ruy * rox + rvy * roy;
    // Circle center + radius
    const C = { x: 0, y: 0 };
    circleCenter(c, tc, C);
    const rr = circleScaledRadius(c, tc);
    // Project center delta onto rect local axes and clamp
    const dx = C.x - rcx, dy = C.y - rcy;
    const qx = dx * rux + dy * ruy;
    const qy = dx * rvx + dy * rvy;
    const clx = qx < -rhx ? -rhx : (qx > rhx ? rhx : qx);
    const cly = qy < -rhy ? -rhy : (qy > rhy ? rhy : qy);
    const ddx = qx - clx;
    const ddy = qy - cly;
    return (ddx * ddx + ddy * ddy) <= rr * rr;
}
// =====================================================================================
// Polygon helpers — SAT (no allocations; polygons are in WORLD space)
// =====================================================================================
function checkPolyPolyCollision(a, b) {
    const av = a.vertices, bv = b.vertices;
    let n = av.length;
    if (n === 0)
        return false;
    let m = bv.length;
    if (m === 0)
        return false;
    // Edges of A
    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const ex = av[j].x - av[i].x;
        const ey = av[j].y - av[i].y;
        const nx = -ey, ny = ex;
        let minA = Infinity, maxA = -Infinity;
        for (let k = 0; k < n; k++) {
            const p = nx * av[k].x + ny * av[k].y;
            if (p < minA)
                minA = p;
            if (p > maxA)
                maxA = p;
        }
        let minB = Infinity, maxB = -Infinity;
        for (let k = 0; k < m; k++) {
            const p = nx * bv[k].x + ny * bv[k].y;
            if (p < minB)
                minB = p;
            if (p > maxB)
                maxB = p;
        }
        if (maxA < minB || maxB < minA)
            return false;
    }
    // Edges of B
    for (let i = 0; i < m; i++) {
        const j = (i + 1) % m;
        const ex = bv[j].x - bv[i].x;
        const ey = bv[j].y - bv[i].y;
        const nx = -ey, ny = ex;
        let minA = Infinity, maxA = -Infinity;
        for (let k = 0; k < n; k++) {
            const p = nx * av[k].x + ny * av[k].y;
            if (p < minA)
                minA = p;
            if (p > maxA)
                maxA = p;
        }
        let minB = Infinity, maxB = -Infinity;
        for (let k = 0; k < m; k++) {
            const p = nx * bv[k].x + ny * bv[k].y;
            if (p < minB)
                minB = p;
            if (p > maxB)
                maxB = p;
        }
        if (maxA < minB || maxB < minA)
            return false;
    }
    return true;
}
function checkPolyCircleCollision(poly, c, tc) {
    const v = poly.vertices;
    const n = v.length;
    if (n === 0)
        return false;
    const PC = { x: 0, y: 0 };
    circleCenter(c, tc, PC);
    const rr = circleScaledRadius(c, tc);
    // Edge normals
    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const ex = v[j].x - v[i].x;
        const ey = v[j].y - v[i].y;
        const nx = -ey, ny = ex;
        const nlen = Math.hypot(nx, ny);
        let minP = Infinity, maxP = -Infinity;
        for (let k = 0; k < n; k++) {
            const p = nx * v[k].x + ny * v[k].y;
            if (p < minP)
                minP = p;
            if (p > maxP)
                maxP = p;
        }
        const centerProj = nx * PC.x + ny * PC.y;
        const minC = centerProj - rr * nlen;
        const maxC = centerProj + rr * nlen;
        if (maxP < minC || maxC < minP)
            return false;
    }
    // Closest-vertex axis
    let bestDx = 0, bestDy = 0, bestD2 = Infinity;
    for (let i = 0; i < n; i++) {
        const dx = PC.x - v[i].x;
        const dy = PC.y - v[i].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < bestD2) {
            bestD2 = d2;
            bestDx = dx;
            bestDy = dy;
        }
    }
    if (bestD2 === 0)
        return true;
    {
        const nx = bestDx, ny = bestDy;
        const nlen = Math.hypot(nx, ny);
        let minP = Infinity, maxP = -Infinity;
        for (let i = 0; i < n; i++) {
            const p = nx * v[i].x + ny * v[i].y;
            if (p < minP)
                minP = p;
            if (p > maxP)
                maxP = p;
        }
        const centerProj = nx * PC.x + ny * PC.y;
        const minC = centerProj - rr * nlen;
        const maxC = centerProj + rr * nlen;
        if (maxP < minC || maxC < minP)
            return false;
    }
    return true;
}
function checkPolyRectCollision(poly, r, tr) {
    const v = poly.vertices;
    const n = v.length;
    if (n === 0)
        return false;
    // Rect frame
    const rsx = tr.scaleX.v, rsy = tr.scaleY.v;
    const rhx = abs(r.width * rsx) * 0.5;
    const rhy = abs(r.height * rsy) * 0.5;
    const rc = tr.rotation.cos, rs = tr.rotation.sin;
    const rux = rc, ruy = rs;
    const rvx = -rs, rvy = rc;
    const rox = (r.x || 0) * rsx;
    const roy = (r.y || 0) * rsy;
    const rcx = tr.x.v + rux * rox + rvx * roy;
    const rcy = tr.y.v + ruy * rox + rvy * roy;
    // A) polygon edge normals
    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const ex = v[j].x - v[i].x;
        const ey = v[j].y - v[i].y;
        const nx = -ey, ny = ex;
        let minP = Infinity, maxP = -Infinity;
        for (let k = 0; k < n; k++) {
            const p = nx * v[k].x + ny * v[k].y;
            if (p < minP)
                minP = p;
            if (p > maxP)
                maxP = p;
        }
        const nu = nx * rux + ny * ruy;
        const nv = nx * rvx + ny * rvy;
        const rRad = (rhx * (nu < 0 ? -nu : nu)) + (rhy * (nv < 0 ? -nv : nv));
        const cProj = nx * rcx + ny * rcy;
        const minR = cProj - rRad;
        const maxR = cProj + rRad;
        if (maxP < minR || maxR < minP)
            return false;
    }
    // B) rect axis u
    {
        const nx = rux, ny = ruy;
        let minP = Infinity, maxP = -Infinity;
        for (let i = 0; i < n; i++) {
            const p = nx * v[i].x + ny * v[i].y;
            if (p < minP)
                minP = p;
            if (p > maxP)
                maxP = p;
        }
        const cProj = nx * rcx + ny * rcy;
        const minR = cProj - rhx;
        const maxR = cProj + rhx;
        if (maxP < minR || maxR < minP)
            return false;
    }
    // B) rect axis v
    {
        const nx = rvx, ny = rvy;
        let minP = Infinity, maxP = -Infinity;
        for (let i = 0; i < n; i++) {
            const p = nx * v[i].x + ny * v[i].y;
            if (p < minP)
                minP = p;
            if (p > maxP)
                maxP = p;
        }
        const cProj = nx * rcx + ny * rcy;
        const minR = cProj - rhy;
        const maxR = cProj + rhy;
        if (maxP < minR || maxR < minP)
            return false;
    }
    return true;
}
// =====================================================================================
// GJK (no allocations: global scratch + selectable supports)
// =====================================================================================
// Global scratch for support result
let _sx = 0, _sy = 0;
// Support selectors
var SupportType;
(function (SupportType) {
    SupportType[SupportType["None"] = 0] = "None";
    SupportType[SupportType["Ellipse"] = 1] = "Ellipse";
    SupportType[SupportType["OBB"] = 2] = "OBB";
    SupportType[SupportType["Circle"] = 3] = "Circle";
    SupportType[SupportType["Poly"] = 4] = "Poly";
})(SupportType || (SupportType = {}));
let _supportAType = 0 /* SupportType.None */;
let _supportBType = 0 /* SupportType.None */;
// A-shape params
let _Acx = 0, _Acy = 0, _Aux = 0, _Auy = 0, _Avx = 0, _Avy = 0, _Arx = 0, _Ary = 0, _Ahx = 0, _Ahy = 0, _Arr = 0;
let _Apoly = null;
// B-shape params
let _Bcx = 0, _Bcy = 0, _Bux = 0, _Buy = 0, _Bvx = 0, _Bvy = 0, _Brx = 0, _Bry = 0, _Bhx = 0, _Bhy = 0, _Brr = 0;
let _Bpoly = null;
function setSupportCircle(dx, dy, cx, cy, r) {
    const len = Math.hypot(dx, dy);
    if (len === 0) {
        _sx = cx;
        _sy = cy;
        return;
    }
    const inv = 1 / len;
    _sx = cx + dx * inv * r;
    _sy = cy + dy * inv * r;
}
function setSupportOBB(dx, dy, cx, cy, ux, uy, vx, vy, hx, hy) {
    const du = dx * ux + dy * uy;
    const dv = dx * vx + dy * vy;
    const sx = du >= 0 ? 1 : -1;
    const sy = dv >= 0 ? 1 : -1;
    _sx = cx + ux * hx * sx + vx * hy * sy;
    _sy = cy + uy * hx * sx + vy * hy * sy;
}
function setSupportEllipse(dx, dy, cx, cy, ux, uy, vx, vy, rx, ry) {
    const du = dx * ux + dy * uy;
    const dv = dx * vx + dy * vy;
    const denom = Math.hypot(rx * du, ry * dv);
    if (denom === 0) {
        _sx = cx;
        _sy = cy;
        return;
    }
    const kU = (rx * rx * du) / denom;
    const kV = (ry * ry * dv) / denom;
    _sx = cx + kU * ux + kV * vx;
    _sy = cy + kU * uy + kV * vy;
}
function setSupportPoly(dx, dy, verts) {
    let best = 0, bestDot = -Infinity;
    for (let i = 0, n = verts.length; i < n; i++) {
        const vx = verts[i].x, vy = verts[i].y;
        const d = dx * vx + dy * vy;
        if (d > bestDot) {
            bestDot = d;
            best = i;
        }
    }
    _sx = verts[best].x;
    _sy = verts[best].y;
}
function supportA(dx, dy) {
    if (_supportAType === 1 /* SupportType.Ellipse */)
        setSupportEllipse(dx, dy, _Acx, _Acy, _Aux, _Auy, _Avx, _Avy, _Arx, _Ary);
    else if (_supportAType === 2 /* SupportType.OBB */)
        setSupportOBB(dx, dy, _Acx, _Acy, _Aux, _Auy, _Avx, _Avy, _Ahx, _Ahy);
    else if (_supportAType === 3 /* SupportType.Circle */)
        setSupportCircle(dx, dy, _Acx, _Acy, _Arr);
    else if (_supportAType === 4 /* SupportType.Poly */ && _Apoly)
        setSupportPoly(dx, dy, _Apoly);
    else {
        _sx = 0;
        _sy = 0;
    }
}
function supportB(dx, dy) {
    if (_supportBType === 1 /* SupportType.Ellipse */)
        setSupportEllipse(dx, dy, _Bcx, _Bcy, _Bux, _Buy, _Bvx, _Bvy, _Brx, _Bry);
    else if (_supportBType === 2 /* SupportType.OBB */)
        setSupportOBB(dx, dy, _Bcx, _Bcy, _Bux, _Buy, _Bvx, _Bvy, _Bhx, _Bhy);
    else if (_supportBType === 3 /* SupportType.Circle */)
        setSupportCircle(dx, dy, _Bcx, _Bcy, _Brr);
    else if (_supportBType === 4 /* SupportType.Poly */ && _Bpoly)
        setSupportPoly(dx, dy, _Bpoly);
    else {
        _sx = 0;
        _sy = 0;
    }
}
// GJK core — returns true if intersection
function gjkIntersectsNoAlloc() {
    let dx = 1, dy = 0;
    // simplex points (up to 3)
    let ax = 0, ay = 0, bx = 0, by = 0, cx = 0, cy = 0;
    let n = 0;
    function addPoint() {
        // p = supportA(d) - supportB(-d)
        supportA(dx, dy);
        const pax = _sx, pay = _sy;
        supportB(-dx, -dy);
        const pbx = _sx, pby = _sy;
        const px = pax - pbx, py = pay - pby;
        if (n === 0) {
            ax = px;
            ay = py;
        }
        else if (n === 1) {
            bx = px;
            by = py;
        }
        else {
            cx = px;
            cy = py;
        }
        n++;
    }
    addPoint();
    dx = -ax;
    dy = -ay;
    for (let iter = 0; iter < 20; iter++) {
        addPoint();
        const lx = (n === 1) ? ax : (n === 2 ? bx : cx);
        const ly = (n === 1) ? ay : (n === 2 ? by : cy);
        if (lx * dx + ly * dy <= 0)
            return false;
        if (n === 2) {
            const abx = bx - ax, aby = by - ay;
            const aox = -ax, aoy = -ay;
            // normal toward origin
            let nx = aby, ny = -abx;
            if (nx * aox + ny * aoy < 0) {
                nx = -nx;
                ny = -ny;
            }
            dx = nx;
            dy = ny;
        }
        else if (n === 3) {
            const abx = bx - ax, aby = by - ay;
            const bcx = cx - bx, bcy = cy - by;
            const cax = ax - cx, cay = ay - cy;
            const aoX = -ax, aoY = -ay;
            const boX = -bx, boY = -by;
            const coX = -cx, coY = -cy;
            const abnX = aby, abnY = -abx;
            const bcnX = bcy, bcnY = -bcx;
            const canX = cay, canY = -cax;
            const abSide = (abnX * aoX + abnY * aoY) > 0;
            const bcSide = (bcnX * boX + bcnY * boY) > 0;
            const caSide = (canX * coX + canY * coY) > 0;
            if (!abSide) {
                cx = 0;
                cy = 0;
                n = 2;
                dx = abnX;
                dy = abnY;
                continue;
            }
            if (!bcSide) {
                ax = bx;
                ay = by;
                bx = cx;
                by = cy;
                cx = 0;
                cy = 0;
                n = 2;
                dx = bcnX;
                dy = bcnY;
                continue;
            }
            if (!caSide) {
                bx = ax;
                by = ay;
                ax = cx;
                ay = cy;
                cx = 0;
                cy = 0;
                n = 2;
                dx = canX;
                dy = canY;
                continue;
            }
            return true;
        }
    }
    // Do not assert intersection when iteration cap is hit
    return false;
}
// =====================================================================================
// Ellipse interactions via GJK (no allocations)
// =====================================================================================
function checkEllipseRectCollision(e, te, r, tr) {
    // A = Ellipse
    const esx = te.scaleX.v, esy = te.scaleY.v;
    _Arx = abs(e.width * esx) * 0.5;
    _Ary = abs(e.height * esy) * 0.5;
    const ecs = te.rotation.cos, esn = te.rotation.sin;
    _Aux = ecs;
    _Auy = esn;
    _Avx = -esn;
    _Avy = ecs;
    const eox = (e.x || 0) * esx, eoy = (e.y || 0) * esy;
    _Acx = te.x.v + _Aux * eox + _Avx * eoy;
    _Acy = te.y.v + _Auy * eox + _Avy * eoy;
    _supportAType = 1 /* SupportType.Ellipse */;
    _Apoly = null;
    // B = OBB (rect)
    const rsx = tr.scaleX.v, rsy = tr.scaleY.v;
    _Bhx = abs(r.width * rsx) * 0.5;
    _Bhy = abs(r.height * rsy) * 0.5;
    const rcs = tr.rotation.cos, rsn = tr.rotation.sin;
    _Bux = rcs;
    _Buy = rsn;
    _Bvx = -rsn;
    _Bvy = rcs;
    const rox = (r.x || 0) * rsx, roy = (r.y || 0) * rsy;
    _Bcx = tr.x.v + _Bux * rox + _Bvx * roy;
    _Bcy = tr.y.v + _Buy * rox + _Bvy * roy;
    _supportBType = 2 /* SupportType.OBB */;
    _Bpoly = null;
    return gjkIntersectsNoAlloc();
}
function checkEllipseCircleCollision(e, te, c, tc) {
    // A = Ellipse
    const esx = te.scaleX.v, esy = te.scaleY.v;
    _Arx = abs(e.width * esx) * 0.5;
    _Ary = abs(e.height * esy) * 0.5;
    const ecs = te.rotation.cos, esn = te.rotation.sin;
    _Aux = ecs;
    _Auy = esn;
    _Avx = -esn;
    _Avy = ecs;
    const eox = (e.x || 0) * esx, eoy = (e.y || 0) * esy;
    _Acx = te.x.v + _Aux * eox + _Avx * eoy;
    _Acy = te.y.v + _Auy * eox + _Avy * eoy;
    _supportAType = 1 /* SupportType.Ellipse */;
    _Apoly = null;
    // B = Circle
    const CC = { x: 0, y: 0 };
    circleCenter(c, tc, CC);
    _Bcx = CC.x;
    _Bcy = CC.y;
    _Brr = circleScaledRadius(c, tc);
    _supportBType = 3 /* SupportType.Circle */;
    _Bpoly = null;
    return gjkIntersectsNoAlloc();
}
function checkEllipseEllipseCollision(a, ta, b, tb) {
    // A
    const asx = ta.scaleX.v, asy = ta.scaleY.v;
    _Arx = abs(a.width * asx) * 0.5;
    _Ary = abs(a.height * asy) * 0.5;
    const acs = ta.rotation.cos, asn = ta.rotation.sin;
    _Aux = acs;
    _Auy = asn;
    _Avx = -asn;
    _Avy = acs;
    const aox = (a.x || 0) * asx, aoy = (a.y || 0) * asy;
    _Acx = ta.x.v + _Aux * aox + _Avx * aoy;
    _Acy = ta.y.v + _Auy * aox + _Avy * aoy;
    _supportAType = 1 /* SupportType.Ellipse */;
    _Apoly = null;
    // B
    const bsx = tb.scaleX.v, bsy = tb.scaleY.v;
    _Brx = abs(b.width * bsx) * 0.5;
    _Bry = abs(b.height * bsy) * 0.5;
    const bcs = tb.rotation.cos, bsn = tb.rotation.sin;
    _Bux = bcs;
    _Buy = bsn;
    _Bvx = -bsn;
    _Bvy = bcs;
    const box = (b.x || 0) * bsx, boy = (b.y || 0) * bsy;
    _Bcx = tb.x.v + _Bux * box + _Bvx * boy;
    _Bcy = tb.y.v + _Buy * box + _Bvy * boy;
    _supportBType = 1 /* SupportType.Ellipse */;
    _Bpoly = null;
    return gjkIntersectsNoAlloc();
}
function checkPolyEllipseCollision(poly, e, te) {
    // A = Poly
    _Apoly = poly.vertices;
    _supportAType = 4 /* SupportType.Poly */;
    // B = Ellipse
    const esx = te.scaleX.v, esy = te.scaleY.v;
    _Brx = abs(e.width * esx) * 0.5;
    _Bry = abs(e.height * esy) * 0.5;
    const ecs = te.rotation.cos, esn = te.rotation.sin;
    _Bux = ecs;
    _Buy = esn;
    _Bvx = -esn;
    _Bvy = ecs;
    const eox = (e.x || 0) * esx, eoy = (e.y || 0) * esy;
    _Bcx = te.x.v + _Bux * eox + _Bvx * eoy;
    _Bcy = te.y.v + _Buy * eox + _Bvy * eoy;
    _supportBType = 1 /* SupportType.Ellipse */;
    _Bpoly = null;
    return gjkIntersectsNoAlloc();
}
// =====================================================================================
// Dispatcher (no allocations)
// =====================================================================================
export function checkCollision(ca, ta, cb, tb) {
    // Rectangle–Rectangle
    if (ca.type === ColliderType.Rectangle && cb.type === ColliderType.Rectangle)
        return checkRectRectCollision(ca, ta, cb, tb);
    // Circle–Circle
    if (ca.type === ColliderType.Circle && cb.type === ColliderType.Circle)
        return checkCircleCircleCollision(ca, ta, cb, tb);
    // Rect–Circle (both orders)
    if (ca.type === ColliderType.Rectangle && cb.type === ColliderType.Circle)
        return checkRectCircleCollision(ca, ta, cb, tb);
    if (ca.type === ColliderType.Circle && cb.type === ColliderType.Rectangle)
        return checkRectCircleCollision(cb, tb, ca, ta);
    // Polygon–Polygon
    if (ca.type === ColliderType.Polygon && cb.type === ColliderType.Polygon)
        return checkPolyPolyCollision(ca, cb);
    // Polygon–Circle (both orders)
    if (ca.type === ColliderType.Polygon && cb.type === ColliderType.Circle)
        return checkPolyCircleCollision(ca, cb, tb);
    if (ca.type === ColliderType.Circle && cb.type === ColliderType.Polygon)
        return checkPolyCircleCollision(cb, ca, ta);
    // Polygon–Rect (both orders)
    if (ca.type === ColliderType.Polygon && cb.type === ColliderType.Rectangle)
        return checkPolyRectCollision(ca, cb, tb);
    if (ca.type === ColliderType.Rectangle && cb.type === ColliderType.Polygon)
        return checkPolyRectCollision(cb, ca, ta);
    // Ellipse interactions via GJK
    if (ca.type === ColliderType.Ellipse && cb.type === ColliderType.Rectangle)
        return checkEllipseRectCollision(ca, ta, cb, tb);
    if (ca.type === ColliderType.Rectangle && cb.type === ColliderType.Ellipse)
        return checkEllipseRectCollision(cb, tb, ca, ta);
    if (ca.type === ColliderType.Ellipse && cb.type === ColliderType.Circle)
        return checkEllipseCircleCollision(ca, ta, cb, tb);
    if (ca.type === ColliderType.Circle && cb.type === ColliderType.Ellipse)
        return checkEllipseCircleCollision(cb, tb, ca, ta);
    if (ca.type === ColliderType.Ellipse && cb.type === ColliderType.Ellipse)
        return checkEllipseEllipseCollision(ca, ta, cb, tb);
    if (ca.type === ColliderType.Polygon && cb.type === ColliderType.Ellipse)
        return checkPolyEllipseCollision(ca, cb, tb);
    if (ca.type === ColliderType.Ellipse && cb.type === ColliderType.Polygon)
        return checkPolyEllipseCollision(cb, ca, ta);
    return false;
}
//# sourceMappingURL=check-collision.js.map