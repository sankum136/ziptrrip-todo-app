const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Sample Todos
let todos = [
    {
        id: 1,
        title: "Learn React",
        description: "Complete React basics",
        completed: false,
    },
    {
        id: 2,
        title: "Build Todo App",
        description: "Finish Ziptrrip assignment",
        completed: true,
    },
];

// Get all todos
app.get("/todos", (req, res) => {
    res.json(todos);
});

// Get todo by id
app.get("/todos/:id", (req, res) => {
    const todo = todos.find((t) => t.id == req.params.id);

    if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
    }

    res.json(todo);
});

// Add todo
app.post("/todos", (req, res) => {
    const newTodo = {
        id: Date.now(),
        ...req.body,
    };

    todos.push(newTodo);

    res.status(201).json(newTodo);
});

// Update todo
app.put("/todos/:id", (req, res) => {
    const index = todos.findIndex((t) => t.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: "Todo not found" });
    }

    todos[index] = { ...todos[index], ...req.body };

    res.json(todos[index]);
});

// Delete todo
app.delete("/todos/:id", (req, res) => {
    todos = todos.filter((t) => t.id != req.params.id);

    res.json({ message: "Todo deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});