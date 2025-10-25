import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Bell, CheckCircle, Trash2 } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Shipment Created",
      message: "Shipment #A12345 has been successfully created.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Delivery Completed",
      message: "Shipment #A12233 has been delivered to the destination.",
      time: "1 day ago",
      read: true,
    },
    {
      id: 3,
      title: "Payment Received",
      message: "Payment for Shipment #A12110 has been confirmed.",
      time: "3 days ago",
      read: false,
    },
  ]);

  const markAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const clearAll = () => setNotifications([]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Bell className="text-blue-700" /> Notifications
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
              key={n.id}
              className={`${
                n.read ? "bg-gray-50" : "bg-white"
              } border rounded-lg shadow-sm hover:shadow-md transition`}
            >
              <CardContent className="p-4 flex justify-between items-start">
                <div>
                  <h2
                    className={`font-semibold ${
                      n.read ? "text-gray-600" : "text-gray-900"
                    }`}
                  >
                    {n.title}
                  </h2>
                  <p className="text-gray-500 text-sm">{n.message}</p>
                  <span className="text-xs text-gray-400">{n.time}</span>
                </div>
                {!n.read && (
                  <button
                    onClick={() => markAsRead(n.id)}
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
