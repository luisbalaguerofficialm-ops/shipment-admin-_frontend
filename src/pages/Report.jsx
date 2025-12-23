import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Download,
  FileBarChart,
  Search,
  PlusCircle,
  XCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";

const parseRevenue = (r) => {
  if (!r && r !== 0) return 0;
  if (typeof r === "number") return r;
  const n = parseFloat(String(r).replace(/[^0-9.\-]+/g, ""));
  return Number.isNaN(n) ? 0 : n;
};

const formatCurrency = (n) =>
  `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0 })}`;

const Report = ({ token }) => {
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // New Report Form
  const [newReport, setNewReport] = useState({
    title: "",
    data: {
      totalShipments: 0,
      delivered: 0,
      pending: 0,
      canceled: 0,
      revenue: 0,
    },
  });

  // ===== FETCH REPORTS =====
  const fetchReports = async () => {
    try {
      const res = await fetch(
        "https://admin-ship-backend.onrender.com/api/reports",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.success) setReports(data.reports);
      else toast.error(data.message || "Failed to fetch reports");
    } catch (err) {
      console.error("Fetch reports error:", err);
      toast.error("Failed to fetch reports");
    }
  };

  useEffect(() => {
    fetchReports();
    const socket = window.io("https://admin-ship-backend.onrender.com");
    socket.on("reportsUpdated", fetchReports);
    return () => socket.disconnect();
  }, []);

  // ===== FILTERED REPORTS =====
  const filteredReports = useMemo(() => {
    const s = search.trim().toLowerCase();
    return reports.filter((r) => {
      if (s && !r.title?.toLowerCase().includes(s)) return false;
      const reportDate = r.createdAt ? new Date(r.createdAt) : null;
      if (fromDate && reportDate && reportDate < new Date(fromDate))
        return false;
      if (toDate && reportDate && reportDate > new Date(toDate)) return false;
      return true;
    });
  }, [reports, search, fromDate, toDate]);

  // ===== SUMMARY =====
  const summary = useMemo(() => {
    return filteredReports.reduce(
      (acc, r) => {
        const data = r.data || {};
        acc.totalShipments += data.totalShipments || 0;
        acc.delivered += data.delivered || 0;
        acc.pending += data.pending || 0;
        acc.revenue += parseRevenue(data.revenue);
        return acc;
      },
      { totalShipments: 0, delivered: 0, pending: 0, revenue: 0 }
    );
  }, [filteredReports]);

  // ===== CSV EXPORT =====
  const exportCSV = () => {
    if (!filteredReports.length)
      return toast.error("No report rows to export.");
    const headers = [
      "Title",
      "Total Shipments",
      "Delivered",
      "Pending",
      "Canceled",
      "Revenue",
    ];
    const rows = filteredReports.map((r) => {
      const d = r.data || {};
      return [
        r.title,
        d.totalShipments || 0,
        d.delivered || 0,
        d.pending || 0,
        d.canceled || 0,
        d.revenue || 0,
      ];
    });
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    try {
      const a = document.createElement("a");
      a.href = url;
      a.download = `reports-${new Date().toISOString().slice(0, 10)}.csv`;
      if (document.body) document.body.appendChild(a);
      a.click();
      if (a.parentNode) a.parentNode.removeChild(a);
      toast.success("CSV exported successfully");
    } catch (err) {
      console.error("CSV export error:", err);
      toast.error("Failed to export CSV");
    } finally {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    }
  };

  // ===== PDF EXPORT =====
  const exportPDF = () => {
    if (!filteredReports.length)
      return toast.error("No report rows to export.");
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Reports", 14, 16);
    const tableData = filteredReports.map((r) => {
      const d = r.data || {};
      return [
        r.title,
        d.totalShipments,
        d.delivered,
        d.pending,
        d.canceled,
        d.revenue,
      ];
    });
    doc.autoTable({
      head: [
        [
          "Title",
          "Total Shipments",
          "Delivered",
          "Pending",
          "Canceled",
          "Revenue",
        ],
      ],
      body: tableData,
      startY: 20,
    });
    doc.save(`reports-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success("PDF exported successfully");
  };

  // ===== CREATE NEW REPORT =====
  const handleSaveReport = async (e) => {
    e.preventDefault();
    if (!newReport.title) return toast.error("Report title is required.");
    try {
      const res = await fetch(
        "https://admin-ship-backend.onrender.com/api/reports",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newReport),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Report generated successfully!");
        setShowModal(false);
        setNewReport({
          title: "",
          data: {
            totalShipments: 0,
            delivered: 0,
            pending: 0,
            canceled: 0,
            revenue: 0,
          },
        });
        fetchReports();
      } else {
        toast.error(data.message || "Failed to generate report");
      }
    } catch (err) {
      console.error("Generate report error:", err);
      toast.error("Failed to generate report");
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FileBarChart size={22} /> Reports & Analytics
        </h1>
        <div className="flex gap-2">
          <Button
            onClick={exportCSV}
            className="bg-blue-700 text-white hover:bg-blue-800 flex items-center gap-2"
          >
            <Download size={16} /> Export CSV
          </Button>
          <Button
            onClick={exportPDF}
            className="bg-green-700 text-white hover:bg-green-800 flex items-center gap-2"
          >
            <Download size={16} /> Export PDF
          </Button>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-purple-700 text-white hover:bg-purple-800 flex items-center gap-2"
          >
            <PlusCircle size={16} /> New Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center gap-3"
      >
        <div className="relative w-72">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search report title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded-lg p-2 focus:ring focus:ring-blue-200"
          />
          <label className="text-sm text-gray-600">To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-lg p-2 focus:ring focus:ring-blue-200"
          />
        </div>
      </form>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-600">Total Shipments</h3>
            <p className="text-xl font-semibold text-gray-800 mt-1">
              {summary.totalShipments.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-600">Delivered</h3>
            <p className="text-xl font-semibold text-green-600 mt-1">
              {summary.delivered.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-600">Pending</h3>
            <p className="text-xl font-semibold text-yellow-600 mt-1">
              {summary.pending.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-600">Revenue</h3>
            <p className="text-xl font-semibold text-blue-700 mt-1">
              {formatCurrency(summary.revenue)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700">
                  <th className="p-3 border-b">Title</th>
                  <th className="p-3 border-b">Total Shipments</th>
                  <th className="p-3 border-b">Delivered</th>
                  <th className="p-3 border-b">Pending</th>
                  <th className="p-3 border-b">Canceled</th>
                  <th className="p-3 border-b">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((r) => {
                  const d = r.data || {};
                  return (
                    <tr
                      key={r._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{r.title}</td>
                      <td className="p-3">{d.totalShipments || 0}</td>
                      <td className="p-3 text-green-700">{d.delivered || 0}</td>
                      <td className="p-3 text-yellow-600">{d.pending || 0}</td>
                      <td className="p-3 text-red-600">{d.canceled || 0}</td>
                      <td className="p-3 font-medium">{d.revenue || 0}</td>
                    </tr>
                  );
                })}
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No reports found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ===== NEW REPORT MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 border border-gray-300 shadow-lg w-[450px] relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <XCircle size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <PlusCircle size={20} /> Generate New Report
            </h2>
            <form className="space-y-4" onSubmit={handleSaveReport}>
              <input
                type="text"
                placeholder="Report Title"
                required
                value={newReport.title}
                onChange={(e) =>
                  setNewReport({ ...newReport, title: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-col gap-2">
                <input
                  type="number"
                  placeholder="Total Shipments"
                  value={newReport.data.totalShipments}
                  onChange={(e) =>
                    setNewReport({
                      ...newReport,
                      data: {
                        ...newReport.data,
                        totalShipments: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Delivered"
                  value={newReport.data.delivered}
                  onChange={(e) =>
                    setNewReport({
                      ...newReport,
                      data: {
                        ...newReport.data,
                        delivered: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Pending"
                  value={newReport.data.pending}
                  onChange={(e) =>
                    setNewReport({
                      ...newReport,
                      data: {
                        ...newReport.data,
                        pending: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Canceled"
                  value={newReport.data.canceled}
                  onChange={(e) =>
                    setNewReport({
                      ...newReport,
                      data: {
                        ...newReport.data,
                        canceled: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Revenue"
                  value={newReport.data.revenue}
                  onChange={(e) =>
                    setNewReport({
                      ...newReport,
                      data: {
                        ...newReport.data,
                        revenue: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button
                type="submit"
                className="bg-blue-700 text-white w-full py-2 rounded-lg hover:bg-blue-800"
              >
                Save Report
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
