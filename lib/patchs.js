import bus from './bus';
import { runPendingEffects, vnodeToDomNode } from './vnode';
import { isEventAttr, isFunction, isNullOrUndef, isString, nextTick2, offEvent, onEvent, setStyle } from './kit';
import { ignoreProps } from './types';
export function patch(vnode, rendered) {
    const old = vnode.rendered;
    // Replace directly with different types of nodes
    if (old.vtype !== rendered.vtype ||
        (old.vtype === 'component' &&
            old.component.original !==
                rendered.component.original) ||
        old.component !== rendered.component) {
        unmountRecursively(old);
        const domNode = vnodeToDomNode(rendered);
        vnode.domNode.parentElement.replaceChild(domNode, vnode.domNode);
        vnode.domNode = domNode;
        vnode.props.ref && vnode.props.ref(domNode);
        vnode.rendered = rendered;
        return;
    }
    if (old.vtype === 'dom' &&
        rendered.vtype === 'dom' &&
        old.component === rendered.component)
        patchProps(old.domNode, old, old.props, rendered.props);
    patchChildren(old, old.children, rendered.children);
    // runPendingEffectReturns(vnode);
    runPendingEffects(vnode);
}
function patchProps(domNode, vnode, prevProps, nextProps) {
    // remove properties which don't contained in nextProps
    for (let p in prevProps) {
        if (ignoreProps[p])
            continue;
        const value = prevProps[p];
        if (isNullOrUndef(nextProps[p])) {
            if (isEventAttr(p)) {
                offEvent(domNode, p, value);
            }
            else if (p === 'dangerouslySetInnerHTML') {
                domNode.textContent = '';
            }
            else if (p === 'className') {
                domNode.removeAttribute('class');
            }
            else {
                domNode.removeAttribute(p);
            }
        }
    }
    // patch new properties to dom node
    for (let p in nextProps) {
        const prevValue = prevProps[p];
        const nextValue = nextProps[p];
        if (prevValue === nextValue && p !== 'value')
            continue;
        // If the before and after values are different
        // or property is value (fix the value update for textarea/input)
        if (p === 'className') {
            p = 'class';
        }
        if (ignoreProps[p])
            continue;
        if (p === 'class') {
            domNode.className = nextValue;
        }
        else if (p === 'dangerouslySetInnerHTML') {
            const lastHtml = prevValue && prevValue.__html;
            const nextHtml = nextValue && nextValue.__html;
            if (lastHtml !== nextHtml && !isNullOrUndef(nextHtml))
                domNode.innerHTML = nextHtml;
        }
        else if (isEventAttr(p) &&
            prevValue !== nextValue &&
            isFunction(nextValue)) {
            offEvent(domNode, p, prevValue);
            onEvent(domNode, p, nextValue);
        }
        else if (p === 'style') {
            const style = domNode.style;
            if (isString(nextValue)) {
                style.cssText = nextValue;
            }
            else if (!isNullOrUndef(prevValue) && !isString(prevValue)) {
                // set new style value to dom node for any key in next style value
                for (let key in nextValue) {
                    const value = nextValue[key];
                    if (value !== prevValue[key]) {
                        setStyle(style, key, value);
                    }
                }
                // remove prev style if it contained in prev style but not in next style
                for (let key in prevValue) {
                    if (isNullOrUndef(nextValue[key])) {
                        style[key] = '';
                    }
                }
            }
            else {
                for (let key in nextValue) {
                    const value = nextValue[key];
                    setStyle(style, key, value);
                }
            }
        }
        else if (p !== 'list' && p !== 'type' && p in domNode) {
            try {
                domNode[p] = nextValue || '';
            }
            catch (error) {
            }
            if (!nextValue) {
                domNode.removeAttribute(p);
            }
        }
        else if (!nextValue) {
            domNode.removeAttribute(p);
        }
        else {
            // TODO: svg support
        }
    }
    vnode.props = nextProps;
}
function patchChildren(parent, lastChildren, nextChildren) {
    const parentDom = parent.domNode;
    const lastLength = lastChildren.length;
    const nextLength = nextChildren.length;
    if (lastLength === 0) {
        for (let child of nextChildren) {
            vnodeToDomNode(child);
            parentDom.appendChild(child.domNode);
        }
    }
    else if (nextLength === 0) {
        parentDom.textContent = '';
        for (let child of lastChildren) {
            unmountRecursively(child);
        }
    }
    else {
        /*if (isKeyed(lastChildren, nextChildren)) {
            let lastBegin = 0,
                lastEnd = lastChildren.length - 1;
            let nextBegin = 0,
                nextEnd = nextChildren.length - 1;
            while (
                lastChildren[lastBegin].props.key ===
                    nextChildren[nextBegin].props.key &&
                lastBegin <= lastEnd &&
                nextBegin <= nextEnd
            ) {
                patchBothChild(
                    nextChildren[nextBegin],
                    lastChildren[lastBegin],
                    nextChildren,
                    nextBegin,
                    parent
                );

                lastBegin++;
                nextBegin++;
            }
            while (
                lastChildren[lastEnd].props.key ===
                    nextChildren[nextEnd].props.key &&
                lastBegin <= lastEnd &&
                nextBegin <= nextEnd
            ) {
                patchBothChild(
                    nextChildren[nextEnd],
                    lastChildren[lastEnd],
                    nextChildren,
                    nextEnd,
                    parent
                );

                lastEnd--;
                nextEnd--;
            }

            if (lastBegin > lastEnd) {
                if (nextBegin <= nextEnd) {
                    for (let i = nextBegin; i <= nextEnd; i++) {
                        vnodeToDomNode(nextChildren[i]);
                        if (lastBegin <= nextEnd) {
                            parentDom.appendChild(nextChildren[i].domNode!);
                        } else {
                            parentDom.insertBefore(
                                nextChildren[i].domNode!,
                                lastChildren[lastBegin].domNode!
                            );
                        }
                    }
                    nextBegin = nextEnd + 1;
                }
            } else if (nextBegin > nextEnd) {
                while (lastBegin <= lastEnd) {
                    parentDom.removeChild(lastChildren[lastBegin++].domNode!);
                }
            } else {
                const lastLeft = lastEnd - lastBegin + 1;
                const nextLeft = nextEnd - nextBegin + 1;
                const sources: number[] = new Array(nextLeft);
                for (let i = 0; i < nextLeft; i++) {
                    sources[i] = -1;
                }
                let moved = false;
                let pos = 0;
                let patched = 0;

                if (nextLeft <= 4 || lastLeft * nextLeft <= 16) {
                    for (let i = lastBegin; i <= lastEnd; i++) {
                        let lastNode = lastChildren[i];
                        if (patched < nextLeft) {
                            for (let j = nextBegin; j <= nextEnd; j++) {
                                let nextNode = nextChildren[j];
                                if (lastNode.props.key === nextNode.props.key) {
                                    sources[j - nextBegin] = i;
                                    if (pos > j) {
                                        moved = true;
                                    } else {
                                        pos = j;
                                    }
                                    patchBothChild(
                                        nextNode,
                                        lastNode,
                                        nextChildren,
                                        j,
                                        parent
                                    );
                                    patched++;
                                    lastChildren[i] = null as any;
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    const keyIndex: { [key: string]: number } = {};
                    for (let i = nextBegin; i <= nextEnd; i++) {
                        keyIndex[nextChildren[i].props.key!] = i;
                    }
                    for (let i = lastBegin; i < lastEnd; i++) {
                        const last = lastChildren[i];
                        if (patched < nextLeft) {
                            let j = keyIndex[last.props.key!];
                            if (j !== undefined) {
                                const next = nextChildren[j];
                                sources[j - nextBegin] = i;
                                if (pos > j) {
                                    moved = true;
                                } else {
                                    pos = j;
                                }
                                patchBothChild(
                                    next,
                                    last,
                                    nextChildren,
                                    j,
                                    parent
                                );
                                patched++;
                                lastChildren[i] = null as any;
                            }
                        }
                    }
                }

                if (lastLeft === lastChildren.length && patched === 0) {
                    parentDom.textContent = '';
                    while (nextBegin < nextLeft) {
                        const node = nextChildren[nextBegin];
                        nextBegin++;
                        vnodeToDomNode(node);
                        parentDom.appendChild(node.domNode!);
                    }
                } else {
                    let i = lastLeft - patched;
                    while (i > 0) {
                        const last = lastChildren[lastBegin];
                        if (last !== null) {
                            parentDom.removeChild(last.domNode!);
                            i--;
                        }
                    }
                    if (moved) {
                        const seq = lis(sources);
                        let j = seq.length - 1;
                        for (let i = nextLeft - 1; i >= 0; i--) {
                            if (sources[i] === -1) {
                                const pos = i + nextBegin;
                                const node = nextChildren[pos];
                                const nextPos = pos + 1;
                                vnodeToDomNode(node);
                                if (nextPos < nextChildren.length) {
                                    parentDom.insertBefore(
                                        node.domNode!,
                                        nextChildren[nextPos].domNode!
                                    );
                                } else {
                                    parentDom.appendChild(node.domNode!);
                                }
                            } else {
                                if (j < 0 || i !== seq[j]) {
                                    const pos = i + nextBegin;
                                    const node = nextChildren[pos];
                                    const nextPos = pos + 1;
                                    node.domNode && vnodeToDomNode(node);
                                    if (nextPos < nextChildren.length) {
                                        parentDom.insertBefore(
                                            node.domNode!,
                                            nextChildren[nextPos].domNode!
                                        );
                                    } else {
                                        parentDom.appendChild(node.domNode!);
                                    }
                                }
                            }
                        }
                    } else if (patched !== nextLeft) {
                        for (let i = nextLeft - 1; i >= 0; i--) {
                            if (sources[i] === -1) {
                                const pos = i + nextBegin;
                                const node = nextChildren[pos];
                                const nextPos = pos + 1;
                                vnodeToDomNode(node);
                                if (nextPos < nextChildren.length) {
                                    parentDom.insertBefore(
                                        node.domNode!,
                                        nextChildren[nextPos].domNode!
                                    );
                                } else {
                                    parentDom.appendChild(node.domNode!);
                                }
                            }
                        }
                    }
                }
            }
        } else {*/
        const minLength = Math.min(lastLength, nextLength);
        let i = 0;
        while (i < minLength) {
            const last = lastChildren[i], next = nextChildren[i];
            patchBothChild(next, last, nextChildren, i, parent);
            i++;
        }
        if (lastLength < nextLength) {
            for (i = minLength; i < nextLength; i++) {
                if (parentDom !== null) {
                    vnodeToDomNode(nextChildren[i]);
                    parentDom.appendChild(nextChildren[i].domNode);
                }
            }
        }
        else if (lastLength > nextLength) {
            for (i = minLength; i < lastLength; i++) {
                parentDom.removeChild(lastChildren[i].domNode);
                unmountRecursively(lastChildren[i]);
            }
        }
        // }
    }
    parent.children = nextChildren;
}
function patchBothChild(next, last, nextChildren, i, parent) {
    if (next.vtype === 'component') {
        if (last.vtype === 'component' &&
            last.component.original ===
                next.component.original) {
            next.rendered = last.component(next.props);
        }
        else {
            next.rendered = next.component(next.props);
        }
    }
    if (last.vtype === 'component' && next.vtype === 'component') {
        patch(last, next.rendered);
        last.props = next.props;
        nextChildren[i] = last;
        unmount(next);
    }
    else if (last.vtype !== next.vtype ||
        (last.vtype === 'text' &&
            next.vtype === 'text' &&
            last.component !== next.component) ||
        (last.vtype === 'dom' &&
            next.vtype === 'dom' &&
            last.component !== next.component)) {
        vnodeToDomNode(next);
        next.parent = parent;
        parent.domNode.replaceChild(next.domNode, last.domNode);
        unmountRecursively(last);
    }
    else if (last.vtype === 'dom' && next.vtype === 'dom') {
        patchProps(last.domNode, last, last.props, next.props);
        patchChildren(last, last.children, next.children);
        nextChildren[i] = last;
        unmountRecursively(next);
    }
    else if (last.vtype === 'text' && next.vtype === 'text') {
        nextChildren[i] = last;
    }
}
// remove state and effect of vnode
function unmountRecursively(vnode) {
    nextTick2(() => {
        if (vnode.vtype === 'text')
            return;
        const stack = [vnode];
        for (; stack.length > 0;) {
            const n = stack.pop();
            if (n.id) {
                bus.emit('unmount', n.id);
            }
            stack.push(...n.children.filter((n) => n.vtype !== 'text'));
        }
    });
}
function unmount(vnode) {
    vnode.vtype === 'component' &&
        nextTick2(() => bus.emit('unmount', vnode.id));
}
//# sourceMappingURL=patchs.js.map