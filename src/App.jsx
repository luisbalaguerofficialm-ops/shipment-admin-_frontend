import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminRoutes from "./routes/AdminRoutes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [superAdminExists, setSuperAdminExists] = useState(false);

  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  // ✅ Check if SuperAdmin exists in backend
  useEffect(() => {
    let isMounted = true; // prevents memory leak
    const checkSuperAdmin = async () => {
      try {
        const res = await axios.get(
          "https://admin-ship-backend.onrender.com/api/auth/check-superadmin"
        );
        console.log("✅ SuperAdmin check response:", res.data);

        if (isMounted) {
          // Use correct key from backend response
          setSuperAdminExists(res.data.superAdminExists ?? false);
        }
      } catch (error) {
        console.group("🚨 Error checking SuperAdmin");
        console.error("📍 Location: App.jsx -> checkSuperAdmin()");
        console.error("🧾 Error message:", error.message);
        if (error.response) {
          console.error("📦 Response data:", error.response.data);
          console.error("🔢 Status code:", error.response.status);
          console.error("🔗 Endpoint:", error.config?.url);
        } else if (error.request) {
          console.error("📡 No response received:", error.request);
        } else {
          console.error("❗ Axios setup error:", error);
        }
        console.error("🧠 Full stack trace:", error.stack);
        console.groupEnd();

        if (isMounted) {
          toast.error(
            "Could not verify SuperAdmin. Please refresh the page or check your connection."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkSuperAdmin();
    return () => {
      isMounted = false; // cleanup
    };
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">Loading...</div>
    );
  }

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" />

      <Routes>
        {/* Case 1: No SuperAdmin yet → only allow Register page */}
        {!superAdminExists ? (
          <>
            <Route path="/" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            {/* Case 2: SuperAdmin exists */}

            {/* 🔐 Login Page */}
            <Route
              path="/login"
              element={token ? <Navigate to="/dashboard" replace /> : <Login />}
            />

            {/* Register Page (only visible to logged-in SuperAdmin) */}
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

            {/* Protected Admin Routes */}
            <Route
              path="/*"
              element={
                token ? <AdminRoutes /> : <Navigate to="/login" replace />
              }
            />

            {/* Default redirect from root */}
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
