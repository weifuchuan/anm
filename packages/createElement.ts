import {
	VNodeType,
	VNode,
	IProps,
	TextVNodeType,
	ComponentVNodeType,
	isVNode
} from './types';
import { getId, endRender,beginRender } from './hooks';
import { isNullOrUndef } from './kit';

export function createElement(
	type: VNodeType,
	props: IProps = {},
	...children: VNode[]
): VNode {
	if (!props) props = {};
	if (props.key && typeof props.key !== 'string')
		props.key = JSON.stringify(props.key);
	const isArr = Array.isArray(props.children);
	if (props.children && !isArr) {
		props.children = [ props.children as VNode ];
	} else if (!props.children) {
		props.children = children;
	}
	props.children = children = (props.children as VNode[])
		.filter((child) => !isNullOrUndef(child))
		.reduce(
			(prev: VNode[], curr) => (
				Array.isArray(curr)
					? prev.push(...(curr as any))
					: prev.push(curr),
				prev
			),
			[]
		);
	let vnode: VNode;
	if (typeof type === 'string') {
		// dom vnode
		vnode = {
			vtype: 'dom',
			component: type,
			children,
			props
		};
	} else if (typeof type === 'function') {
		const id = getId();
		const packType = function(props: any): VNode {
			beginRender(id);
			const rendered = (type as ComponentVNodeType)(props);
			endRender(id);
			return rendered;
		};
		(packType as ComponentVNodeType).original = type;
		vnode = {
			id,
			vtype: 'component',
			component: packType as ComponentVNodeType,
			children,
			props
		};
	} else {
		throw 'invalid type';
	}
	for (let i = 0; i < children.length; i++) {
		if (typeof children[i] === 'string') {
			children[i] = {
				vtype: 'text',
				component: (children[i] as any) as TextVNodeType,
				children: [],
				props: {}
			};
		} else if (
			typeof children[i] === 'boolean' ||
			typeof children[i] === 'number' ||
			typeof children[i] === 'bigint' ||
			typeof children[i] === 'symbol' ||
			typeof children[i] === 'undefined' ||
			!isVNode(children[i])
		) {
			children[i] = {
				vtype: 'text',
				component: (JSON.stringify(children[i]) || '') as TextVNodeType,
				children: [],
				props: {}
			};
		}
		// @ts-ignore
		children[i].parent = vnode;
	}
	// @ts-ignore
	return vnode;
}
