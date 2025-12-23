import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Bell, CheckCircle, Trash2, Package } from "lucide-react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  const token = localStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const socket = useRef(null);

  // ===== FETCH NOTIFICATIONS =====
  useEffect(() => {
    if (!token || !user) return;

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
          setUnreadCount(data.notifications.filter((n) => !n.read).length);
        }
      } catch (err) {
        console.error("Fetch notifications error:", err);
        toast.error("Failed to fetch notifications");
      }
    };

    fetchNotifications();

    // ===== SOCKET.IO =====
    socket.current = io("https://admin-ship-backend.onrender.com", {
      query: { userId: user._id },
    });

    socket.current.on("notification:new", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast.success("New notification received!");
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [token, user]);

  // ===== MARK AS READ =====
  const markAsRead = async (id) => {
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
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (err) {
      console.error("Mark as read error:", err);
      toast.error("Failed to mark notification as read");
    }
  };

  // ===== CLEAR ALL =====
  const clearAll = async () => {
    try {
      await Promise.all(
        notifications.map((n) =>
          fetch(
            `https://admin-ship-backend.onrender.com/api/notifications/${n._id}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        )
      );
      setNotifications([]);
      setUnreadCount(0);
      toast.success("All notifications cleared");
    } catch (err) {
      console.error("Clear notifications error:", err);
      toast.error("Failed to clear notifications");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Bell className="text-blue-700" /> Notifications
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
              {unreadCount}
            </span>
          )}
        </h1>

        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-2 text-red-600 hover:text-red-800"
          >
            <Trash2 size={16} /> Clear All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="text-center text-gray-500 py-10">
            No notifications at the moment.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <Card
              key={n._id}
              className={`${
                n.read ? "bg-gray-50" : "bg-white"
              } border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer`}
              onClick={() => markAsRead(n._id)}
            >
              <CardContent className="p-4 flex justify-between items-start">
                <div className="flex items-start gap-3">
                  {n.type === "info" && (
                    <Package size={18} className="text-blue-600" />
                  )}
                  {n.type === "success" && (
                    <CheckCircle size={18} className="text-green-600" />
                  )}
                  <div>
                    <h2
                      className={`font-semibold ${
                        n.read ? "text-gray-600" : "text-gray-900"
                      }`}
                    >
                      {n.title || "Notification"}
                    </h2>
                    <p className="text-gray-500 text-sm">{n.message}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                {!n.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(n._id);
                    }}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <CheckCircle size={16} /> Mark as Read
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
