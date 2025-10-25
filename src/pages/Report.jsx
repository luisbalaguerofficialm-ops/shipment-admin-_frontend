// ...existing code...
import React, { useState, useMemo } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Download, FileBarChart, Search } from "lucide-react";

const parseRevenue = (r) => {
  if (!r && r !== 0) return 0;
  if (typeof r === "number") return r;
  const n = parseFloat(String(r).replace(/[^0-9.\-]+/g, ""));
  return Number.isNaN(n) ? 0 : n;
};

const formatCurrency = (n) =>
  `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0 })}`;

const Report = () => {
  const [reports] = useState([
    {
      id: 1,
      period: "October 2025",
      totalShipments: 3240,
      delivered: 3100,
      pending: 100,
      canceled: 40,
      revenue: "$158,200",
    },
    {
      id: 2,
      period: "September 2025",
      totalShipments: 2980,
      delivered: 2800,
      pending: 120,
      canceled: 60,
      revenue: "$142,500",
    },
  ]);

  // filter controls
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // derive filtered reports
  const filteredReports = useMemo(() => {
    const s = search.trim().toLowerCase();
    return reports.filter((r) => {
      // search by period text
      if (s && !r.period.toLowerCase().includes(s)) return false;
      // date filtering (if both provided)
      if (fromDate) {
        const fd = new Date(fromDate);
        const periodDate = new Date(r.period + " 1"); // approximate using first of month
        if (periodDate < fd) return false;
      }
      if (toDate) {
        const td = new Date(toDate);
        const periodDate = new Date(r.period + " 1");
        // include the whole day
        if (
          periodDate >
          new Date(td.getFullYear(), td.getMonth(), td.getDate(), 23, 59, 59)
        )
          return false;
      }
      return true;
    });
  }, [reports, search, fromDate, toDate]);

  // summary totals from filteredReports
  const summary = useMemo(() => {
    return filteredReports.reduce(
      (acc, r) => {
        acc.totalShipments += Number(r.totalShipments || 0);
        acc.delivered += Number(r.delivered || 0);
        acc.pending += Number(r.pending || 0);
        acc.revenue += parseRevenue(r.revenue);
        return acc;
      },
      { totalShipments: 0, delivered: 0, pending: 0, revenue: 0 }
    );
  }, [filteredReports]);

  // CSV export of currently filtered reports
  const exportCSV = () => {
    if (!filteredReports.length) {
      alert("No report rows to export.");
      return;
    }
    const headers = [
      "Period",
      "Total Shipments",
      "Delivered",
      "Pending",
      "Canceled",
      "Revenue",
    ];
    const rows = filteredReports.map((r) => [
      r.period,
      r.totalShipments,
      r.delivered,
      r.pending,
      r.canceled,
      typeof r.revenue === "number" ? formatCurrency(r.revenue) : r.revenue,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reports-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // simple "Filter" action (keeps inputs controlled); kept for UX parity
  const applyFilter = (e) => {
    e?.preventDefault();
    // filteredReports is derived reactively — this handler exists for future extensions / analytics
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FileBarChart size={22} /> Reports & Analytics
        </h1>
        <Button
          onClick={exportCSV}
          className="bg-blue-700 text-white hover:bg-blue-800 flex items-center gap-2"
        >
          <Download size={16} /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <form onSubmit={applyFilter} className="flex items-center gap-3">
        <div className="relative w-72">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search report period..."
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
          <Button
            type="submit"
            className="bg-blue-700 text-white hover:bg-blue-800 px-4"
          >
            Filter
          </Button>
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

      {/* Detailed Report Table */}
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700">
                  <th className="p-3 border-b">Period</th>
                  <th className="p-3 border-b">Total Shipments</th>
                  <th className="p-3 border-b">Delivered</th>
                  <th className="p-3 border-b">Pending</th>
                  <th className="p-3 border-b">Canceled</th>
                  <th className="p-3 border-b">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{report.period}</td>
                    <td className="p-3">
                      {report.totalShipments.toLocaleString()}
                    </td>
                    <td className="p-3 text-green-700">
                      {report.delivered.toLocaleString()}
                    </td>
                    <td className="p-3 text-yellow-600">
                      {report.pending.toLocaleString()}
                    </td>
                    <td className="p-3 text-red-600">
                      {report.canceled.toLocaleString()}
                    </td>
                    <td className="p-3 font-medium">
                      {typeof report.revenue === "number"
                        ? formatCurrency(report.revenue)
                        : report.revenue}
                    </td>
                  </tr>
                ))}
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
    </div>
  );
};

export default Report;
// ...existing code...
