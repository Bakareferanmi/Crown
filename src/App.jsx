import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DemoProvider, useDemo } from "./context/DemoContext";
import Login from "./pages/Login";
import ClockInOut from "./pages/ClockInOut";
import AdminDashboard from "./pages/AdminDashboard";

function ProtectedRoute({ children, requireAdmin }) {
  const { currentUser } = useDemo();
  if (!currentUser) return <Navigate to="/" replace />;
  if (requireAdmin && currentUser.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/clock"
        element={
          <ProtectedRoute>
            <ClockInOut />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </DemoProvider>
  );
}
