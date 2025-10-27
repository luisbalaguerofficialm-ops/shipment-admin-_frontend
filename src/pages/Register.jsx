// Last updated: 2025-10-26 — Added react-toastify toasts
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Use deployed backend URL from .env or fallback
  const API_BASE =
    import.meta.env.VITE_API_URL || "https://admin-ship-backend.onrender.com";

  // ✅ Check if a SuperAdmin already exists
  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/check-superadmin`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!res.ok) {
          throw new Error('Failed to check SuperAdmin status');
        }
        
        const data = await res.json();
        if (data.superAdminExists) {
          navigate("/login");
        }
      } catch (err) {
        console.error("Error checking SuperAdmin:", err);
        toast.error("Error connecting to server. Please check your connection and try again.");
        setError("Server connection error. Please refresh the page.");
      }
    };
    checkSuperAdmin();
  }, [navigate, API_BASE]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/admin/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("🎉 Super Admin registered successfully! Redirecting to login...");
        // give the toast a moment to show before navigating
        setTimeout(() => navigate("/login"), 1400);
      } else {
        toast.error(data.message || "Registration failed.");
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("An unexpected error occurred. Please try again.");
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-center text-blue-800">
          Super Admin Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md text-white font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
  {/* If SuperAdmin exists, user is redirected to login above. */}
      </div>
    </div>
  );
};

export default Register;
