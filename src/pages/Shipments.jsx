import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  Truck,
  XCircle,
  PackageSearch,
  PackageCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";

const Shipments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [shipments, setShipments] = useState([]);

  const [showNewShipmentModal, setShowNewShipmentModal] = useState(false);
  const [showEditShipmentModal, setShowEditShipmentModal] = useState(false);
  const [editShipmentIndex, setEditShipmentIndex] = useState(null);
  const [editShipment, setEditShipment] = useState(null);

  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackedShipment, setTrackedShipment] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const token = localStorage.getItem("adminToken"); // Use your auth token if required

  // Fetch all shipments
  const fetchShipments = async () => {
    try {
      const response = await fetch(
        "https://admin-ship-backend.onrender.com/api/shipments",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message || "Failed to fetch shipments");
        return;
      }
      setShipments(data.shipments || []);
    } catch (error) {
      console.error("NETWORK ERROR:", error);
      toast.error("Network error!");
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  // Create shipment
  const handleCreateShipment = async (e) => {
    e.preventDefault();

    const form = e.target;
    const payload = {
      senderName: form.senderName.value,
      senderPhone: form.senderPhone.value,
      senderEmail: form.senderEmail.value,
      senderAddress: form.senderAddress.value,
      receiverName: form.receiverName.value,
      receiverPhone: form.receiverPhone.value,
      receiverEmail: form.receiverEmail.value,
      receiverAddress: form.receiverAddress.value,
      packageDescription: form.packageDescription.value,
      weight: form.weight.value,
      quantity: Number(form.quantity.value),
      value: form.value.value,
      shipmentType: form.shipmentType.value,
      paymentMethod: form.paymentMethod.value,
      currentLocation: form.currentLocation.value,
      deliveryStatus: form.deliveryStatus.value,
      estimatedDeliveryDate: form.estimatedDeliveryDate.value,
    };

    try {
      const response = await fetch(
        "https://admin-ship-backend.onrender.com/api/shipments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message || "Failed to create shipment");
        return;
      }
      setShipments((prev) => [data.shipment, ...prev]);
      toast.success("Shipment created successfully!");
      setShowNewShipmentModal(false);
      form.reset();
    } catch (error) {
      console.error("NETWORK ERROR:", error);
      toast.error("Network error!");
    }
  };

  // Update shipment
  const handleUpdateShipment = async (e) => {
    e.preventDefault();
    if (!editShipmentIndex || !editShipment) return;

    try {
      const response = await fetch(
        `https://admin-ship-backend.onrender.com/api/shipments/${editShipment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editShipment),
        }
      );
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message || "Failed to update shipment");
        return;
      }

      setShipments((prev) =>
        prev.map((s) => (s._id === data.shipment._id ? data.shipment : s))
      );
      toast.success("Shipment updated successfully!");
      setShowEditShipmentModal(false);
      setEditShipmentIndex(null);
      setEditShipment(null);
    } catch (error) {
      console.error("NETWORK ERROR:", error);
      toast.error("Network error!");
    }
  };

  // Delete shipment
  const handleDeleteShipment = async (index) => {
    const shipment = shipments[index];
    const confirmed = window.confirm(
      `Delete shipment ${shipment.trackingNumber}? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `https://admin-ship-backend.onrender.com/api/shipments/${shipment._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message || "Failed to delete shipment");
        return;
      }

      setShipments((prev) => prev.filter((_, i) => i !== index));
      toast.success("Shipment deleted successfully!");
      if (showEditShipmentModal && editShipmentIndex === index) {
        setShowEditShipmentModal(false);
        setEditShipmentIndex(null);
        setEditShipment(null);
      }
    } catch (error) {
      console.error("NETWORK ERROR:", error);
      toast.error("Network error!");
    }
  };

  // Track shipment
  const handleTrackShipment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://admin-ship-backend.onrender.com/api/track/${trackingNumber}`
      );
      const data = await response.json();
      if (!data.success) {
        setTrackedShipment(null);
        setNotFound(true);
        toast.error(data.message || "Shipment not found");
        return;
      }
      setTrackedShipment(data.shipment);
      setNotFound(false);
      toast.success("Shipment found!");
    } catch (error) {
      console.error("NETWORK ERROR:", error);
      toast.error("Network error!");
    }
  };

  const filteredShipments = shipments
    .map((s, i) => ({ ...s, _idx: i }))
    .filter(
      (ship) =>
        ship.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ship.senderName &&
          ship.senderName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ship.receiverName &&
          ship.receiverName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ship.deliveryStatus &&
          ship.deliveryStatus.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const handleStartEdit = (index) => {
    setEditShipmentIndex(index);
    setEditShipment({ ...filteredShipments[index] });
    setShowEditShipmentModal(true);
  };

  const handleEditChange = (patch) => {
    setEditShipment((prev) => ({ ...prev, ...patch }));
  };

  const handleNumberInput = (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Shipments</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowTrackingModal(true)}
            className="bg-green-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <PackageSearch size={18} /> Track Shipment
          </button>
          <button
            onClick={() => setShowNewShipmentModal(true)}
            className="bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            <PlusCircle size={18} /> New Shipment
          </button>
        </div>
      </div>

      {/* SEARCH + TABLE */}
      <Card className="shadow-md bg-white border border-gray-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center border rounded-lg px-3 py-2 w-80 border-gray-300">
              <Search size={18} className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 border-b">Tracking No</th>
                  <th className="p-3 border-b">Sender</th>
                  <th className="p-3 border-b">Receiver</th>
                  <th className="p-3 border-b">Type</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Route</th>
                  <th className="p-3 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.length > 0 ? (
                  filteredShipments.map((ship) => (
                    <tr key={ship.trackingNumber} className="hover:bg-gray-50">
                      <td className="p-3 border-b text-blue-700 font-medium">
                        {ship.trackingNumber}
                      </td>
                      <td className="p-3 border-b">{ship.senderName}</td>
                      <td className="p-3 border-b">{ship.receiverName}</td>
                      <td className="p-3 border-b">{ship.shipmentType}</td>
                      <td className="p-3 border-b">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            ship.deliveryStatus === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {ship.deliveryStatus}
                        </span>
                      </td>
                      <td className="p-3 border-b">{ship.currentLocation}</td>
                      <td className="p-3 border-b text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleStartEdit(ship._idx)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit shipment"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteShipment(ship._idx)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete shipment"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">
                      No shipments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modals for NEW, EDIT, TRACK shipments remain; ensure they call handleCreateShipment, handleUpdateShipment, handleTrackShipment */}

      {/* ===== TRACK SHIPMENT MODAL ===== */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 border border-gray-300 shadow-lg w-[450px] max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setShowTrackingModal(false);
                setTrackedShipment(null);
                setNotFound(false);
                setTrackingNumber("");
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <XCircle size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <PackageSearch size={20} /> Track Shipment
            </h2>

            <form onSubmit={handleTrackShipment} className="space-y-3">
              <input
                type="text"
                placeholder="Enter Tracking Number (e.g. TRK-903481)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-green-600 text-white rounded-lg py-2 px-4 w-full hover:bg-green-700 transition"
              >
                Search Shipment
              </button>
            </form>

            {/* Result Section */}
            {trackedShipment && (
              <div className="mt-5 bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-green-700 mb-2">
                  <PackageCheck size={18} /> Shipment Found
                </h3>
                <p>
                  <strong>Tracking No:</strong> {trackedShipment.trackingNumber}
                </p>
                <p>
                  <strong>Sender:</strong> {trackedShipment.senderName} (
                  {trackedShipment.senderPhone})
                </p>
                <p>
                  <strong>Receiver:</strong> {trackedShipment.receiverName} (
                  {trackedShipment.receiverPhone})
                </p>
                <p>
                  <strong>Current Location:</strong>{" "}
                  {trackedShipment.currentLocation}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-medium ${
                      trackedShipment.deliveryStatus === "Delivered"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {trackedShipment.deliveryStatus}
                  </span>
                </p>
                <p>
                  <strong>Estimated Delivery:</strong>{" "}
                  {trackedShipment.estimatedDeliveryDate}
                </p>
              </div>
            )}

            {notFound && (
              <div className="mt-5 bg-red-50 p-4 rounded-lg border border-red-200 text-center text-red-700">
                <AlertCircle size={20} className="inline-block mr-2" />
                Shipment not found! Please check the tracking number.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== NEW SHIPMENT MODAL ===== */}
      {showNewShipmentModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 border border-gray-300 shadow-lg w-[500px] max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowNewShipmentModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <XCircle size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <Truck size={20} /> Create New Shipment
            </h2>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                // minimal create logic — add to state
                const newShip = {
                  trackingNumber: `TRK-${Math.floor(Math.random() * 1000000)}`,
                  senderName: "New Sender",
                  senderPhone: "",
                  senderEmail: "",
                  senderAddress: "",
                  receiverName: "New Receiver",
                  receiverPhone: "",
                  receiverEmail: "",
                  receiverAddress: "",
                  packageDescription: "",
                  weight: "",
                  quantity: 1,
                  value: "",
                  shipmentType: "Standard",
                  paymentMethod: "Prepaid",
                  currentLocation: "",
                  deliveryStatus: "Pending",
                  estimatedDeliveryDate: "",
                };
                setShipments((prev) => [newShip, ...prev]);
                alert("✅ Shipment created successfully!");
                setShowNewShipmentModal(false);
              }}
            >
              <h3 className="text-md font-bold mt-2">Sender Details</h3>
              <input
                type="text"
                placeholder="Sender Name"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="tel"
                placeholder="Sender Phone"
                maxLength="15"
                onInput={handleNumberInput}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Sender Email"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Sender Address"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />

              <h3 className="text-md font-bold mt-4">Receiver Details</h3>
              <input
                type="text"
                placeholder="Receiver Name"
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Receiver Phone"
                maxLength="15"
                onInput={handleNumberInput}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Receiver Email"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Receiver Address"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />

              <h3 className="text-md font-bold mt-4">Shipment Details</h3>
              <textarea
                placeholder="Package Description"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              ></textarea>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Weight (e.g., 2.5kg)"
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <input
                type="text"
                placeholder="Value (e.g., $200)"
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 w-full"
              />

              <div className="grid grid-cols-2 gap-2">
                <select className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500">
                  <option value="">Shipment Type</option>
                  <option value="Express">Express</option>
                  <option value="Standard">Standard</option>
                  <option value="Economy">Economy</option>
                </select>
                <select className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500">
                  <option value="">Payment Method</option>
                  <option value="Prepaid">Prepaid</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Current Location / Route"
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 w-full"
              />

              <select className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 w-full">
                <option value="">Delivery Status</option>
                <option value="Pending">Pending</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>

              <input
                type="date"
                placeholder="Estimated Delivery Date"
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 w-full"
              />

              <div className="text-sm text-gray-600 mt-2">
                <strong>Tracking Number:</strong> TRK-
                {Math.floor(Math.random() * 1000000)}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-blue-700 text-white rounded-lg py-2 px-4 w-full hover:bg-blue-800 transition"
                >
                  Save Shipment
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewShipmentModal(false)}
                  className="bg-gray-500 text-white rounded-lg py-2 px-4 w-full hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== EDIT SHIPMENT MODAL ===== */}
      {showEditShipmentModal && editShipment && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 border border-gray-300 shadow-lg w-[500px] max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setShowEditShipmentModal(false);
                setEditShipmentIndex(null);
                setEditShipment(null);
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <XCircle size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <Edit size={20} /> Edit Shipment
            </h2>

            <form className="space-y-4" onSubmit={handleUpdateShipment}>
              <input
                type="text"
                placeholder="Tracking Number"
                value={editShipment.trackingNumber}
                onChange={(e) =>
                  handleEditChange({ trackingNumber: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                required
              />

              <h3 className="text-md font-bold mt-2">Sender Details</h3>
              <input
                type="text"
                placeholder="Sender Name"
                value={editShipment.senderName}
                onChange={(e) =>
                  handleEditChange({ senderName: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="tel"
                placeholder="Sender Phone"
                value={editShipment.senderPhone || ""}
                onInput={handleNumberInput}
                onChange={(e) =>
                  handleEditChange({ senderPhone: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />

              <h3 className="text-md font-bold mt-4">Receiver Details</h3>
              <input
                type="text"
                placeholder="Receiver Name"
                value={editShipment.receiverName}
                onChange={(e) =>
                  handleEditChange({ receiverName: e.target.value })
                }
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />

              <h3 className="text-md font-bold mt-4">Shipment Details</h3>
              <textarea
                placeholder="Package Description"
                value={editShipment.packageDescription || ""}
                onChange={(e) =>
                  handleEditChange({ packageDescription: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              ></textarea>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Weight (e.g., 2.5kg)"
                  value={editShipment.weight || ""}
                  onChange={(e) => handleEditChange({ weight: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={editShipment.quantity || 1}
                  onChange={(e) =>
                    handleEditChange({ quantity: Number(e.target.value) })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <input
                type="text"
                placeholder="Current Location / Route"
                value={editShipment.currentLocation || ""}
                onChange={(e) =>
                  handleEditChange({ currentLocation: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 w-full"
              />

              <select
                value={editShipment.deliveryStatus || "Pending"}
                onChange={(e) =>
                  handleEditChange({ deliveryStatus: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="Pending">Pending</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>

              <input
                type="date"
                value={editShipment.estimatedDeliveryDate || ""}
                onChange={(e) =>
                  handleEditChange({ estimatedDeliveryDate: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 w-full"
              />

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-blue-700 text-white rounded-lg py-2 px-4 w-full hover:bg-blue-800 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (editShipmentIndex !== null)
                      handleDeleteShipment(editShipmentIndex);
                  }}
                  className="bg-red-500 text-white rounded-lg py-2 px-4 w-full hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipments;
