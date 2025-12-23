// src/App.jsx
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import AdminRoutes from "./routes/AdminRoutes";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider, useAuth } from "./context/AuthContext";

// Loader image
import loaderImg from "./assets/Shipping-company-logo (1).jpg";

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [superAdminExists, setSuperAdminExists] = useState(false);

  const { role } = useAuth(); //  role from AuthContext
  const token = localStorage.getItem("authToken");

  // Check SuperAdmin on load
  useEffect(() => {
    let isMounted = true;

    const checkSuperAdmin = async () => {
      try {
        const res = await axios.get(
          "https://admin-ship-backend.onrender.com/api/admin/auth/check-superadmin"
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

  // Full-page loader
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <img
          src={loaderImg}
          alt="Loading..."
          className="w-16 h-16 animate-spin-smooth"
        />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" />

      <Routes>
        {/* CASE 1: No SuperAdmin exists → Only allow registration */}
        {!superAdminExists ? (
          <>
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/register" replace />} />
          </>
        ) : (
          <>
            {/* CASE 2: SuperAdmin exists */}
            {/* Redirect /register to /login immediately */}
            <Route
              path="/register"
              element={<Navigate to="/login" replace />}
            />

            {/* Login */}
            <Route
              path="/login"
              element={token ? <Navigate to="/dashboard" replace /> : <Login />}
            />

            {/* Protected Admin Routes */}
            <Route
              path="/*"
              element={
                token ? <AdminRoutes /> : <Navigate to="/login" replace />
              }
            />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
