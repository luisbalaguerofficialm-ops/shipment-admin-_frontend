// src/components/layout/Topbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Bell, LogOut, X, CheckCircle, Package } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Topbar({ activePage, onLogout }) {
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const notifRef = useRef(null);

  const notifications = [
    {
      id: 1,
      message: "New shipment order created by John Doe",
      icon: <Package size={18} className="text-blue-600" />,
      time: "2 mins ago",
    },
    {
      id: 2,
      message: "Customer Jane Doe updated address",
      icon: <CheckCircle size={18} className="text-green-600" />,
      time: "10 mins ago",
    },
    {
      id: 3,
      message: "Shipment #00234 delivered successfully",
      icon: <CheckCircle size={18} className="text-green-500" />,
      time: "30 mins ago",
    },
  ];

  const handleLogoutConfirm = () => {
    try {
      if (typeof onLogout === "function") onLogout();

      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      toast.success("Logged out successfully");
      setShowLogoutPrompt(false);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed");
    }
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      try {
        // Defensive checks: ensure refs and event target are valid Nodes
        if (!notifRef.current) return;
        const target = e && e.target;
        if (!target || !(target instanceof Node)) return;
        // ensure the target is still in the document (avoids "Node cannot be found" errors)
        if (!document.contains(target)) return;
        if (!notifRef.current.contains(target)) {
          setShowNotifications(false);
        }
      } catch (err) {
        // Log and swallow — avoid crashing due to transient DOM state
        // eslint-disable-next-line no-console
        console.warn("Click outside handler error:", err);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-8 relative">
        <h1 className="text-2xl font-bold text-gray-800">{activePage}</h1>

        <div className="flex items-center gap-4 py-5 pr-4">
          {/* Notifications Button */}
          <div className="relative" ref={notifRef}>
            <Button
              onClick={() => setShowNotifications(!showNotifications)}
              className="bg-blue-700 text-white hover:bg-blue-800 flex items-center gap-2 relative"
            >
              <Bell size={16} />
              Notifications
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            </Button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl border border-gray-200 z-50 animate-fadeIn">
                <div className="p-3 border-b flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700 text-sm">
                    Notifications
                  </h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className="flex items-start gap-3 p-3 hover:bg-gray-50 transition"
                      >
                        {n.icon}
                        <div>
                          <p className="text-sm text-gray-700">{n.message}</p>
                          <span className="text-xs text-gray-400">
                            {n.time}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 text-sm py-4">
                      No new notifications
                    </p>
                  )}
                </div>
                <div className="border-t p-2 text-center">
                  <button className="text-blue-600 text-sm hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <Button
            variant="outline"
            onClick={() => setShowLogoutPrompt(true)}
            className="text-gray-700 bg-yellow-500 border-gray-300 hover:bg-yellow-700 flex items-center gap-2"
          >
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutPrompt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-96 p-6 text-center relative animate-fadeIn">
            <button
              onClick={() => setShowLogoutPrompt(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out of your admin account?
            </p>

            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setShowLogoutPrompt(false)}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogoutConfirm}
                className="bg-yellow-600 text-white hover:bg-yellow-700 px-5"
              >
                Yes, Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
