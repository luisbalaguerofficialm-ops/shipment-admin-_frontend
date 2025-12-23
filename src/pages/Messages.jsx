import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import {
  Mail,
  Send,
  User,
  CheckCircle,
  Circle,
  Filter,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);

  const socketRef = useRef(null);
  const token = localStorage.getItem("authToken");

  // ================= FETCH MESSAGES =================
  useEffect(() => {
    if (!token) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          "https://admin-ship-backend.onrender.com/api/messages",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (data.success) setMessages(data.messages);
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    };

    fetchMessages();

    // ================= SOCKET.IO =================
    socketRef.current = io("https://admin-ship-backend.onrender.com", {
      transports: ["websocket"],
      auth: { token },
    });

    socketRef.current.on("message:new", (message) => {
      setMessages((prev) => [message, ...prev]);
      toast.success("New message received");
    });

    socketRef.current.on("message:deleted", (id) => {
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
    });

    return () => socketRef.current?.disconnect();
  }, [token, selectedMessage]);

  // ================= MARK AS READ =================
  const handleSelectMessage = async (message) => {
    setSelectedMessage(message);

    if (!message.isRead) {
      try {
        await fetch(
          `https://admin-ship-backend.onrender.com/api/messages/${message._id}/read`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMessages((prev) =>
          prev.map((m) =>
            m._id === message._id ? { ...m, isRead: true } : m
          )
        );

        socketRef.current?.emit("message:read");
      } catch (err) {
        console.error("Mark as read error:", err);
      }
    }
  };

  // ================= DELETE MESSAGE =================
  const handleDeleteMessage = async () => {
    if (!selectedMessage) return;
    if (!confirm("Delete this message?")) return;

    try {
      await fetch(
        `https://admin-ship-backend.onrender.com/api/messages/${selectedMessage._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages((prev) =>
        prev.filter((m) => m._id !== selectedMessage._id)
      );

      socketRef.current?.emit(
        "message:deleted",
        selectedMessage._id
      );

      setSelectedMessage(null);
      toast.success("Message deleted");
    } catch (err) {
      console.error("Delete message error:", err);
      toast.error("Failed to delete message");
    }
  };

  // ================= SEND REPLY (EMAIL READY) =================
  const handleSendReply = async () => {
    if (!reply.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      await fetch(
        `https://admin-ship-backend.onrender.com/api/messages/${selectedMessage._id}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reply }),
        }
      );

      toast.success("Reply sent via email");
      setReply("");
    } catch (err) {
      console.error("Reply error:", err);
      toast.error("Failed to send reply");
    }
  };

  const filteredMessages = filterUnread
    ? messages.filter((m) => !m.isRead)
    : messages;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Messages
        </h1>
        <button
          onClick={() => setFilterUnread(!filterUnread)}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
        >
          <Filter size={16} />
          {filterUnread ? "Show All" : "Show Unread"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <Card className="col-span-1 shadow-md">
          <CardContent className="p-0">
            <ul className="divide-y divide-gray-200">
              {filteredMessages.length === 0 ? (
                <p className="p-4 text-gray-500">
                  No messages found
                </p>
              ) : (
                filteredMessages.map((msg) => (
                  <li
                    key={msg._id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 cursor-pointer hover:bg-gray-100 ${
                      !msg.isRead ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {msg.senderName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {msg.subject}
                        </p>
                      </div>
                      {!msg.isRead ? (
                        <Circle
                          size={14}
                          className="text-blue-500"
                        />
                      ) : (
                        <CheckCircle
                          size={14}
                          className="text-gray-400"
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(
                        msg.createdAt
                      ).toLocaleString()}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Message Details */}
        <Card className="col-span-2 shadow-md">
          <CardContent className="p-6 space-y-4">
            {selectedMessage ? (
              <>
                <div className="flex justify-between items-start border-b pb-3">
                  <div>
                    <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                      <Mail size={18} />
                      {selectedMessage.subject}
                    </h2>
                    <p className="text-sm text-gray-500">
                      From: {selectedMessage.senderName} (
                      {selectedMessage.senderEmail})
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(
                        selectedMessage.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={handleDeleteMessage}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedMessage.body}
                  </p>
                </div>

                {/* Reply */}
                <div className="space-y-2">
                  <textarea
                    className="w-full border rounded-lg p-2 h-24"
                    placeholder="Type your reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <button
                    onClick={handleSendReply}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    <Send size={16} /> Send Reply
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-20">
                <User
                  size={48}
                  className="mx-auto mb-3 text-gray-400"
                />
                <p>Select a message to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
