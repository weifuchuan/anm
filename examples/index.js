"use strict";
exports.__esModule = true;
var createElement_1 = require("createElement");
var render_1 = require("render");
var hooks_1 = require("hooks");
var React = {
    createElement: createElement_1.createElement
};
var idCounter = 0;
function TodoApp() {
    var _a = hooks_1.useState([]), todos = _a[0], setTodos = _a[1];
    return (<div>
			<TodoEditor onAdd={function (thing) {
        setTodos(todos.concat([
            {
                id: idCounter++,
                thing: thing,
                completed: false,
                createAt: new Date()
            }
        ]));
    }}/>
			<TodoList todos={todos} onCompleted={function (id) {
        var i = todos.findIndex(function (x) { return x.id === id; });
        if (i !== -1) {
            todos[i].completed = true;
            setTodos(todos.slice());
        }
    }}/>
		</div>);
}
function TodoEditor(_a) {
    var onAdd = _a.onAdd;
    var _b = hooks_1.useState(''), thing = _b[0], setThing = _b[1];
    return (<div>
			<input value={thing} onInput={function (e) { return setThing(e.target.value); }}/>
			<button disabled={thing.trim() === ''} onClick={function () { return (setThing(''), onAdd(thing)); }}>
				add
			</button>
			<button onClick={function () {
        for (var i = 0; i < 1000000; i++) {
            onAdd(i.toString());
        }
    }}>
				test
			</button>
		</div>);
}
function TodoList(_a) {
    var todos = _a.todos, onCompleted = _a.onCompleted;
    var _b = hooks_1.useState('all'), filter = _b[0], setFilter = _b[1];
    todos = todos.filter(function (todo) {
        if (filter === 'all')
            return true;
        if (filter === 'completed')
            return todo.completed;
        return !todo.completed;
    });
    return (<div>
			<div>
				<button disabled={filter === 'all'} onClick={function () { return setFilter('all'); }}>
					all
				</button>
				<button disabled={filter === 'completed'} onClick={function () { return setFilter('completed'); }}>
					completed
				</button>
				<button disabled={filter === 'uncompleted'} onClick={function () { return setFilter('uncompleted'); }}>
					uncompleted
				</button>
			</div>
			<div>
				{todos.map(function (todo) { return (<TodoItem 
    // key={todo.id.toString()}
    todo={todo} onCompleted={onCompleted}/>); })}
			</div>
		</div>);
}
function TodoItem(_a) {
    var todo = _a.todo, onCompleted = _a.onCompleted;
    hooks_1.useEffect(function () {
        console.log('mounted');
        return function () {
            console.log('unmounted');
        };
    });
    return (<div style={{
        backgroundColor: todo.completed ? 'green' : 'red',
        color: 'white',
        padding: '1em',
        margin: '1em 0',
        display: 'flex',
        justifyContent: 'space-around'
    }}>
			<span>{todo.thing}</span>
			<span>{todo.createAt.toLocaleString()}</span>
			{todo.completed ? (<span>completed</span>) : (<button onClick={function () { return onCompleted(todo.id); }}>complete</button>)}
		</div>);
}
render_1.render((
// <div style={{ backgroundColor: '#aaa' }}>
// 	<Counter />
// </div>
<TodoApp />), document.getElementById('root'));
