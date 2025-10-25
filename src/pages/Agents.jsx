// ...existing code...
import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Plus,
  ShieldCheck,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const Agents = () => {
  const [agents, setAgents] = useState([
    {
      id: 1,
      name: "Samuel Johnson",
      email: "samuel.johnson@courier.com",
      phone: "+2348035552211",
      branch: "Lagos Main Branch",
      status: "Active",
    },
    {
      id: 2,
      name: "Grace Adams",
      email: "grace.adams@courier.com",
      phone: "+2348081123377",
      branch: "Abuja Sorting Hub",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Ibrahim Musa",
      email: "ibrahim.musa@courier.com",
      phone: "+2348093336655",
      branch: "Port Harcourt Delivery Center",
      status: "Active",
    },
  ]);

  const [newAgent, setNewAgent] = useState({
    name: "",
    email: "",
    phone: "",
    branch: "",
    status: "Active",
  });

  // edit modal state
  const [editingAgent, setEditingAgent] = useState(null); // null or agent object
  const [showEditModal, setShowEditModal] = useState(false);

  const handleAddAgent = () => {
    if (
      !newAgent.name ||
      !newAgent.email ||
      !newAgent.phone ||
      !newAgent.branch ||
      !newAgent.status
    ) {
      toast.error("Please fill in all agent details!");
      return;
    }

    const newEntry = {
      id: Date.now(),
      ...newAgent,
    };

    setAgents((prev) => [...prev, newEntry]);
    setNewAgent({
      name: "",
      email: "",
      phone: "",
      branch: "",
      status: "Active",
    });
    toast.success("New agent added successfully!");
  };

  const handleEditClick = (agent) => {
    // clone to avoid mutating original until save
    setEditingAgent({ ...agent });
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this agent? This action cannot be undone.")) return;
    setAgents((prev) => prev.filter((a) => a.id !== id));
    toast.success("Agent deleted.");
    // close edit modal if deleted agent was being edited
    if (editingAgent && editingAgent.id === id) {
      setShowEditModal(false);
      setEditingAgent(null);
    }
  };

  const handleSaveEdit = () => {
    if (
      !editingAgent.name ||
      !editingAgent.email ||
      !editingAgent.phone ||
      !editingAgent.branch ||
      !editingAgent.status
    ) {
      toast.error("Please fill in all agent fields.");
      return;
    }

    setAgents((prev) =>
      prev.map((a) => (a.id === editingAgent.id ? { ...editingAgent } : a))
    );
    setShowEditModal(false);
    setEditingAgent(null);
    toast.success("Agent updated.");
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingAgent(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Agents Management
        </h1>
        <div className="flex items-center gap-2 text-gray-500">
          <ShieldCheck size={18} />
          <span>{agents.length} Total Agents</span>
        </div>
      </div>

      {/* Add Agent Form */}
      <Card className="shadow-md border border-gray-200 bg-white">
        <CardContent className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <Plus size={18} /> Add New Agent
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={newAgent.name}
              onChange={(e) =>
                setNewAgent({ ...newAgent, name: e.target.value })
              }
              className="border rounded-lg p-2 border-gray-300 text-gray-800 bg-white"
            />
            <input
              type="email"
              placeholder="Email"
              value={newAgent.email}
              onChange={(e) =>
                setNewAgent({ ...newAgent, email: e.target.value })
              }
              className="border rounded-lg p-2 border-gray-300 text-gray-800 bg-white"
            />
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Phone (numbers only)"
              value={newAgent.phone}
              onChange={(e) =>
                // keep numbers only
                setNewAgent({
                  ...newAgent,
                  phone: e.target.value.replace(/\D/g, ""),
                })
              }
              className="border rounded-lg p-2 border-gray-300 text-gray-800 bg-white"
            />
            <input
              type="text"
              placeholder="Branch Assigned"
              value={newAgent.branch}
              onChange={(e) =>
                setNewAgent({ ...newAgent, branch: e.target.value })
              }
              className="border rounded-lg p-2 border-gray-300 text-gray-800 bg-white"
            />
            {/* Status select */}
            <select
              value={newAgent.status}
              onChange={(e) =>
                setNewAgent({ ...newAgent, status: e.target.value })
              }
              className="border rounded-lg p-2 border-gray-300 text-gray-800 bg-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <button
            onClick={handleAddAgent}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Add Agent
          </button>
        </CardContent>
      </Card>

      {/* Agents Table */}
      <Card className="shadow-md border border-gray-200 bg-white">
        <CardContent>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Agents List
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border p-3">#</th>
                  <th className="border p-3">Name</th>
                  <th className="border p-3">Email</th>
                  <th className="border p-3">Phone</th>
                  <th className="border p-3">Branch</th>
                  <th className="border p-3">Status</th>
                  <th className="border p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr
                    key={agent.id}
                    className="hover:bg-gray-50 text-gray-700 transition"
                  >
                    <td className="border p-3 text-center">{agent.id}</td>
                    <td className="border p-3 flex items-center gap-2">
                      <User size={16} className="text-blue-600" />
                      {agent.name}
                    </td>
                    <td className="border p-3 flex items-center gap-2">
                      <Mail size={16} className="text-gray-500" />
                      {agent.email}
                    </td>
                    <td className="border p-3 flex items-center gap-2">
                      <Phone size={16} className="text-gray-500" />
                      {agent.phone}
                    </td>
                    <td className="border p-3 flex items-center gap-2">
                      <MapPin size={16} className="text-gray-500" />
                      {agent.branch}
                    </td>
                    <td className="border p-3 text-center">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          agent.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {agent.status}
                      </span>
                    </td>
                    <td className="border p-3 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEditClick(agent)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(agent.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {agents.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      No agents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {showEditModal && editingAgent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Agent</h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={editingAgent.name}
                onChange={(e) =>
                  setEditingAgent({ ...editingAgent, name: e.target.value })
                }
                className="border rounded-lg p-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={editingAgent.email}
                onChange={(e) =>
                  setEditingAgent({ ...editingAgent, email: e.target.value })
                }
                className="border rounded-lg p-2"
              />
              <input
                type="tel"
                inputMode="numeric"
                placeholder="Phone (numbers only)"
                value={editingAgent.phone}
                onChange={(e) =>
                  setEditingAgent({
                    ...editingAgent,
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Branch Assigned"
                value={editingAgent.branch}
                onChange={(e) =>
                  setEditingAgent({ ...editingAgent, branch: e.target.value })
                }
                className="border rounded-lg p-2"
              />
              <select
                value={editingAgent.status}
                onChange={(e) =>
                  setEditingAgent({ ...editingAgent, status: e.target.value })
                }
                className="border rounded-lg p-2"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;
// ...existing code...
