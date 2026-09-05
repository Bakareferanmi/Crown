import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ClockInOut from "./pages/ClockInOut";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/clock" element={<ClockInOut />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
