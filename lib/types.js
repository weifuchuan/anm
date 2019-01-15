export const ignoreProps = {
    children: true,
    ref: true,
    key: true
};
export function isVNode(obj) {
    return typeof obj === 'object' && obj.vtype && obj.component;
}
//# sourceMappingURL=types.js.map