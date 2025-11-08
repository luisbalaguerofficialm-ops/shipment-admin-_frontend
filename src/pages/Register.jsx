// Last updated: 2025-11-08 — Fixed navigation race condition and improved logging
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
    let isMounted = true; // prevents React state updates after unmount
    const checkSuperAdmin = async () => {
      try {
        console.log(
          "🔍 Checking SuperAdmin status from:",
          `${API_BASE}/api/admin/check-superadmin`
        );
        const res = await fetch(`${API_BASE}/api/admin/check-superadmin`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ SuperAdmin check response:", data);

        if (isMounted && data.superAdminExists) {
          console.log("➡️ SuperAdmin already exists — navigating to /login...");
          // Wait a tiny bit to let DOM settle before navigating
          setTimeout(() => {
            console.log("⚙️ Triggering navigate('/login') now...");
            navigate("/login", { replace: true });
          }, 500);
        }
      } catch (err) {
        console.error("🚨 Error checking SuperAdmin:", err);
        if (isMounted) {
          toast.error("Could not verify SuperAdmin. Please try again.");
          setError("Connection error — please refresh the page.");
        }
      }
    };

    checkSuperAdmin();
    return () => {
      // prevent memory leak warning
      isMounted = false;
    };
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
      console.log(
        "📤 Sending registration request to:",
        `${API_BASE}/api/admin/register`
      );
      const res = await fetch(`${API_BASE}/api/admin/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("📩 Registration response:", data);

      if (res.ok && data.success) {
        toast.success(
          "🎉 Super Admin registered successfully! Redirecting to login..."
        );
        console.log("✅ Registration successful, navigating to /login...");
        setTimeout(() => navigate("/login", { replace: true }), 1500);
      } else {
        toast.error(data.message || "Registration failed.");
        setError(data.message || "Registration failed.");
        console.error("❌ Registration failed:", data);
      }
    } catch (err) {
      console.error("🚨 Registration error:", err);
      toast.error("An unexpected error occurred. Please try again.");
      setError("Unexpected error occurred. Please try again.");
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

        {error && (
          <p className="text-red-600 text-sm text-center mb-3 font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
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
      </div>
    </div>
  );
};

export default Register;
