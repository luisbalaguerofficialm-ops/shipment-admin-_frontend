// ...existing code...
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Edit, Trash2, UserPlus, X } from "lucide-react";

const Users = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [users, setUsers] = useState([
    {
      name: "John Anderson",
      role: "Super Admin",
      email: "john@fastship.com",
      branch: "Head Office",
      status: "Active",
    },
    {
      name: "Grace Miller",
      role: "Admin",
      email: "grace@fastship.com",
      branch: "Head Office",
      status: "Active",
    },
    {
      name: "Lisa Wong",
      role: "Branch Manager",
      email: "lisa@fastship.com",
      branch: "Lagos Hub",
      status: "Active",
    },
    {
      name: "James Brown",
      role: "Dispatch Officer",
      email: "james@fastship.com",
      branch: "Abuja Branch",
      status: "Inactive",
    },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    branch: "",
    status: "Active",
  });

  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    role: "",
    branch: "",
    status: "Active",
  });

  // Add user via backend if SuperAdmin
  const handleAddUser = async (e) => {
    e.preventDefault();
    // Validation
    const { name, email, role, branch } = newUser;
    if (!name.trim() || !email.trim() || !role.trim() || !branch.trim()) {
      toast.error("All fields are required.");
      return;
    }
    // Email format
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    // Prevent duplicate emails
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error("A user with this email already exists.");
      return;
    }
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("You must be logged in as SuperAdmin to add users.");
      return;
    }
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL ||
          "https://admin-ship-backend.onrender.com"
        }/api/admin/register-admin`,
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
      if (res.ok && data.success) {
        toast.success("Admin registered successfully!");
        setUsers([...users, newUser]);
        setNewUser({
          name: "",
          email: "",
          role: "",
          branch: "",
          status: "Active",
        });
        setShowAddModal(false);
      } else {
        toast.error(data.message || "Failed to register admin.");
      }
    } catch (err) {
      console.error("Add admin error:", err);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleStartEdit = (index) => {
    setEditIndex(index);
    setEditUser({ ...users[index] });
    setShowEditModal(true);
  };

  const handleEditChange = (patch) => {
    setEditUser((prev) => ({ ...prev, ...patch }));
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (editIndex === null) return;
    setUsers((prev) => {
      const copy = [...prev];
      copy[editIndex] = { ...editUser };
      return copy;
    });
    setShowEditModal(false);
    setEditIndex(null);
  };

  const handleDeleteUser = (index) => {
    const user = users[index];
    const confirmed = window.confirm(
      `Delete user "${user.name}" (${user.email})? This action cannot be undone.`
    );
    if (!confirmed) return;
    setUsers((prev) => prev.filter((_, i) => i !== index));
    // if editing the deleted user, close edit modal
    if (showEditModal && editIndex === index) {
      setShowEditModal(false);
      setEditIndex(null);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Super Admin":
        return "bg-red-100 text-red-700";
      case "Admin":
        return "bg-indigo-100 text-indigo-700";
      case "Branch Manager":
        return "bg-blue-100 text-blue-700";
      case "Finance Officer":
        return "bg-green-100 text-green-700";
      case "Operations Manager":
        return "bg-purple-100 text-purple-700";
      case "Customer Support":
        return "bg-yellow-100 text-yellow-700";
      case "Delivery Agent":
        return "bg-orange-100 text-orange-700";
      case "IT Admin":
        return "bg-gray-100 text-gray-700";
      case "Warehouse Supervisor":
        return "bg-teal-100 text-teal-700";
      case "Dispatch Officer":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          User Management
        </h1>
        <Button
          className="bg-blue-700 text-white hover:bg-blue-800 flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <UserPlus size={16} /> Add User
        </Button>
      </div>

      {/* Users Table */}
      <Card className="overflow-x-auto shadow-md">
        <CardContent className="p-4">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="text-gray-600 border-b bg-gray-50">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Branch</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium text-gray-800">{user.name}</td>
                  <td className="p-3 text-gray-600">{user.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">{user.branch}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <Button
                      onClick={() => handleStartEdit(index)}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteUser(index)}
                      variant="outline"
                      className="border-gray-300 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Add New User
            </h3>

            <form onSubmit={handleAddUser} className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="w-full border rounded-lg p-2 outline-none"
                required
                name="name"
                autoComplete="name"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full border rounded-lg p-2 outline-none"
                required
                name="email"
                autoComplete="email"
              />
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                className="w-full border rounded-lg p-2 outline-none"
                required
              >
                <option value="">Select Role</option>
                <option>Super Admin</option>
                <option>Admin</option>
                <option>Branch Manager</option>
                <option>Operations Manager</option>
                <option>Finance Officer</option>
                <option>Warehouse Supervisor</option>
                <option>Dispatch Officer</option>
                <option>Delivery Agent</option>
                <option>Customer Support</option>
                <option>IT Admin</option>
              </select>
              <select
                value={newUser.branch}
                onChange={(e) =>
                  setNewUser({ ...newUser, branch: e.target.value })
                }
                className="w-full border rounded-lg p-2 outline-none"
                required
              >
                <option value="">Select Branch</option>
                <option>Head Office</option>
                <option>Lagos Hub</option>
                <option>Abuja Branch</option>
                <option>Kano Depot</option>
                <option>Port Harcourt Branch</option>
                <option>Ibadan Hub</option>
                <option>Enugu Depot</option>
              </select>

              <select
                value={newUser.status}
                onChange={(e) =>
                  setNewUser({ ...newUser, status: e.target.value })
                }
                className="w-full border rounded-lg p-2 outline-none"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>

              <Button
                type="submit"
                className="bg-blue-700 text-white w-full hover:bg-blue-800"
              >
                Add User
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96 relative">
            <button
              onClick={() => {
                setShowEditModal(false);
                setEditIndex(null);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Edit User
            </h3>

            <form onSubmit={handleUpdateUser} className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={editUser.name}
                onChange={(e) => handleEditChange({ name: e.target.value })}
                className="w-full border rounded-lg p-2 outline-none"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={editUser.email}
                onChange={(e) => handleEditChange({ email: e.target.value })}
                className="w-full border rounded-lg p-2 outline-none"
                required
              />
              <select
                value={editUser.role}
                onChange={(e) => handleEditChange({ role: e.target.value })}
                className="w-full border rounded-lg p-2 outline-none"
                required
              >
                <option value="">Select Role</option>
                <option>Super Admin</option>
                <option>Admin</option>
                <option>Branch Manager</option>
                <option>Operations Manager</option>
                <option>Finance Officer</option>
                <option>Warehouse Supervisor</option>
                <option>Dispatch Officer</option>
                <option>Delivery Agent</option>
                <option>Customer Support</option>
                <option>IT Admin</option>
              </select>
              <select
                value={editUser.branch}
                onChange={(e) => handleEditChange({ branch: e.target.value })}
                className="w-full border rounded-lg p-2 outline-none"
                required
              >
                <option value="">Select Branch</option>
                <option>Head Office</option>
                <option>Lagos Hub</option>
                <option>Abuja Branch</option>
                <option>Kano Depot</option>
                <option>Port Harcourt Branch</option>
                <option>Ibadan Hub</option>
                <option>Enugu Depot</option>
              </select>

              <select
                value={editUser.status}
                onChange={(e) => handleEditChange({ status: e.target.value })}
                className="w-full border rounded-lg p-2 outline-none"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-blue-700 text-white w-full hover:bg-blue-800"
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    // quick delete from edit modal
                    if (editIndex !== null) handleDeleteUser(editIndex);
                  }}
                  className="bg-red-50 text-red-600 border border-red-200 w-32"
                >
                  Delete
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
// ...existing code...
