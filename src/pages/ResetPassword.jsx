import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // token from email link
  const navigate = useNavigate();

  // ✅ Hide navbars and sidebars
  useEffect(() => {
    const selectors = [
      "#sidebar",
      ".sidebar",
      "[data-role='sidebar']",
      "#navbar",
      ".navbar",
      "[data-role='navbar']",
      "#topbar",
      ".topbar",
      "[data-role='topbar']",
      "#header",
      ".header",
      "[data-role='header']",
      ".top-nav",
      ".topnav",
      "nav",
    ];

    const changed = [];
    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        changed.push({ el, prev: el.style.display });
        el.style.display = "none";
      });
    });

    return () => {
      changed.forEach(({ el, prev }) => {
        el.style.display = prev || "";
      });
    };
  }, []);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in both fields.");
      return;
    }

    if (password.length < 7) {
      toast.error("Password must be at least 7 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!token) {
      toast.error("Reset token missing or invalid.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/admin/reset-password/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      toast.success("✅ Password reset successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Reset error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">
            Reset Your Password
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter and confirm your new password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password Field */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">
              New Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <Lock size={18} className="text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full outline-none bg-transparent text-gray-700"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">
              Confirm Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <Lock size={18} className="text-gray-400 mr-2" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full outline-none bg-transparent text-gray-700"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-700 text-white font-medium py-2 rounded-lg hover:bg-blue-800 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          <CheckCircle className="inline text-green-600 mr-1" size={16} />
          Secure password reset
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
