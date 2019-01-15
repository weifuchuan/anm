export default class EventEmitter {
	private eventNameToHandlers: { [name: string]: Function[] } = {};

	on(eventName: string, handler: Function) {
		if (!this.eventNameToHandlers[eventName]) {
			this.eventNameToHandlers[eventName] = [];
		}
		this.eventNameToHandlers[eventName].push(handler);
	}

	off(eventName: string, handler: Function) {
		if (this.eventNameToHandlers[eventName]) {
			const handlers = this.eventNameToHandlers[eventName];
			const readyRemove: number[] = [];
			for (let i = 0; i < handlers.length; i++) {
				if (handlers[i] === handler) {
					readyRemove.push(i);
				}
			}
			for (let i = readyRemove.length - 1; i > -1; i--) {
				handlers.splice(readyRemove[i], 1);
			}
		}
	}

	emit(eventName: string, ...params: any[]) {
		if (this.eventNameToHandlers[eventName]) {
			this.eventNameToHandlers[eventName].forEach((f) => {
				f(...params);
			});
		}
	}
}
