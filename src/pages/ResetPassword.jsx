// ...existing code...
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // optional reset token from email
  const navigate = useNavigate();

  // ...existing code...
  // hide sidebar / navbar / topbar while this page is mounted
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
      "nav", // fallback (will hide any <nav> elements)
    ];

    const changed = [];

    selectors.forEach((sel) => {
      try {
        const nodes = document.querySelectorAll(sel);
        nodes.forEach((el) => {
          // remember previous inline display so we can restore exactly
          changed.push({ el, prev: el.style.display });
          el.style.display = "none";
        });
      } catch (e) {
        // ignore selector errors
      }
    });

    return () => {
      // restore original inline display values
      changed.forEach(({ el, prev }) => {
        el.style.display = prev || "";
      });
    };
  }, []);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      // Simulate API call (replace with actual fetch to backend)
      await new Promise((res) => setTimeout(res, 1500));

      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
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
// ...existing code...
