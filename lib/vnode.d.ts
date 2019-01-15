import { Effect, VNode } from './types';
export declare function vnodeToDomNode(vnode: VNode): Node;
export declare function updateVNode(id: number): void;
export declare function addPendingEffect(id: number, effect: Effect): void;
export declare function runPendingEffects(vnode: VNode | number): void;
export declare function runPendingEffectReturns(vnode: VNode | number): void;
