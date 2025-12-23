import React, { useState, useEffect, useRef } from "react";
import { Bell, LogOut, Package, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export default function Topbar({ activePage, onLogout }) {
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const [role, setRole] = useState("");

  const notifRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ================= INIT =================
  useEffect(() => {
    if (!token || !user) return;

    setRole(user.role);

    // ---- Fetch notifications ----
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          "https://admin-ship-backend.onrender.com/api/notifications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (data.success) {
          setNotifications(data.notifications);
          setUnreadNotifications(
            data.notifications.filter((n) => !n.read).length
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    // ---- Fetch unread messages count ----
    const fetchUnreadMessages = async () => {
      try {
        const res = await fetch(
          "https://admin-ship-backend.onrender.com/api/messages/unread-count",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (data.success) setUnreadMessages(data.count);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
    fetchUnreadMessages();

    // ---- Socket.IO ----
    socketRef.current = io("https://admin-ship-backend.onrender.com", {
      transports: ["websocket"],
      auth: { token },
    });

    socketRef.current.on("notification:new", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadNotifications((prev) => prev + 1);
      toast.success("New notification received");
    });

    socketRef.current.on("message:new", () => {
      setUnreadMessages((prev) => prev + 1);
    });

    socketRef.current.on("message:read", () => {
      setUnreadMessages((prev) => Math.max(prev - 1, 0));
    });

    return () => socketRef.current?.disconnect();
  }, [token, user]);

  // ================= MARK NOTIFICATION READ =================
  const handleMarkRead = async (id) => {
    try {
      const res = await fetch(
        `https://admin-ship-backend.onrender.com/api/notifications/${id}/read`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
        setUnreadNotifications((prev) => Math.max(prev - 1, 0));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ================= LOGOUT =================
  const handleLogoutConfirm = () => {
    if (typeof onLogout === "function") onLogout();
    localStorage.clear();
    toast.success("Logged out");
    navigate("/login", { replace: true });
  };

  // ================= CLICK OUTSIDE =================
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">{activePage}</h1>

          {role && (
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                role === "SuperAdmin"
                  ? "bg-red-100 text-red-700"
                  : "bg-indigo-100 text-indigo-700"
              }`}
            >
              {role}
            </span>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* Messages */}
          <Link
            to="/dashboard/messages"
            className="relative bg-gray-100 p-2 rounded-lg hover:bg-gray-200"
          >
            <Mail size={18} />
            {unreadMessages > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {unreadMessages}
              </span>
            )}
          </Link>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <Button
              onClick={() => setShowNotifications(!showNotifications)}
              className="bg-blue-700 text-white hover:bg-blue-800 relative"
            >
              <Bell size={16} />
              {unreadNotifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadNotifications}
                </span>
              )}
            </Button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg z-50">
                <div className="p-3 border-b font-semibold">
                  Notifications
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 && (
                    <p className="text-center text-gray-500 py-4 text-sm">
                      No notifications
                    </p>
                  )}

                  {notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => handleMarkRead(n._id)}
                      className={`p-3 flex gap-3 cursor-pointer hover:bg-gray-50 ${
                        !n.read ? "bg-gray-100" : ""
                      }`}
                    >
                      <Package size={18} className="text-blue-600" />
                      <div>
                        <p className="text-sm">{n.message}</p>
                        <span className="text-xs text-gray-400">
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Logout */}
          <Button
            onClick={() => setShowLogoutPrompt(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-800"
          >
            <LogOut size={16} />
          </Button>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutPrompt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setShowLogoutPrompt(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleLogoutConfirm}
                className="bg-yellow-600 text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
