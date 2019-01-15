import { updateVNode, addPendingEffect } from './vnode';
import { equalsArray } from './kit';
import { Effect } from './types';
import bus from './bus';

let idCounter = 1;

export function getId() {
	return idCounter++;
}

const idToSE: {
	[id: number]: {
		states: {
			length: number;
			[index: number]: {
				state: any;
			};
		};
		effects: {
			length: number;
			[index: number]: {
				effectReturn?: () => void;
				inputs?: any[];
			};
		};
	};
} = {};

bus.on('unmount', (id: number) => delete idToSE[id]);

let currId: number;
let iterState: number;
let iterEffect: number;

export function beginRender(id: number) {
	currId = id;
	iterState = 0;
	iterEffect = 0;
}

export function endRender(id: number) {

}

export function useState<S = any>(initState: S): [S, (s: S) => void] {
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
		(s: S) => {
			se.states[i].state = s;
			updateVNode(id);
		}
	];
}

export function useEffect(effect: Effect, inputs?: any[]) {
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
