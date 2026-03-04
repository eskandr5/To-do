import React, { useState, useEffect } from 'react'
import './todo.css'
import ConfirmModal from "../ConfirmModal/ConfirmModal";

const Todoform = () => {
    const [text, setText] = useState("");
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [todoToDelete, setTodoToDelete] = useState(null);

    // Load todos from localStorage when component mounts
    useEffect(() => {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            try {
                setTodos(JSON.parse(savedTodos));
            } catch (error) {
                console.error('Error loading todos:', error);
            }
        }
    }, []);

    // Save todos to localStorage whenever they change
    useEffect(() => {
        if (todos.length > 0) {
            localStorage.setItem('todos', JSON.stringify(todos));
        } else {
            localStorage.removeItem('todos');
        }
    }, [todos]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        
        const newTodo = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setText("");
    };

    const handleChange = (e) => {
        setText(e.target.value);
    };

    const completeTask = (id) => {
        setTodos(prevTodos => prevTodos.map(todo =>
            todo.id === id ? {
                ...todo,
                completed: !todo.completed
            } : todo
        ));
    };

    const deleteItem = (id) => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    };

    const clearAllCompleted = () => {
        setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === "completed") return todo.completed;
        if (filter === "active") return !todo.completed;
        return true; // "all"
    });

    const activeTodosCount = todos.filter(todo => !todo.completed).length;
    const completedTodosCount = todos.filter(todo => todo.completed).length;

    return (
        <div className="todo-app">
            <p className='title'>To Do List</p>
            
            <form onSubmit={handleSubmit}>
                <input
                    className="todo-input"
                    value={text}
                    onChange={handleChange}
                    placeholder="Enter a new task..."
                />
                <button className='AddButton' type="submit">Add</button>
            </form>

            {todos.length > 0 && (
                <>
                    <ul>
                        {filteredTodos.map(todo => (
                            <li key={todo.id} className="todo-item">
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => completeTask(todo.id)}
                                    className="todo-checkbox"
                                />
                                <span
                                    onClick={() => completeTask(todo.id)}
                                    className={`todo-text ${todo.completed ? "completed" : ""}`}
                                >
                                    {todo.text}
                                </span>
                                <button 
                                    className='DeleteButton' 
                                    onClick={() => {
                                        setIsModalOpen(true);
                                        setTodoToDelete(todo.id);
                                    }}
                                    aria-label="Delete todo"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="todo-stats">
                        <span>{activeTodosCount} tasks left</span>
                        {completedTodosCount > 0 && (
                            <button 
                                className="clear-completed"
                                onClick={clearAllCompleted}
                            >
                                Clear completed
                            </button>
                        )}
                    </div>

                    <div className="filters">
                        <button 
                            type="button" 
                            onClick={() => setFilter("all")}
                            className={filter === "all" ? "active" : ""}
                        >
                            All ({todos.length})
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setFilter("active")}
                            className={filter === "active" ? "active" : ""}
                        >
                            Active ({activeTodosCount})
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setFilter("completed")}
                            className={filter === "completed" ? "active" : ""}
                        >
                            Completed ({completedTodosCount})
                        </button>
                    </div>
                </>
            )}

            {todos.length === 0 && (
                <div className="empty-state">
                    <p>No tasks yet. Add one above!</p>
                </div>
            )}

            <ConfirmModal
                isOpen={isModalOpen}
                onConfirm={() => {
                    deleteItem(todoToDelete);
                    setIsModalOpen(false);
                    setTodoToDelete(null);
                }}
                onCancel={() => {
                    setIsModalOpen(false);
                    setTodoToDelete(null);
                }}
                todoTitle={todos.find(t => t.id === todoToDelete)?.text}
            />
        </div>
    );
};

export default Todoform;