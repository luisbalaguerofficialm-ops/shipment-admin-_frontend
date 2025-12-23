import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Search, Filter, Clock, User, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import io from "socket.io-client";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const token = localStorage.getItem("authToken");

  // Fetch initial logs from backend
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(
          "https://admin-ship-backend.onrender.com/api/audits",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message || "Failed to fetch audit logs");
          return;
        }
        setLogs(data.logs || []);
      } catch (err) {
        console.error(err);
        toast.error("Network error! Could not fetch audit logs.");
      }
    };
    fetchLogs();
  }, [token]);

  // Real-time updates via Socket.IO
  useEffect(() => {
    const socket = io("https://admin-ship-backend.onrender.com", {
      transports: ["websocket"],
      auth: { token },
    });

    console.log("📡 Connected to audit log socket");

    socket.on("audit:new", (newLog) => {
      setLogs((prev) => [newLog, ...prev]); // Add newest logs at the top
      toast.success("📢 New audit log recorded");
    });

    return () => {
      socket.disconnect();
      console.log("🔌 Audit log socket disconnected");
    };
  }, [token]);

  // Filtered + searched logs
  const filteredLogs = logs.filter(
    (log) =>
      (filter === "All" || log.role === filter) &&
      log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Audit Logs</h1>

      <Card className="shadow-md bg-white border border-gray-200">
        <CardContent className="p-6 space-y-6">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-1/2">
              <Search size={18} className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search audit logs..."
                className="flex-1 outline-none bg-transparent text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
              <Filter size={18} className="text-gray-500 mr-2" />
              <select
                className="outline-none bg-transparent text-gray-700"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Agent">Agent</option>
                <option value="Finance">Finance</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Action</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">IP Address</th>
                  <th className="px-4 py-2 text-left">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-2 flex items-center gap-2 text-gray-700">
                        <User size={16} /> {log.user}
                      </td>
                      <td className="px-4 py-2 text-gray-600">{log.action}</td>
                      <td className="px-4 py-2 text-gray-600">
                        <ShieldCheck
                          size={16}
                          className="inline text-blue-600 mr-1"
                        />
                        {log.role}
                      </td>
                      <td className="px-4 py-2 text-gray-500">{log.ip}</td>
                      <td className="px-4 py-2 flex items-center gap-1 text-gray-500">
                        <Clock size={14} /> {log.time}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 py-4">
                      No audit logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Clear Filter Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={() => {
                setFilter("All");
                setSearchTerm("");
                toast("Filters cleared");
              }}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Reset Filters
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
