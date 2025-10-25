import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Match your backend route exactly
      const res = await fetch("http://localhost:4000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      //  Save full user data and token
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.admin));

      //  Redirect based on role
      if (data.admin.role === "SuperAdmin") {
        navigate("/admin/dashboard");
      } else if (data.admin.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        throw new Error("Unauthorized role");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-blue-800">
          Admin Login
        </h2>

        {error && (
          <div className="text-red-600 bg-red-100 p-2 rounded-md text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-semibold ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-700 hover:bg-blue-800"
          }`}
        >
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
