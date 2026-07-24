import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [filter, setFilter] = useState("all"); // "all", "pending", "completed"

    // Load todos
    const loadTodos = async () => {
        try {
            const res = await api.get("/todos");
            if (Array.isArray(res.data)) {
                setTodos(res.data);
            }
        } catch (err) {
            console.error("Error loading todos:", err);
        }
    };

    useEffect(() => {
        loadTodos();
    }, []);

    // Add todo
    const addTodo = async (e) => {
        if (e) e.preventDefault();
        if (!title.trim()) return;

        try {
            await api.post("/todos", {
                title: title.trim(),
                description: description.trim(),
                completed: false,
            });

            setTitle("");
            setDescription("");
            loadTodos();
        } catch (err) {
            console.error("Error adding todo:", err);
        }
    };

    // Delete todo
    const deleteTodo = async (id) => {
        try {
            await api.delete(`/todos/${id}`);
            loadTodos();
        } catch (err) {
            console.error("Error deleting todo:", err);
        }
    };

    // Toggle completed
    const toggleComplete = async (todo) => {
        try {
            await api.put(`/todos/${todo.id}`, {
                completed: !todo.completed,
            });
            loadTodos();
        } catch (err) {
            console.error("Error toggling todo status:", err);
        }
    };

    // Stats
    const totalCount = todos.length;
    const completedCount = todos.filter((t) => t.completed).length;
    const pendingCount = totalCount - completedCount;

    // Filtered list
    const filteredTodos = todos.filter((todo) => {
        if (filter === "completed") return todo.completed;
        if (filter === "pending") return !todo.completed;
        return true;
    });

    return (
        <div className="app-container">
            {/* Header */}
            <header className="app-header">
                <div className="brand-badge">
                    <span /> ZipTrrip Workspace
                </div>
                <h1 className="app-title">Task Manager</h1>
                <p className="app-subtitle">Stay organized and accomplish your goals effortlessly</p>
            </header>

            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card stat-total">
                    <span className="stat-label">Total Tasks</span>
                    <span className="stat-value">{totalCount}</span>
                </div>
                <div className="stat-card stat-pending">
                    <span className="stat-label">Pending</span>
                    <span className="stat-value">{pendingCount}</span>
                </div>
                <div className="stat-card stat-completed">
                    <span className="stat-label">Completed</span>
                    <span className="stat-value">{completedCount}</span>
                </div>
            </div>

            {/* Add Todo Form */}
            <form className="form-card" onSubmit={addTodo}>
                <h2 className="form-title">➕ Create New Task</h2>
                <div className="input-group">
                    <input
                        type="text"
                        className="input-field"
                        placeholder="What needs to be done?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <textarea
                        className="input-field"
                        placeholder="Add extra details or notes (optional)..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn-primary">
                    <span>✨</span> Add Task
                </button>
            </form>

            {/* Task List Section */}
            <div className="section-header">
                <h2 className="section-title">Your Tasks</h2>
                <div style={{ display: "flex", gap: "8px" }}>
                    <button
                        className={`btn-sm ${filter === "all" ? "btn-primary" : "btn-toggle"}`}
                        onClick={() => setFilter("all")}
                        style={filter === "all" ? { padding: "6px 12px", fontSize: "12px" } : {}}
                    >
                        All ({totalCount})
                    </button>
                    <button
                        className={`btn-sm ${filter === "pending" ? "btn-primary" : "btn-toggle"}`}
                        onClick={() => setFilter("pending")}
                        style={filter === "pending" ? { padding: "6px 12px", fontSize: "12px" } : {}}
                    >
                        Pending ({pendingCount})
                    </button>
                    <button
                        className={`btn-sm ${filter === "completed" ? "btn-primary" : "btn-toggle"}`}
                        onClick={() => setFilter("completed")}
                        style={filter === "completed" ? { padding: "6px 12px", fontSize: "12px" } : {}}
                    >
                        Done ({completedCount})
                    </button>
                </div>
            </div>

            <div className="task-list">
                {filteredTodos.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📌</div>
                        <h3 className="empty-title">
                            {filter === "all"
                                ? "No tasks available"
                                : filter === "completed"
                                    ? "No completed tasks yet"
                                    : "No pending tasks!"}
                        </h3>
                        <p className="empty-desc">
                            {filter === "all" ? "Add a new task above to get started!" : "Keep pushing forward!"}
                        </p>
                    </div>
                ) : (
                    filteredTodos.map((todo) => (
                        <div
                            key={todo.id}
                            className={`task-card ${todo.completed ? "completed" : ""}`}
                        >
                            <div className="task-header">
                                <h3 className="task-title">{todo.title}</h3>
                                <span
                                    className={`badge ${todo.completed ? "badge-completed" : "badge-pending"
                                        }`}
                                >
                                    {todo.completed ? "Completed ✅" : "Pending ⏳"}
                                </span>
                            </div>

                            {todo.description && (
                                <p className="task-desc">{todo.description}</p>
                            )}

                            <div className="task-actions">
                                <button
                                    className="btn-sm btn-toggle"
                                    onClick={() => toggleComplete(todo)}
                                >
                                    {todo.completed ? "↺ Mark Pending" : "✓ Mark Complete"}
                                </button>

                                <Link
                                    to={`/todo?id=${todo.id}`}
                                    className="btn-sm btn-link"
                                >
                                    🔍 View Details
                                </Link>

                                <button
                                    className="btn-sm btn-delete"
                                    onClick={() => deleteTodo(todo.id)}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default TodoList;