import { patch } from './patchs';
import { isEventAttr, onEvent, setProp, setStyle, nextTick } from './kit';
import { ignoreProps } from './types';
import bus from './bus';
const idToVNode = {};
bus.on('unmount', (id) => {
    if (idToVNode[id] && idToVNode[id].pendingEffectReturns) {
        idToVNode[id].pendingEffectReturns.forEach((f) => f());
    }
    delete idToVNode[id];
});
// unkown reason: value of return sometime be undefined when vnode.vtype === 'text',
// it is JS BUG?
export function vnodeToDomNode(vnode) {
    let elem;
    if (vnode.vtype === 'text') {
        elem = document.createTextNode(vnode.component);
    }
    else if (vnode.vtype === 'dom') {
        const e = (elem = document.createElement(vnode.component));
        for (let name in vnode.props) {
            if (name in ignoreProps)
                continue;
            if (isEventAttr(name)) {
                onEvent(e, name, vnode.props[name]);
            }
            else if (name === 'style') {
                for (let style in vnode.props['style']) {
                    setStyle(e.style, style, vnode.props['style'][style]);
                }
            }
            else if (name === 'className' || name === 'class') {
                e.className = vnode.props[name];
            }
            else if (name === 'dangerouslySetInnerHTML' &&
                typeof vnode.props['dangerouslySetInnerHTML'].__html ===
                    'string') {
                e.innerHTML = vnode.props['dangerouslySetInnerHTML'].__html;
            }
            else {
                setProp(e, name, vnode.props[name]);
                // TODO: 支持 SVG
            }
        }
        for (const child of vnode.children) {
            elem.appendChild(vnodeToDomNode(child));
        }
    }
    else if (vnode.vtype === 'component') {
        idToVNode[vnode.id] = vnode;
        const renderedVNode = vnode.component(vnode.props);
        vnode.rendered = renderedVNode;
        runPendingEffectReturns(vnode);
        elem = vnodeToDomNode(renderedVNode);
        runPendingEffects(vnode);
    }
    else {
        throw 'invalid type';
    }
    vnode.domNode = elem;
    vnode.props.ref && vnode.props.ref(elem);
    elem._vnode = vnode;
    return vnode.domNode;
}
export function updateVNode(id) {
    nextTick(() => {
        if (idToVNode[id] && idToVNode[id].vtype === 'component') {
            const vnode = idToVNode[id];
            if (vnode.domNode) {
                runPendingEffectReturns(vnode);
                const rendered = vnode.component(vnode.props);
                patch(vnode, rendered);
            }
        }
    });
}
export function addPendingEffect(id, effect) {
    if (idToVNode[id] && idToVNode[id].vtype === 'component') {
        const vnode = idToVNode[id];
        if (!vnode.pendingEffects) {
            vnode.pendingEffects = [];
        }
        vnode.pendingEffects.push(effect);
    }
}
export function runPendingEffects(vnode) {
    if ((typeof vnode === 'object' &&
        vnode.vtype === 'component' &&
        idToVNode[vnode.id]) ||
        (typeof vnode === 'number' &&
            idToVNode[vnode] &&
            idToVNode[vnode].vtype === 'component')) {
        vnode = typeof vnode === 'number' ? idToVNode[vnode] : vnode;
        if (vnode.pendingEffects) {
            while (vnode.pendingEffects.length > 0) {
                const effect = vnode.pendingEffects.pop();
                const effectReturn = effect();
                if (effectReturn) {
                    if (!vnode.pendingEffectReturns) {
                        vnode.pendingEffectReturns = [];
                    }
                    vnode.pendingEffectReturns.push(effectReturn);
                }
            }
        }
    }
}
export function runPendingEffectReturns(vnode) {
    if ((typeof vnode === 'object' &&
        vnode.vtype === 'component' &&
        idToVNode[vnode.id]) ||
        (typeof vnode === 'number' &&
            idToVNode[vnode] &&
            idToVNode[vnode].vtype === 'component')) {
        vnode = typeof vnode === 'number' ? idToVNode[vnode] : vnode;
        if (vnode.pendingEffectReturns) {
            while (vnode.pendingEffectReturns.length > 0) {
                const effectReturn = vnode.pendingEffectReturns.pop();
                effectReturn();
            }
        }
    }
}
//# sourceMappingURL=vnode.js.map