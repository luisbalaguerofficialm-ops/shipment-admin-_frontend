import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Mail, Send, User, CheckCircle, Circle, Filter } from "lucide-react";
import toast from "react-hot-toast";

const Messages = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "John Doe",
      email: "john@example.com",
      subject: "Shipment delay inquiry",
      body: "Hi, my parcel has not arrived yet. Can you provide an update?",
      time: "2025-10-15 14:23",
      status: "unread",
    },
    {
      id: 2,
      sender: "Jane Smith",
      email: "jane.smith@company.com",
      subject: "Payment confirmation issue",
      body: "Hello, I made a payment for my shipment but haven’t received confirmation.",
      time: "2025-10-14 09:48",
      status: "read",
    },
    {
      id: 3,
      sender: "David Johnson",
      email: "david.j@logistics.net",
      subject: "Request for invoice copy",
      body: "Please send me a copy of my shipment invoice.",
      time: "2025-10-13 11:12",
      status: "read",
    },
  ]);

  const filteredMessages = filterUnread
    ? messages.filter((msg) => msg.status === "unread")
    : messages;

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === message.id ? { ...msg, status: "read" } : msg
      )
    );
  };

  const handleSendReply = () => {
    if (!reply.trim()) {
      toast.error("Reply cannot be empty!");
      return;
    }
    toast.success("Reply sent successfully!");
    setReply("");
  };

  const toggleFilter = () => {
    setFilterUnread(!filterUnread);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Messages</h1>
        <button
          onClick={toggleFilter}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
        >
          <Filter size={16} />
          {filterUnread ? "Show All" : "Show Unread"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar (Messages List) */}
        <Card className="col-span-1 shadow-md">
          <CardContent className="p-0">
            <ul className="divide-y divide-gray-200">
              {filteredMessages.length === 0 ? (
                <p className="p-4 text-gray-500">No messages found.</p>
              ) : (
                filteredMessages.map((msg) => (
                  <li
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 cursor-pointer hover:bg-gray-100 transition ${
                      msg.status === "unread" ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {msg.sender}
                        </h3>
                        <p className="text-sm text-gray-500">{msg.subject}</p>
                      </div>
                      {msg.status === "unread" ? (
                        <Circle size={14} className="text-blue-500" />
                      ) : (
                        <CheckCircle size={14} className="text-gray-400" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Message Detail & Reply */}
        <Card className="col-span-2 shadow-md">
          <CardContent className="p-6 space-y-4">
            {selectedMessage ? (
              <>
                <div className="flex items-center justify-between border-b pb-3 border-gray-200">
                  <div>
                    <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                      <Mail size={18} /> {selectedMessage.subject}
                    </h2>
                    <p className="text-sm text-gray-500">
                      From: {selectedMessage.sender} ({selectedMessage.email})
                    </p>
                    <p className="text-xs text-gray-400">
                      {selectedMessage.time}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedMessage.body}
                  </p>
                </div>

                {/* Reply Box */}
                <div className="space-y-2">
                  <textarea
                    className="w-full border rounded-lg p-2 h-24 text-gray-800"
                    placeholder="Type your reply here..."
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
                <User size={48} className="mx-auto mb-3 text-gray-400" />
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
