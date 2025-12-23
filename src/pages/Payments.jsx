import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { PlusCircle, CreditCard, CheckCircle, XCircle } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import toast, { Toaster } from "react-hot-toast";

const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  GHS: "GH₵",
  CAD: "C$",
};
const formatAmount = (amount, currency) =>
  `${currencySymbols[currency] || ""}${Number(amount).toLocaleString(
    undefined,
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  )}`;

const Payments = ({ token }) => {
  const [payments, setPayments] = useState([]);
  const [showNewPaymentModal, setShowNewPaymentModal] = useState(false);
  const [newPayment, setNewPayment] = useState({
    payer: "",
    amount: "",
    currency: "USD",
    method: "",
    status: "Pending",
    date: "",
    email: "",
  });

  // ===== FETCH PAYMENTS =====
  const fetchPayments = async () => {
    try {
      const res = await fetch(
        "https://admin-ship-backend.onrender.com/api/payments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) setPayments(data.payments);
    } catch (err) {
      console.error("Fetch payments error:", err);
      toast.error("Failed to fetch payments");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ===== SOCKET.IO LIVE UPDATE =====
  useEffect(() => {
    const socket = window.io("https://admin-ship-backend.onrender.com");
    socket.on("paymentsUpdated", fetchPayments);
    return () => socket.disconnect();
  }, []);

  // ===== SAVE NEW PAYMENT =====
  const handleSavePayment = async (e) => {
    e.preventDefault();
    if (
      !newPayment.payer ||
      !newPayment.amount ||
      !newPayment.method ||
      !newPayment.date
    ) {
      toast.error("Please fill all required fields.");
      return;
    }
    try {
      const res = await fetch(
        "https://admin-ship-backend.onrender.com/api/payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newPayment),
        }
      );
      const data = await res.json();
      if (data.success) {
        setPayments((prev) => [data.payment, ...prev]);
        setShowNewPaymentModal(false);
        setNewPayment({
          payer: "",
          amount: "",
          currency: "USD",
          method: "",
          status: "Pending",
          date: "",
          email: "",
        });
        toast.success("Payment recorded and receipt sent!");
      } else {
        toast.error(data.message || "Failed to save payment");
      }
    } catch (err) {
      console.error("Save payment error:", err);
      toast.error("Failed to save payment");
    }
  };

  // ===== CSV EXPORT =====
  const exportCSV = () => {
    if (!payments.length) return toast.error("No payments to export");
    const headers = ["Payer", "Amount", "Currency", "Method", "Status", "Date"];
    const rows = payments.map((p) => [
      p.payer,
      p.amount,
      p.currency,
      p.method,
      p.status,
      p.date,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments.csv";
    a.click();
    toast.success("CSV exported successfully");
  };

  // ===== PDF EXPORT =====
  const exportPDF = () => {
    if (!payments.length) return toast.error("No payments to export");
    const doc = new jsPDF();
    doc.text("Payments Report", 14, 15);
    doc.autoTable({
      startY: 25,
      head: [["Payer", "Amount", "Currency", "Method", "Status", "Date"]],
      body: payments.map((p) => [
        p.payer,
        p.amount,
        p.currency,
        p.method,
        p.status,
        p.date,
      ]),
    });
    doc.save("payments.pdf");
    toast.success("PDF exported successfully");
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNewPaymentModal(true)}
            className="bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-800"
          >
            <PlusCircle size={18} /> New Payment
          </button>
          <button
            onClick={exportCSV}
            className="bg-gray-700 text-white px-3 py-2 rounded"
          >
            Export CSV
          </button>
          <button
            onClick={exportPDF}
            className="bg-red-600 text-white px-3 py-2 rounded"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* PAYMENTS TABLE */}
      <Card className="shadow-md bg-white border border-gray-200">
        <CardContent className="p-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 border-b">Payer</th>
                <th className="p-3 border-b">Amount</th>
                <th className="p-3 border-b">Currency</th>
                <th className="p-3 border-b">Method</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border-b">{p.payer}</td>
                  <td className="p-3 border-b">
                    {formatAmount(p.amount, p.currency)}
                  </td>
                  <td className="p-3 border-b">{p.currency}</td>
                  <td className="p-3 border-b">{p.method}</td>
                  <td className="p-3 border-b">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        p.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 border-b">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* NEW PAYMENT MODAL */}
      {showNewPaymentModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 border border-gray-300 shadow-lg w-[450px] relative">
            <button
              onClick={() => setShowNewPaymentModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <XCircle size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <CreditCard size={20} /> Add New Payment
            </h2>
            <form className="space-y-4" onSubmit={handleSavePayment}>
              <input
                type="text"
                placeholder="Payer Name"
                required
                value={newPayment.payer}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, payer: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              <input
                type="email"
                placeholder="Email (optional for receipt)"
                value={newPayment.email}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, email: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Amount"
                  required
                  min="0"
                  step="0.01"
                  value={newPayment.amount}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, amount: e.target.value })
                  }
                  className="flex-1 border border-gray-300 rounded-lg p-2"
                />
                <select
                  value={newPayment.currency}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, currency: e.target.value })
                  }
                  className="w-32 border border-gray-300 rounded-lg p-2"
                >
                  <option value="USD">USD</option>
                  <option value="NGN">NGN</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="GHS">GHS</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>
              <select
                required
                value={newPayment.method}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, method: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">Payment Method</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
              </select>
              <select
                required
                value={newPayment.status}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              <input
                type="date"
                required
                value={newPayment.date}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, date: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              <button
                type="submit"
                className="bg-blue-700 text-white rounded-lg py-2 px-4 w-full hover:bg-blue-800"
              >
                Save Payment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
