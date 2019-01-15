import { vnodeToDomNode } from "./vnode";
import { patch, unmountRecursively } from "./patchs";
export function render(vnode, container, callback) {
    if (container._vnode) {
        const old = container._vnode;
        if (old.vtype === "component" &&
            vnode.vtype === "component" &&
            old.component.original ===
                vnode.component.original) {
            if (!vnode.rendered) {
                vnode.rendered = vnode.component(vnode.props);
            }
            patch(old, vnode.rendered);
            callback && callback();
            return;
        }
        unmountRecursively(old);
        container.removeChild(old.domNode);
    }
    vnodeToDomNode(vnode);
    container.appendChild(vnode.domNode);
    callback && callback();
}
//# sourceMappingURL=render.js.map