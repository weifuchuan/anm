import EventEmitter from './EventEmitter';
test('EventEmitter', () => {
    const emitter = new EventEmitter();
    let counter = 0;
    emitter.on('add', (count) => {
        counter += count;
    });
    emitter.emit('add', 99);
    expect(counter).toEqual(99);
    emitter.on('add', (count) => {
        counter += count;
    });
    emitter.emit('add', 1);
    expect(counter).toEqual(101);
});
//# sourceMappingURL=EventEmitter.test.js.map