import { createElement } from "../packages";
import { render } from "../packages";
import { useState, useEffect } from "../packages";

const React = {
  createElement
};

interface Todo {
  id: number;
  thing: string;
  completed: boolean;
  createAt: Date;
}

type FilterType = "all" | "completed" | "uncompleted";

let nextId = 0;

let count = 0;

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    if (count < 100)
      setTodos([
        ...todos,
        {
          id: nextId++,
          thing: (count++).toString(),
          completed: false,
          createAt: new Date()
        }
      ]);
  });

  return (
    <div>
      <TodoEditor
        onAdd={thing => {
          setTodos([
            ...todos,
            {
              id: nextId++,
              thing,
              completed: false,
              createAt: new Date()
            }
          ]);
        }}
      />
      <TodoList
        todos={todos}
        onCompleted={id => {
          const i = todos.findIndex(x => x.id === id);
          if (i !== -1) {
            todos[i].completed = true;
            setTodos([...todos]);
          }
        }}
      />
    </div>
  );
}

function TodoEditor({ onAdd }: { onAdd: (thing: string) => void }) {
  const [thing, setThing] = useState("");
  return (
    <div>
      <input value={thing} onInput={(e: any) => setThing(e.target.value)} />
      <button
        disabled={thing.trim() === ""}
        onClick={() => (setThing(""), onAdd(thing))}
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
  const [filter, setFilter] = useState<FilterType>("all");
  todos = todos.filter(todo => {
    if (filter === "all") return true;
    if (filter === "completed") return todo.completed;
    return !todo.completed;
  });
  return (
    <div>
      <div>
        <button disabled={filter === "all"} onClick={() => setFilter("all")}>
          all
        </button>
        <button
          disabled={filter === "completed"}
          onClick={() => setFilter("completed")}
        >
          completed
        </button>
        <button
          disabled={filter === "uncompleted"}
          onClick={() => setFilter("uncompleted")}
        >
          uncompleted
        </button>
      </div>
      <div>
        {todos.map(todo => (
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
  return (
    <div
      style={{
        backgroundColor: todo.completed ? "green" : "red",
        color: "white",
        padding: "1em",
        margin: "1em 0",
        display: "flex",
        justifyContent: "space-around"
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
    <TodoApp />
  ) as any,
  document.getElementById("root")!
);
