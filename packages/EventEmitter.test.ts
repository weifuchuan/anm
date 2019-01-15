import EventEmitter from './EventEmitter';

test('EventEmitter', () => {
	const emitter = new EventEmitter();
	let counter = 0;
	emitter.on('add', (count: number) => {
		counter += count;
	});
	emitter.emit('add', 99);
	expect(counter).toEqual(99);
	emitter.on('add', (count: number) => {
		counter += count;
	});
	emitter.emit('add', 1);
  expect(counter).toEqual(101);
  
});
