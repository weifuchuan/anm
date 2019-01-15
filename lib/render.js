import { vnodeToDomNode } from './vnode';
export function render(vnode, container, callback) {
    vnodeToDomNode(vnode);
    container.appendChild(vnode.domNode);
}
//# sourceMappingURL=render.js.map