import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminRoutes from "./routes/AdminRoutes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";

function App() {
  const [loading, setLoading] = useState(true);
  const [superAdminExists, setSuperAdminExists] = useState(false);

  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  // ✅ Check if SuperAdmin exists in backend
  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/auth/check-superadmin"
        );
        setSuperAdminExists(res.data.exists);
      } catch (error) {
        console.error("Error checking SuperAdmin:", error);
      } finally {
        setLoading(false);
      }
    };
    checkSuperAdmin();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">Loading...</div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        {/* 🟩 Case 1: No SuperAdmin yet → only allow Register page */}
        {!superAdminExists ? (
          <>
            <Route path="/" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            {/* 🟦 Case 2: SuperAdmin exists */}

            {/* 🔐 Login Page */}
            <Route
              path="/login"
              element={token ? <Navigate to="/dashboard" replace /> : <Login />}
            />

            {/* 👑 Register Page (only visible to logged-in SuperAdmin) */}
            <Route
              path="/register"
              element={
                token && role === "SuperAdmin" ? (
                  <Register />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* 🧭 Protected Admin Routes */}
            <Route
              path="/*"
              element={
                token ? <AdminRoutes /> : <Navigate to="/login" replace />
              }
            />

            {/* Default Redirects */}
            <Route
              path="/"
              element={
                token ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
