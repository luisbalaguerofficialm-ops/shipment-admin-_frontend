import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // 👈 icons

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 toggle state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE =
    import.meta.env.VITE_API_URL || "https://admin-ship-backend.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid email or password");
      }

      // Save authentication
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.admin));
      localStorage.setItem("role", data.admin.role);

      // Trigger App.jsx to re-render instantly
      window.dispatchEvent(new Event("storage"));

      toast.success("Welcome back! Redirecting...");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message = err.message || "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-blue-800">
          Admin Login
        </h2>

        {error && (
          <div className="text-red-600 bg-red-100 p-2 rounded-md text-center text-sm">
            {error}
          </div>
        )}

        {/* Email */}
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {/* Password + Eye Toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full border border-gray-300 rounded-lg p-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Login Button + Spinner */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-700 hover:bg-blue-800"
          }`}
        >
          {loading && <Loader2 className="animate-spin" size={20} />}
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center">
          <Link
            to="/reset-password"
            className="text-blue-600 underline font-semibold text-sm"
          >
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
