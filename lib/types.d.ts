export declare type VNodeType = 'text' | 'dom' | 'component';
export declare type TextVNodeType = string;
export declare type DOMVNodeType = string;
export declare type ComponentVNodeType<Props extends IProps = IProps> = ((props: Readonly<Props>) => VNode) & {
    original: Function;
};
export declare type Ref = (elem: Element | null) => void;
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
export declare const ignoreProps: {
    [key: string]: boolean;
};
export interface VNode<Props extends IProps = IProps> {
    vtype: VNodeType;
    component: TextVNodeType | DOMVNodeType | ComponentVNodeType<Props>;
    props: Props;
    domNode?: Node;
    parent?: VNode;
    children?: VNode[];
    id?: number;
    rendered?: VNode;
    pendingEffects?: Effect[];
    pendingEffectReturns?: (() => void)[];
}
export declare function isVNode(obj: any): boolean;
