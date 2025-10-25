// ...existing code...
import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import {
  Search,
  Truck,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  Calendar,
  X,
  Edit3,
} from "lucide-react";
import toast from "react-hot-toast";

const TrackingLog = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedShipment, setSelectedShipment] = useState(null);

  const [shipments, setShipments] = useState([
    {
      id: "TRK1001",
      customer: "James Smith",
      status: "Delivered",
      lastUpdate: "2025-10-15 10:45 AM",
      destination: "Lagos, NG",
      origin: "London, UK",
      route: ["London", "Paris", "Abuja", "Lagos"],
      estimatedDelivery: "2025-10-15",
    },
    {
      id: "TRK1002",
      customer: "Maria Johnson",
      status: "In Transit",
      lastUpdate: "2025-10-16 2:10 PM",
      destination: "Abuja, NG",
      origin: "Berlin, DE",
      route: ["Berlin", "Rome", "Accra", "Abuja"],
      estimatedDelivery: "2025-10-19",
    },
    {
      id: "TRK1003",
      customer: "Ali Hassan",
      status: "Pending",
      lastUpdate: "2025-10-17 8:30 AM",
      destination: "Kano, NG",
      origin: "Dubai, UAE",
      route: ["Dubai", "Addis Ababa", "Kano"],
      estimatedDelivery: "2025-10-22",
    },
    {
      id: "TRK1004",
      customer: "Grace Okafor",
      status: "Failed",
      lastUpdate: "2025-10-14 6:00 PM",
      destination: "Port Harcourt, NG",
      origin: "New York, USA",
      route: ["New York", "London", "Lagos", "Port Harcourt"],
      estimatedDelivery: "2025-10-20",
    },
  ]);

  const filtered = shipments.filter(
    (s) =>
      (filter === "all" || s.status === filter) &&
      s.id.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors = {
    Delivered: "text-green-600 bg-green-100",
    "In Transit": "text-blue-600 bg-blue-100",
    Pending: "text-yellow-600 bg-yellow-100",
    Failed: "text-red-600 bg-red-100",
  };

  const statusIcons = {
    Delivered: <CheckCircle size={16} />,
    "In Transit": <Truck size={16} />,
    Pending: <Clock size={16} />,
    Failed: <XCircle size={16} />,
  };

  const handleUpdateStatus = () => {
    if (!selectedShipment) return;
    const updatedTime = new Date().toLocaleString();
    setShipments((prev) =>
      prev.map((s) =>
        s.id === selectedShipment.id
          ? { ...s, status: selectedShipment.status, lastUpdate: updatedTime }
          : s
      )
    );
    setSelectedShipment((prev) =>
      prev ? { ...prev, lastUpdate: updatedTime } : prev
    );
    toast.success("Shipment status updated");
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-semibold text-gray-800">Tracking Logs</h1>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center border rounded-lg p-2 w-full sm:w-1/2">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by Tracking ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none bg-transparent text-gray-700"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg p-2 text-gray-700 bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="Delivered">Delivered</option>
          <option value="In Transit">In Transit</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Tracking Logs Table */}
      <Card className="shadow-md">
        <CardContent className="p-4 overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="p-3">Tracking ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Update</th>
                <th className="p-3">Destination</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((ship) => (
                  <tr
                    key={ship.id}
                    onClick={() => setSelectedShipment(ship)}
                    className="border-b hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="p-3 font-semibold text-gray-800">
                      {ship.id}
                    </td>
                    <td className="p-3 text-gray-700">{ship.customer}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                          statusColors[ship.status]
                        }`}
                      >
                        {statusIcons[ship.status]} {ship.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{ship.lastUpdate}</td>
                    <td className="p-3 flex items-center gap-2 text-gray-700">
                      <MapPin size={16} className="text-gray-500" />{" "}
                      {ship.destination}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-4 text-center text-gray-500 italic"
                  >
                    No tracking logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Shipment Details Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <button
              onClick={() => setSelectedShipment(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Package className="text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedShipment.id}
              </h2>
            </div>

            <div className="space-y-3">
              <p className="text-gray-700">
                <strong>Customer:</strong> {selectedShipment.customer}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <Truck size={16} className="text-gray-500" />
                <strong>Status:</strong>{" "}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                    statusColors[selectedShipment.status]
                  }`}
                >
                  {statusIcons[selectedShipment.status]}{" "}
                  {selectedShipment.status}
                </span>
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" />
                <strong>Origin:</strong> {selectedShipment.origin}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" />
                <strong>Destination:</strong> {selectedShipment.destination}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <strong>Estimated Delivery:</strong>{" "}
                {selectedShipment.estimatedDelivery}
              </p>

              <div className="mt-4">
                <strong className="text-gray-800">Route:</strong>
                <ul className="list-disc ml-6 text-gray-600">
                  {selectedShipment.route.map((stop, i) => (
                    <li key={i}>{stop}</li>
                  ))}
                </ul>
              </div>

              {/* Status selector + Action Buttons */}
              <div className="flex items-center justify-between mt-5">
                <div className="flex items-center gap-2">
                  <label className="text-gray-700">Change status:</label>
                  <select
                    value={selectedShipment.status}
                    onChange={(e) =>
                      setSelectedShipment({
                        ...selectedShipment,
                        status: e.target.value,
                      })
                    }
                    className="border rounded-lg p-2"
                  >
                    <option value="Delivered">Delivered</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleUpdateStatus}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Edit3 size={16} /> Update Status
                  </button>
                  <button
                    onClick={() => setSelectedShipment(null)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingLog;
