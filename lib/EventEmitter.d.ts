export default class EventEmitter {
    private eventNameToHandlers;
    on(eventName: string, handler: Function): void;
    off(eventName: string, handler: Function): void;
    emit(eventName: string, ...params: any[]): void;
}
