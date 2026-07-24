import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";

function TodoDetails() {
    const [searchParams] = useSearchParams();
    const [todo, setTodo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const id = searchParams.get("id");

    useEffect(() => {
        const fetchTodo = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/todos/${id}`);
                setTodo(res.data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch task details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTodo();
        } else {
            setLoading(false);
            setError("No Task ID provided.");
        }
    }, [id]);

    const toggleComplete = async () => {
        if (!todo) return;
        try {
            const updated = { ...todo, completed: !todo.completed };
            await api.put(`/todos/${todo.id}`, { completed: updated.completed });
            setTodo(updated);
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    if (loading) {
        return (
            <div className="details-container" style={{ textAlign: "center", paddingTop: "60px" }}>
                <div className="empty-title">Loading task details...</div>
            </div>
        );
    }

    if (error || !todo) {
        return (
            <div className="details-container">
                <Link to="/" className="back-link">
                    ← Back to Tasks
                </Link>
                <div className="empty-state">
                    <div className="empty-icon">⚠️</div>
                    <h3 className="empty-title">{error || "Task not found."}</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="details-container">
            <Link to="/" className="back-link">
                ← Back to Tasks
            </Link>

            <div className="details-card">
                <div className="task-header">
                    <h1 className="app-title" style={{ fontSize: "28px", margin: 0 }}>
                        {todo.title}
                    </h1>
                    <span className={`badge ${todo.completed ? "badge-completed" : "badge-pending"}`}>
                        {todo.completed ? "Completed ✅" : "Pending ⏳"}
                    </span>
                </div>

                <div className="details-meta">
                    <div className="meta-item">
                        <span className="meta-label">Description</span>
                        <p className="meta-value" style={{ lineHeight: "1.6" }}>
                            {todo.description || "No description provided for this task."}
                        </p>
                    </div>

                    <div className="meta-item">
                        <span className="meta-label">Created At</span>
                        <p className="meta-value">
                            {todo.createdAt
                                ? new Date(todo.createdAt).toLocaleString()
                                : "N/A"}
                        </p>
                    </div>

                    <div className="meta-item">
                        <span className="meta-label">Task Reference ID</span>
                        <code className="code-id">{todo.id}</code>
                    </div>
                </div>

                <div className="task-actions" style={{ marginTop: "12px" }}>
                    <button className="btn-sm btn-toggle" onClick={toggleComplete}>
                        {todo.completed ? "↺ Mark Pending" : "✓ Mark Complete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TodoDetails;