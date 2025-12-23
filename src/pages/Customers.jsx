import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Plus, Trash2, Edit } from "lucide-react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [editingId, setEditingId] = useState(null);

  const socketRef = useRef(null);
  const token = localStorage.getItem("authToken");

  // ================= FETCH CUSTOMERS =================
  const fetchCustomers = async () => {
    try {
      const res = await fetch(
        "https://admin-ship-backend.onrender.com/api/customers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data.success) setCustomers(data.customers);
    } catch (err) {
      console.error("Fetch customers error:", err);
      toast.error("Failed to fetch customers");
    }
  };

  // ================= INIT =================
  useEffect(() => {
    if (!token) return;

    fetchCustomers();

    // ================= SOCKET.IO =================
    socketRef.current = io("https://admin-ship-backend.onrender.com", {
      transports: ["websocket"],
      auth: { token },
    });

    socketRef.current.on("customersUpdated", () => {
      fetchCustomers();
    });

    return () => socketRef.current?.disconnect();
  }, [token]);

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email) {
      toast.error("Name and email are required");
      return;
    }

    setLoading(true);

    try {
      const url = editingId
        ? `https://admin-ship-backend.onrender.com/api/customers/${editingId}`
        : "https://admin-ship-backend.onrender.com/api/customers";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) throw new Error();

      toast.success(editingId ? "Customer updated" : "Customer created");

      setForm({ name: "", email: "", phone: "", address: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Save customer error:", err);
      toast.error("Failed to save customer");
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = (customer) => {
    setEditingId(customer._id);
    setForm({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
    });
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm("Delete this customer?")) return;

    try {
      await fetch(
        `https://admin-ship-backend.onrender.com/api/customers/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Customer deleted");
    } catch (err) {
      console.error("Delete customer error:", err);
      toast.error("Failed to delete customer");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Customers</h1>

      {/* ================= FORM ================= */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              className="border rounded-lg p-2"
              placeholder="Customer Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="border rounded-lg p-2"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              className="border rounded-lg p-2"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <input
              className="border rounded-lg p-2"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white col-span-full"
            >
              <Plus size={16} />
              {editingId ? "Update Customer" : "Add Customer"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ================= LIST ================= */}
      <Card>
        <CardContent className="p-0">
          {customers.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">No customers found</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{c.name}</td>
                    <td className="p-3">{c.email}</td>
                    <td className="p-3">{c.phone || "-"}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Customer;
