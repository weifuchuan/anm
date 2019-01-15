import { updateVNode, addPendingEffect } from './vnode';
import { equalsArray } from './kit';
import bus from './bus';
let idCounter = 1;
export function getId() {
    return idCounter++;
}
const idToSE = {};
bus.on('unmount', (id) => delete idToSE[id]);
let currId;
let iterState;
let iterEffect;
export function beginRender(id) {
    currId = id;
    iterState = 0;
    iterEffect = 0;
}
export function endRender(id) {
}
export function useState(initState) {
    const id = currId;
    const i = iterState;
    iterState++;
    if (!idToSE[id]) {
        idToSE[id] = {
            states: {
                length: 0
            },
            effects: {
                length: 0
            }
        };
    }
    const se = idToSE[id];
    if (!se.states[i]) {
        se.states.length++;
        se.states[i] = { state: initState };
    }
    return [
        se.states[i].state,
        (s) => {
            se.states[i].state = s;
            updateVNode(id);
        }
    ];
}
export function useEffect(effect, inputs) {
    const id = currId;
    const i = iterEffect;
    iterEffect++;
    if (!idToSE[id]) {
        idToSE[id] = {
            states: {
                length: 0
            },
            effects: {
                length: 0
            }
        };
    }
    const se = idToSE[id];
    if (!se.effects[i]) {
        se.effects.length++;
        se.effects[i] = {};
    }
    const effected = se.effects[i];
    if (!inputs || (inputs && !equalsArray(effected.inputs, inputs))) {
        addPendingEffect(id, effect);
        effected.inputs = inputs;
    }
}
//# sourceMappingURL=hooks.js.map