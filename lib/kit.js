import EventEmitter from './EventEmitter';
// import {fromEvent} from 'rxjs';
// import {bufferTime} from 'rxjs/operators';
// import {animationFrame} from 'rxjs/internal/scheduler/animationFrame';
export const executor = window.requestAnimationFrame ?
    window.requestAnimationFrame :
    window.Promise ?
        (f) => (new Promise(((resolve, reject) => {
            try {
                f();
                resolve();
            }
            catch (err) {
                reject(err);
            }
        })))
        : window.setTimeout;
export function isNumber(arg) {
    return typeof arg === 'number';
}
export const isSupportSVG = isFunction(document.createAttributeNS);
export function isString(arg) {
    return typeof arg === 'string';
}
export function isFunction(arg) {
    return typeof arg === 'function';
}
export function isBoolean(arg) {
    return arg === true || arg === false;
}
export const isArray = Array.isArray;
export function isObject(arg) {
    return arg === Object(arg) && !isFunction(arg);
}
export function isUndefined(o) {
    return o === undefined;
}
export function isNullOrUndef(o) {
    return o === undefined || o === null;
}
export function isInvalid(o) {
    return isNullOrUndef(o) || o === true || o === false;
}
export function isEventAttr(attr) {
    return attr.startsWith('on');
}
export function isKeyed(lastChildren, nextChildren) {
    return (nextChildren.length > 0 &&
        !isNullOrUndef(nextChildren[0]) &&
        !isNullOrUndef(nextChildren[0].props.key) &&
        lastChildren.length > 0 &&
        !isNullOrUndef(lastChildren[0]) &&
        !isNullOrUndef(lastChildren[0].props.key));
}
export function realEventName(node, eventName) {
    if (eventName === 'onDoubleClick') {
        eventName = 'ondblclick';
    }
    else if (eventName === 'onTouchTap') {
        eventName = 'onclick';
    }
    else if (eventName === 'onChange') {
        const nodeName = node.nodeName && node.nodeName.toLowerCase();
        const type = node.type;
        if ((nodeName === 'input' && /text|password/.test(type)) ||
            nodeName === 'textarea')
            eventName = 'oninput';
    }
    else {
        eventName = eventName.toLowerCase();
    }
    return eventName;
}
export function onEvent(e, name, handler) {
    const realName = realEventName(e, name);
    if (realName in e) {
        e[realName] = handler;
    }
    else {
        e.addEventListener(realName.slice(2) /* trim left "on" */, handler);
    }
}
export function offEvent(e, name, handler) {
    const realName = realEventName(e, name);
    if (realName in e) {
        e[realName] = null;
    }
    else {
        e.removeEventListener(realName.slice(2) /* trim left "on" */, handler);
    }
}
const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
export function setStyle(domStyle, style, value) {
    if (isNullOrUndef(value) || (isNumber(value) && isNaN(value))) {
        domStyle[style] = '';
        return;
    }
    if (style === 'float') {
        domStyle['cssFloat'] = value;
        domStyle['styleFloat'] = value;
        return;
    }
    domStyle[style] =
        !isNumber(value) || IS_NON_DIMENSIONAL.test(style)
            ? value
            : value + 'px';
}
export function setProp(node, name, value) {
    try {
        node[name] = value;
    }
    catch (e) {
    }
}
export function nextTick(f) {
    // const tick = window.requestAnimationFrame
    // 	? window.requestAnimationFrame
    // 	: (window as any).Promise
    // 		? (f: Function) =>
    // 			new Promise((resolve, reject) => {
    // 				try {
    // 					f();
    // 					resolve();
    // 				} catch (error) {
    // 					console.error(error);
    // 					reject(error);
    // 				}
    // 			})
    // 		: window.setTimeout;
    // tick(f);
    // animationFrame.schedule(f);
    executor(f);
}
const tickBus = new EventEmitter();
// const tick$ = fromEvent<() => void>(tickBus, 'add').pipe(
// 	bufferTime(1000 / (60 * 1.5), animationFrame)
// );
// tick$.subscribe((fs) => {
// 	fs.forEach((f) => {
// 		try {
// 			f();
// 		} catch (error) {
// 		}
// 	});
// });
const pending = [];
tickBus.on("add", (f) => {
    pending.push(f);
});
setInterval(() => {
    pending.forEach(f => f());
    pending.splice(0, pending.length);
}, 1000 / 60);
export function nextTick2(f) {
    tickBus.emit('add', f);
}
export function equalsArray(a, b) {
    const aIsArr = Array.isArray(a);
    const bIsArr = Array.isArray(b);
    if (aIsArr && !bIsArr)
        return false;
    else if (!aIsArr && bIsArr)
        return false;
    else if (!aIsArr && !bIsArr)
        return false;
    else {
        (a = a);
        (b = b);
        if (a.length !== b.length)
            return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }
}
/**
 * Slightly modified Longest Increased Subsequence algorithm, it ignores items that have -1 value, they're representing
 * new items.
 *
 * http://en.wikipedia.org/wiki/Longest_increasing_subsequence
 *
 * @param a Array of numbers.
 * @returns Longest increasing subsequence.
 */
export function lis(a) {
    const p = a.slice();
    const result = [];
    result.push(0);
    let u;
    let v;
    for (let i = 0, il = a.length; i < il; ++i) {
        if (a[i] === -1) {
            continue;
        }
        const j = result[result.length - 1];
        if (a[j] < a[i]) {
            p[i] = j;
            result.push(i);
            continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
            const c = ((u + v) / 2) | 0;
            if (a[result[c]] < a[i]) {
                u = c + 1;
            }
            else {
                v = c;
            }
        }
        if (a[i] < a[result[u]]) {
            if (u > 0) {
                p[i] = result[u - 1];
            }
            result[u] = i;
        }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
        result[u] = v;
        v = p[v];
    }
    return result;
}
//# sourceMappingURL=kit.js.map