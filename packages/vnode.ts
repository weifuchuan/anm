import { patch } from './patchs';
import {
	isEventAttr,
	nextTick2,
	onEvent,
	setProp,
	setStyle,
	nextTick
} from './kit';
import {
	ComponentVNodeType,
	DOMVNodeType,
	Effect,
	ignoreProps,
	TextVNodeType,
	VNode
} from './types';
import bus from './bus';

const idToVNode: { [id: number]: VNode } = {};

bus.on('unmount', (id: number) => {
	if (idToVNode[id] && idToVNode[id].pendingEffectReturns) {
		idToVNode[id].pendingEffectReturns!.forEach((f) => f());
	}
	delete idToVNode[id];
});

// unkown reason: value of return sometime be undefined when vnode.vtype === 'text',
// it is JS BUG?
export function vnodeToDomNode(vnode: VNode): Node {
	let elem: Node;
	if (vnode.vtype === 'text') {
		elem = document.createTextNode(vnode.component as TextVNodeType);
	} else if (vnode.vtype === 'dom') {
		const e = (elem = document.createElement(
			vnode.component as DOMVNodeType
		));
		for (let name in vnode.props) {
			if (name in ignoreProps) continue;
			if (isEventAttr(name)) {
				onEvent(e, name, vnode.props[name]);
			} else if (name === 'style') {
				for (let style in vnode.props['style']) {
					setStyle(e.style, style, vnode.props['style'][style]);
				}
			} else if (name === 'className' || name === 'class') {
				e.className = vnode.props[name];
			} else if (
				name === 'dangerouslySetInnerHTML' &&
				typeof vnode.props['dangerouslySetInnerHTML'].__html ===
					'string'
			) {
				e.innerHTML = vnode.props['dangerouslySetInnerHTML'].__html;
			} else {
				setProp(e, name, vnode.props[name]);
				// TODO: 支持 SVG
			}
		}
		for (const child of vnode.children!) {
			elem.appendChild(vnodeToDomNode(child));
		}
	} else if (vnode.vtype === 'component') {
		idToVNode[vnode.id!] = vnode;
		const renderedVNode = (vnode.component as ComponentVNodeType)(
			vnode.props
		);
		vnode.rendered = renderedVNode;
		runPendingEffectReturns(vnode);
		elem = vnodeToDomNode(renderedVNode);
		runPendingEffects(vnode);
	} else {
		throw 'invalid type';
	}
	vnode.domNode = elem;
	vnode.props.ref && vnode.props.ref(elem as any);
	(elem as any)._vnode = vnode;
	return vnode.domNode;
}

export function updateVNode(id: number) {
	nextTick(() => {
		if (idToVNode[id] && idToVNode[id].vtype === 'component') {
			const vnode = idToVNode[id];
			if (vnode.domNode) {
				runPendingEffectReturns(vnode);
				const rendered = (vnode.component as ComponentVNodeType)(
					vnode.props
				);
				patch(vnode, rendered);
			}
		}
	});
}

export function addPendingEffect(id: number, effect: Effect) {
	if (idToVNode[id] && idToVNode[id].vtype === 'component') {
		const vnode = idToVNode[id];
		if (!vnode.pendingEffects) {
			vnode.pendingEffects = [];
		}
		vnode.pendingEffects.push(effect);
	}
}

export function runPendingEffects(vnode: VNode | number) {
	if (
		(typeof vnode === 'object' &&
			vnode.vtype === 'component' &&
			idToVNode[vnode.id!]) ||
		(typeof vnode === 'number' &&
			idToVNode[vnode] &&
			idToVNode[vnode].vtype === 'component')
	) {
		vnode = typeof vnode === 'number' ? idToVNode[vnode] : vnode;
		if (vnode.pendingEffects) {
			while (vnode.pendingEffects.length > 0) {
				const effect = vnode.pendingEffects.pop()!;
				const effectReturn = effect();
				if (effectReturn) {
					if (!vnode.pendingEffectReturns) {
						vnode.pendingEffectReturns = [];
					}
					vnode.pendingEffectReturns!.push(effectReturn);
				}
			}
		}
	}
}

export function runPendingEffectReturns(vnode: VNode | number) {
	if (
		(typeof vnode === 'object' &&
			vnode.vtype === 'component' &&
			idToVNode[vnode.id!]) ||
		(typeof vnode === 'number' &&
			idToVNode[vnode] &&
			idToVNode[vnode].vtype === 'component')
	) {
		vnode = typeof vnode === 'number' ? idToVNode[vnode] : vnode;
		if (vnode.pendingEffectReturns) {
			while (vnode.pendingEffectReturns.length > 0) {
				const effectReturn = vnode.pendingEffectReturns!.pop()!;
				effectReturn();
			}
		}
	}
}
