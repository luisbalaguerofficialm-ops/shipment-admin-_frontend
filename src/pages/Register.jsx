import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Check if Super Admin already exists
  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        const res = await fetch(
          "http://localhost:4000/api/auth/check-superadmin"
        );
        const data = await res.json();

        if (data.exists) {
          // Hide registration form if Super Admin exists
          setDisabled(true);
          setMessage("Super Admin already registered. Redirecting to login...");
          setTimeout(() => navigate("/login"), 2500);
        }
      } catch (err) {
        console.error("Error checking Super Admin:", err);
      }
    };

    checkSuperAdmin();
  }, [navigate]);

  // ✅ Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle registration submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:4000/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("🎉 Super Admin registered successfully!");
        navigate("/login");
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setMessage("An unexpected error occurred. Please try again.");
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

        {message && (
          <p
            className={`text-center mb-4 ${
              disabled ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        {!disabled && (
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
        )}
      </div>
    </div>
  );
};

export default Register;
