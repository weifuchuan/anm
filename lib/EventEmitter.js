export default class EventEmitter {
    constructor() {
        this.eventNameToHandlers = {};
    }
    on(eventName, handler) {
        if (!this.eventNameToHandlers[eventName]) {
            this.eventNameToHandlers[eventName] = [];
        }
        this.eventNameToHandlers[eventName].push(handler);
    }
    off(eventName, handler) {
        if (this.eventNameToHandlers[eventName]) {
            const handlers = this.eventNameToHandlers[eventName];
            const readyRemove = [];
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
    emit(eventName, ...params) {
        if (this.eventNameToHandlers[eventName]) {
            this.eventNameToHandlers[eventName].forEach((f) => {
                f(...params);
            });
        }
    }
}
//# sourceMappingURL=EventEmitter.js.map