import { Routes, Route } from "react-router-dom";
import TodoList from "./pages/TodoList";
import TodoDetails from "./pages/TodoDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TodoList />} />
      <Route path="/todo" element={<TodoDetails />} />
    </Routes>
  );
}

export default App;