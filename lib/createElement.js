import { isVNode } from './types';
import { getId, endRender, beginRender } from './hooks';
import { isNullOrUndef } from './kit';
export function createElement(type, props = {}, ...children) {
    if (!props)
        props = {};
    if (props.key && typeof props.key !== 'string')
        props.key = JSON.stringify(props.key);
    const isArr = Array.isArray(props.children);
    if (props.children && !isArr) {
        props.children = [props.children];
    }
    else if (!props.children) {
        props.children = children;
    }
    props.children = children = props.children
        .filter((child) => !isNullOrUndef(child))
        .reduce((prev, curr) => (Array.isArray(curr)
        ? prev.push(...curr)
        : prev.push(curr),
        prev), []);
    let vnode;
    if (typeof type === 'string') {
        // dom vnode
        vnode = {
            vtype: 'dom',
            component: type,
            children,
            props
        };
    }
    else if (typeof type === 'function') {
        const id = getId();
        const packType = function (props) {
            beginRender(id);
            const rendered = type(props);
            endRender(id);
            return rendered;
        };
        packType.original = type;
        vnode = {
            id,
            vtype: 'component',
            component: packType,
            children,
            props
        };
    }
    else {
        throw 'invalid type';
    }
    for (let i = 0; i < children.length; i++) {
        if (typeof children[i] === 'string') {
            children[i] = {
                vtype: 'text',
                component: children[i],
                children: [],
                props: {}
            };
        }
        else if (typeof children[i] === 'boolean' ||
            typeof children[i] === 'number' ||
            typeof children[i] === 'bigint' ||
            typeof children[i] === 'symbol' ||
            typeof children[i] === 'undefined' ||
            !isVNode(children[i])) {
            children[i] = {
                vtype: 'text',
                component: (JSON.stringify(children[i]) || ''),
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
//# sourceMappingURL=createElement.js.map