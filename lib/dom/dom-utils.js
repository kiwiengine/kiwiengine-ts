export function textStroke(target, width, color) {
    let shadow = '';
    for (let i = -width; i <= width; i++) {
        for (let j = -width; j <= width; j++) {
            if (i !== 0 || j !== 0) {
                shadow += `${i}px ${j}px 0 ${color},`;
            }
        }
    }
    shadow = shadow.slice(0, -1); // Remove last comma
    target.style.textShadow = shadow;
    return target;
}
//# sourceMappingURL=dom-utils.js.map