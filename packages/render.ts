import { VNode } from './types';
import { vnodeToDomNode } from './vnode';

export function render(vnode: VNode, container: Element, callback?: Function) {
	vnodeToDomNode(vnode);
	container.appendChild(vnode.domNode!);
}
