export type VNodeType = 'text' | 'dom' | 'component';
export type TextVNodeType = string;
export type DOMVNodeType = string;
export type ComponentVNodeType<Props extends IProps = IProps> = ((
	props: Readonly<Props>
) => VNode) & {
	original: Function;
};

export type Ref = (elem: Element | null) => void;

export interface Effect {
	(): void | (() => void);
}

export interface IProps {
	children?: VNode | VNode[];
	ref?: Ref;
	key?: string;
	[k: string]: any;
	[k: number]: any;
}

export const ignoreProps: { [key: string]: boolean } = {
	children: true,
	ref: true,
	key: true
};

export interface VNode<Props extends IProps = IProps> {
	vtype: VNodeType;
	component: TextVNodeType | DOMVNodeType | ComponentVNodeType<Props>;
	props: Props;
	domNode?: Node;
	parent?: VNode;
	children?: VNode[];
	// for functional component
	id?: number;
	rendered?: VNode;
	pendingEffects?: Effect[];
	pendingEffectReturns?: (() => void)[];
}

export function isVNode(obj: any): boolean {
	return typeof obj === 'object' && obj.vtype && obj.component;
}
