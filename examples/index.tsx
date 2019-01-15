import {createElement} from '../packages';
import {render,h} from '../packages';
import {useState, useEffect} from '../packages';

const React = {
	createElement
};

// function WindowWidth() {
// 	const width = useWindowWidth();
// 	return <div>width = {width}</div>;
// }

// function Count({ count }: { count: number }) {
// 	return <div>count = {count}</div>;
// }

// function JiOrOu({ count }: { count: number }) {
// 	return count % 2 === 0 ? <Ji /> : <Ou />;
// }

// function Ji() {
// 	return <div>奇数</div>;
// }

// function Ou() {
// 	return <div>偶数</div>;
// }

// function Example() {
// 	const [ count, setCount ] = useState(0);
// 	console.info('count =', count);
// 	return (
// 		<div>
// 			<p>You clicked {count} times</p>
// 			<button onClick={() => setCount(count + 1)}>Click me</button>
// 			<Count count={count} />
// 			<JiOrOu count={count} />
// 		</div>
// 	);
// }

// function Counter() {
// 	const [ count, setCount ] = useState(0);
// 	const [ value, setValue ] = useState(0);

// 	return (
// 		<div>
// 			<WindowWidth />
// 			<Count count={count} />
// 			<JiOrOu count={count} />
// 			<div>
// 				<button onClick={() => setCount(count + 1)}>++</button>
// 			</div>
// 			<div>
// 				<button onClick={() => setCount(count - 1)}>--</button>
// 			</div>
// 			<div>
// 				<input
// 					onInput={(e: any) =>
// 						setValue(Number.parseFloat(e.target.value))}
// 					type={'number'}
// 					value={value}
// 				/>
// 				<button onClick={() => setCount(count + value)}>+</button>
// 			</div>
// 			<Example />
// 		</div>
// 	);
// }

// function useWindowWidth(): number {
// 	const [ width, setWidth ] = useState(window.innerWidth);
// 	useEffect(() => {
// 		const doSetWidth = () => setWidth(window.innerWidth);
// 		window.addEventListener('resize', doSetWidth);
// 		return () => window.removeEventListener('resize', doSetWidth);
// 	}, []);
// 	return width;
// }

// function ChangeColor() {
// 	const [ color, setColor ] = useState('red');
// 	return (
// 		<div style={{ backgroundColor: color, padding: '1em' }}>
// 			<button
// 				onClick={() => {
// 					setColor('green');
// 				}}
// 			>
// 				to green
// 			</button>
// 			<button
// 				onClick={() => {
// 					setColor('red');
// 				}}
// 			>
// 				to red
// 			</button>
// 		</div>
// 	);
// }

interface Todo {
	id: number;
	thing: string;
	completed: boolean;
	createAt: Date;
}

type FilterType = 'all' | 'completed' | 'uncompleted';

let idCounter = 0;

let count = 0;

function TodoApp() {
	const [todos, setTodos] = useState<Todo[]>([]);

	useEffect(() => {
		if (count < 10000)
			setTodos([...todos,
				{
					id: idCounter++,
					thing: (count++).toString(),
					completed: false,
					createAt: new Date()
				}])
	});

	return (
		<div>
			<TodoEditor
				onAdd={(thing) => {
					setTodos([
						...todos,
						{
							id: idCounter++,
							thing,
							completed: false,
							createAt: new Date()
						}
					]);
				}}
			/>
			<TodoList
				todos={todos}
				onCompleted={(id) => {
					const i = todos.findIndex((x) => x.id === id);
					if (i !== -1) {
						todos[i].completed = true;
						setTodos([...todos]);
					}
				}}
			/>
		</div>
	);
}

function TodoEditor({onAdd}: { onAdd: (thing: string) => void }) {
	const [thing, setThing] = useState('');
	return (
		<div>
			<input
				value={thing}
				onInput={(e: any) => setThing(e.target.value)}
			/>
			<button
				disabled={thing.trim() === ''}
				onClick={() => (setThing(''), onAdd(thing))}
			>
				add
			</button>
		</div>
	);
}

function TodoList({
	                  todos,
	                  onCompleted
                  }: {
	todos: Todo[];
	onCompleted: (id: number) => void;
}) {
	const [filter, setFilter] = useState<FilterType>('all');
	todos = todos.filter((todo) => {
		if (filter === 'all') return true;
		if (filter === 'completed') return todo.completed;
		return !todo.completed;
	});
	return (
		<div>
			<div>
				<button
					disabled={filter === 'all'}
					onClick={() => setFilter('all')}
				>
					all
				</button>
				<button
					disabled={filter === 'completed'}
					onClick={() => setFilter('completed')}
				>
					completed
				</button>
				<button
					disabled={filter === 'uncompleted'}
					onClick={() => setFilter('uncompleted')}
				>
					uncompleted
				</button>
			</div>
			<div>
				{todos.map((todo) => (
					<TodoItem
						// key={todo.id.toString()}
						todo={todo}
						onCompleted={onCompleted}
					/>
				))}
			</div>
		</div>
	);
}

function TodoItem({
	                  todo,
	                  onCompleted
                  }: {
	todo: Todo;
	onCompleted: (id: number) => void;
}) {
	// useEffect(() => {
	// 	console.log('mounted', JSON.stringify(todo));
	// 	return () => {
	// 		console.log('unmounted', JSON.stringify(todo));
	// 	};
	// });
	return (
		<div
			style={{
				backgroundColor: todo.completed ? 'green' : 'red',
				color: 'white',
				padding: '1em',
				margin: '1em 0',
				display: 'flex',
				justifyContent: 'space-around'
			}}
		>
			<span>{todo.thing}</span>
			<span>{todo.createAt.toLocaleString()}</span>
			{todo.completed ? (
				<span>completed</span>
			) : (
				<button onClick={() => onCompleted(todo.id)}>complete</button>
			)}
		</div>
	);
}

render(
	(
		// <div style={{ backgroundColor: '#aaa' }}>
		// 	<Counter />
		// </div>
		<TodoApp/>
	) as any,
	document.getElementById('root')!
);
