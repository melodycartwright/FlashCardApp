import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Decks from "./routes/Decks";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/decks" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/decks" element={<Decks />} />
      </Routes>
    </div>
  );
}

export default App;
