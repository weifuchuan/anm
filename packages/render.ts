import { ComponentVNodeType, VNode } from "./types";
import { vnodeToDomNode } from "./vnode";
import { patch, unmountRecursively } from "./patchs";

export function render(vnode: VNode, container: Element, callback?: Function) {
  if ((container as any)._vnode) {
    const old: VNode = (container as any)._vnode;
    if (
      old.vtype === "component" &&
      vnode.vtype === "component" &&
      (old.component as ComponentVNodeType).original ===
        (vnode.component as ComponentVNodeType).original
    ) {
      if (!vnode.rendered) {
        vnode.rendered = (vnode.component as ComponentVNodeType)(vnode.props);
      }
      patch(old, vnode.rendered);
      callback && callback();
      return;
    }
    unmountRecursively(old);
    container.removeChild(old.domNode!);
  }
  vnodeToDomNode(vnode);
  container.appendChild(vnode.domNode!);
  callback && callback();
}
