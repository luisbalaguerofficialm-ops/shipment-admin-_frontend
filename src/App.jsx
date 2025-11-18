import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import AdminRoutes from "./routes/AdminRoutes";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";

//  ScrollReveal Import
import ScrollReveal from "scrollreveal";

function App() {
  const [loading, setLoading] = useState(true);
  const [superAdminExists, setSuperAdminExists] = useState(false);

  // Token + Role stored in state so UI updates instantly
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  // Listen for login/logout updates
  useEffect(() => {
    const updateAuthState = () => {
      setToken(localStorage.getItem("authToken"));
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", updateAuthState);
    updateAuthState();

    return () => window.removeEventListener("storage", updateAuthState);
  }, []);

  // Check SuperAdmin on load
  useEffect(() => {
    let isMounted = true;

    const checkSuperAdmin = async () => {
      try {
        const res = await axios.get(
          "https://admin-ship-backend.onrender.com/api/auth/check-superadmin"
        );

        if (isMounted) {
          setSuperAdminExists(res.data.superAdminExists ?? false);
        }
      } catch (error) {
        console.error("Error checking super admin:", error);

        if (isMounted) {
          toast.error("Unable to verify Super Admin. Please refresh.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkSuperAdmin();
    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ ScrollReveal Rotating Loader
  useEffect(() => {
    ScrollReveal().reveal("#app-loading-spinner", {
      rotate: { x: 0, y: 0, z: 360 },
      duration: 1200,
      easing: "ease-in-out",
      reset: true,
    });
  }, []);

  // ⏳ Loading Screen (Rotating)
  if (loading) {
    return (
      <div
        id="app-loading-spinner"
        className="flex justify-center items-center h-screen"
      >
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" />

        <Routes>
          {/* CASE 1: No SuperAdmin exists → Only show Register */}
          {!superAdminExists ? (
            <>
              <Route path="/" element={<Register />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              {/* Login */}
              <Route
                path="/login"
                element={
                  token ? <Navigate to="/dashboard" replace /> : <Login />
                }
              />

              {/* Register (SuperAdmin only) */}
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

              {/* Default redirect */}
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
    </AuthProvider>
  );
}

export default App;
