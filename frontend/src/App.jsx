import React, { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from './api';

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTodos();
    }, []);

    const loadTodos = async () => {
        try {
            const data = await getTodos();
            setTodos(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load todos');
        }
    };

    const handleAddString = async (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;
        try {
            const created = await createTodo(newTodo);
            setTodos([...todos, created]);
            setNewTodo('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggle = async (id, completed) => {
        try {
            const updated = await updateTodo(id, { completed: !completed });
            setTodos(todos.map(t => t.id === id ? updated : t));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTodo(id);
            setTodos(todos.filter(t => t.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="todo-list">
            <h1>Todos</h1>
            {error && <div role="alert">{error}</div>}
            <form onSubmit={handleAddString}>
                <input
                    type="text"
                    placeholder="New todo"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <button type="submit">Add</button>
            </form>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                        <span onClick={() => handleToggle(todo.id, todo.completed)} style={{ cursor: 'pointer' }}>
                            {todo.title}
                        </span>
                        <button onClick={() => handleDelete(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
