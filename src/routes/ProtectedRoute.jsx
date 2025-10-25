// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  // If no token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If role not allowed → redirect to dashboard
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
