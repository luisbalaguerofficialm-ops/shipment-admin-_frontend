// ...existing code...
import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Search, UserPlus, Edit, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "08012345678",
      address: "Lagos, Nigeria",
      totalShipments: 12,
    },
    {
      id: 2,
      name: "Michael Smith",
      email: "mike@smith.com",
      phone: "08087654321",
      address: "Abuja, Nigeria",
      totalShipments: 7,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // --- NEW: edit modal state ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  const handleAddCustomer = () => {
    if (
      !newCustomer.name ||
      !newCustomer.email ||
      !newCustomer.phone ||
      !newCustomer.address
    ) {
      toast.error("Please fill out all fields!");
      return;
    }

    const newEntry = {
      id: customers.length + 1,
      ...newCustomer,
      totalShipments: 0,
    };

    setCustomers([...customers, newEntry]);
    setNewCustomer({ name: "", email: "", phone: "", address: "" });
    setShowModal(false);
    toast.success("New customer added!");
  };

  // --- NEW: start editing a customer ---
  const handleStartEdit = (id) => {
    const c = customers.find((x) => x.id === id);
    if (!c) return;
    setEditCustomer({ ...c });
    setShowEditModal(true);
  };

  // --- NEW: update edited customer ---
  const handleUpdateCustomer = () => {
    if (!editCustomer) return;
    if (
      !editCustomer.name ||
      !editCustomer.email ||
      !editCustomer.phone ||
      !editCustomer.address
    ) {
      toast.error("Please fill out all fields!");
      return;
    }
    setCustomers((prev) =>
      prev.map((c) => (c.id === editCustomer.id ? { ...editCustomer } : c))
    );
    setShowEditModal(false);
    setEditCustomer(null);
    toast.success("Customer updated!");
  };

  // --- NEW: delete customer ---
  const handleDeleteCustomer = (id) => {
    const c = customers.find((x) => x.id === id);
    if (!c) return;
    const confirmed = window.confirm(
      `Delete customer "${c.name}" (${c.email})? This action cannot be undone.`
    );
    if (!confirmed) return;
    setCustomers((prev) => prev.filter((x) => x.id !== id));
    // if currently editing same customer, close edit modal
    if (editCustomer && editCustomer.id === id) {
      setShowEditModal(false);
      setEditCustomer(null);
    }
    toast.success("Customer deleted.");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          <UserPlus size={18} /> New Customer
        </button>
      </div>

      {/* Search & Table */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center border rounded-lg px-3 py-2 w-80 mb-4">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none bg-transparent"
            />
          </div>

          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Phone</th>
                <th className="p-3 border-b">Address</th>
                <th className="p-3 border-b text-center">Shipments</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{c.name}</td>
                    <td className="p-3 border-b">{c.email}</td>
                    <td className="p-3 border-b">{c.phone}</td>
                    <td className="p-3 border-b">{c.address}</td>
                    <td className="p-3 border-b text-center">
                      {c.totalShipments}
                    </td>
                    <td className="p-3 border-b text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleStartEdit(c.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit customer"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(c.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete customer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal for Adding Customer */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Customer</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                className="border rounded-lg p-2 w-full"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email Address"
                className="border rounded-lg p-2 w-full"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="border rounded-lg p-2 w-full"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Address"
                className="border rounded-lg p-2 w-full"
                value={newCustomer.address}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, address: e.target.value })
                }
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCustomer}
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                >
                  Add Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Edit Customer Modal --- */}
      {showEditModal && editCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Customer</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditCustomer(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                className="border rounded-lg p-2 w-full"
                value={editCustomer.name}
                onChange={(e) =>
                  setEditCustomer({ ...editCustomer, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email Address"
                className="border rounded-lg p-2 w-full"
                value={editCustomer.email}
                onChange={(e) =>
                  setEditCustomer({ ...editCustomer, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="border rounded-lg p-2 w-full"
                value={editCustomer.phone}
                onChange={(e) =>
                  setEditCustomer({ ...editCustomer, phone: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Address"
                className="border rounded-lg p-2 w-full"
                value={editCustomer.address}
                onChange={(e) =>
                  setEditCustomer({ ...editCustomer, address: e.target.value })
                }
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditCustomer(null);
                  }}
                  className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCustomer}
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                >
                  Save
                </button>
                <button
                  onClick={() =>
                    editCustomer && handleDeleteCustomer(editCustomer.id)
                  }
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
// ...existing code...
