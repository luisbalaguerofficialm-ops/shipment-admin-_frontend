import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { MapPin, Phone, User, Plus, Building2 } from "lucide-react";
import toast from "react-hot-toast";

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [newBranch, setNewBranch] = useState({
    name: "",
    manager: "",
    contact: "",
    location: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);

  const authToken = localStorage.getItem("authToken");

  // Fetch branches from backend
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://admin-ship-backend.onrender.com/api/branches",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok && data.success) {
          setBranches(data.branches);
        } else {
          toast.error(data.message || "Failed to fetch branches");
        }
      } catch (err) {
        toast.error("Error fetching branches");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [authToken]);

  // Add new branch
  const handleAddBranch = async () => {
    if (
      !newBranch.name ||
      !newBranch.manager ||
      !newBranch.contact ||
      !newBranch.location
    ) {
      toast.error("Please fill out all branch details!");
      return;
    }

    try {
      const res = await fetch(
        "https://admin-ship-backend.onrender.com/api/branches",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(newBranch),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setBranches((prev) => [...prev, data.branch]);
        setNewBranch({
          name: "",
          manager: "",
          contact: "",
          location: "",
          status: "Active",
        });
        toast.success("Branch added successfully!");
      } else {
        toast.error(data.message || "Failed to add branch");
      }
    } catch (err) {
      toast.error("Error adding branch");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Branch Management
        </h1>
        <div className="flex items-center gap-2 text-gray-600">
          <Building2 size={18} />
          <span>{branches.length} Branches Total</span>
        </div>
      </div>

      {/* ===== ADD BRANCH FORM ===== */}
      <Card className="shadow-md bg-white border border-gray-200">
        <CardContent className="space-y-4 p-5">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <Plus size={18} /> Add New Branch
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Branch Name"
              className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              value={newBranch.name}
              onChange={(e) =>
                setNewBranch({ ...newBranch, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Branch Manager"
              className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              value={newBranch.manager}
              onChange={(e) =>
                setNewBranch({ ...newBranch, manager: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Contact Number"
              className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              value={newBranch.contact}
              onChange={(e) =>
                setNewBranch({ ...newBranch, contact: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Location"
              className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              value={newBranch.location}
              onChange={(e) =>
                setNewBranch({ ...newBranch, location: e.target.value })
              }
            />
            <select
              value={newBranch.status}
              onChange={(e) =>
                setNewBranch({ ...newBranch, status: e.target.value })
              }
              className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button
            onClick={handleAddBranch}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Add Branch
          </button>
        </CardContent>
      </Card>

      {/* ===== BRANCH LIST ===== */}
      {loading ? (
        <p className="text-center text-gray-500">Loading branches...</p>
      ) : branches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <Card
              key={branch._id || branch.id}
              className="shadow-md hover:shadow-lg transition bg-white border border-gray-200"
            >
              <CardContent className="p-5 space-y-2">
                <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                  <Building2 size={18} /> {branch.name}
                </h3>
                <p className="text-gray-700 flex items-center gap-2">
                  <User size={16} /> Manager: {branch.manager}
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <Phone size={16} /> {branch.contact}
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <MapPin size={16} /> {branch.location}
                </p>
                <span
                  className={`inline-block px-3 py-1 text-sm rounded-full ${
                    branch.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {branch.status}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No branches found.</p>
      )}
    </div>
  );
};

export default Branches;
