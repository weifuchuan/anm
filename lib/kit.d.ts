import { VNode } from './types';
export declare const executor: (f: () => void) => void;
export declare function isNumber(arg: any): arg is number;
export declare const isSupportSVG: boolean;
export declare function isString(arg: any): arg is string;
export declare function isFunction(arg: any): arg is Function;
export declare function isBoolean(arg: any): arg is true | false;
export declare const isArray: (arg: any) => arg is any[];
export declare function isObject(arg: any): arg is Object;
export declare function isUndefined(o: any): o is undefined;
export declare function isNullOrUndef(o: any): o is undefined | null;
export declare function isInvalid(o: any): o is undefined | null | true | false;
export declare function isEventAttr(attr: string): boolean;
export declare function isKeyed(lastChildren: VNode[], nextChildren: VNode[]): boolean;
export declare function realEventName(node: Element, eventName: string): string;
export declare function onEvent(e: Element, name: string, handler: Function): void;
export declare function offEvent(e: Element, name: string, handler: Function): void;
export declare function setStyle(domStyle: CSSStyleDeclaration, style: string, value: string): void;
export declare function setProp(node: Element, name: string, value: any): void;
export declare function nextTick(f: () => void): void;
export declare function nextTick2(f: () => void): void;
export declare function equalsArray(a?: any[], b?: any[]): boolean;
/**
 * Slightly modified Longest Increased Subsequence algorithm, it ignores items that have -1 value, they're representing
 * new items.
 *
 * http://en.wikipedia.org/wiki/Longest_increasing_subsequence
 *
 * @param a Array of numbers.
 * @returns Longest increasing subsequence.
 */
export declare function lis(a: number[]): number[];
