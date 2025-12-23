import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { UserPlus, Edit, Trash2, X } from "lucide-react";

const Users = () => {
  const { role } = useAuth();

  /*HARD SECURITY: ONLY SUPER ADMIN */
  if (role !== "SuperAdmin") {
    return <Navigate to="/dashboard" replace />;
  }

  /* STATE */
  const [users, setUsers] = useState([]); 
  const [showAddModal, setShowAddModal] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    branch: "",
    status: "Active",
  });

  /* ADD ADMIN (SUPER ADMIN ONLY) */
  const handleAddUser = async (e) => {
    e.preventDefault();

    const { name, email, role, branch } = newUser;

    if (!name || !email || !role || !branch) {
      toast.error("All fields are required");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    try {
      const res = await fetch(
        "https://admin-ship-backend.onrender.com/api/admin/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newUser),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to create admin");
        return;
      }

      toast.success("Admin created successfully");

      setUsers((prev) => [...prev, data.admin]);
      setShowAddModal(false);
      setNewUser({
        name: "",
        email: "",
        role: "",
        branch: "",
        status: "Active",
      });
    } catch (err) {
      console.error("Create admin error:", err);
      toast.error("Network error");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          User Management
        </h1>

        {/* SUPER ADMIN ONLY */}
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-700 text-white hover:bg-blue-800 flex items-center gap-2"
        >
          <UserPlus size={16} /> Add Admin
        </Button>
      </div>

      {/* USERS TABLE */}
      <Card className="shadow-md">
        <CardContent className="p-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Branch</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">{user.branch}</td>
                    <td className="p-3">{user.status}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-300"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ADD USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded-lg p-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-2 right-2 text-gray-500"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-4">Add New Admin</h2>

            <form onSubmit={handleAddUser} className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border p-2 rounded-lg"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full border p-2 rounded-lg"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />

              <select
                className="w-full border p-2 rounded-lg"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
                <option value="">Select Role</option>
                <option>Admin</option>
                <option>SuperAdmin</option>
              </select>

              <input
                type="text"
                placeholder="Branch"
                className="w-full border p-2 rounded-lg"
                value={newUser.branch}
                onChange={(e) =>
                  setNewUser({ ...newUser, branch: e.target.value })
                }
              />

              <Button
                type="submit"
                className="w-full bg-blue-700 text-white hover:bg-blue-800"
              >
                Create Admin
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
