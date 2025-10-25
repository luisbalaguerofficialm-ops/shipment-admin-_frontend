// ...existing code...
import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { PlusCircle, CreditCard, CheckCircle, XCircle } from "lucide-react";

const currencySymbols = {
  USD: "$",
  NGN: "₦",
  EUR: "€",
  GBP: "£",
  GHS: "GH₵",
  CAD: "C$",
};

const formatAmount = (amount, currency) => {
  const symbol = currencySymbols[currency] || "";
  return `${symbol}${Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const Payments = () => {
  const [showNewPaymentModal, setShowNewPaymentModal] = useState(false);

  // keep payments in state so new ones persist in UI
  const [payments, setPayments] = useState([
    {
      id: "PMT-001",
      payer: "John Doe",
      amount: 1200,
      currency: "USD",
      method: "Card",
      status: "Completed",
      date: "2025-10-15",
    },
    {
      id: "PMT-002",
      payer: "Sarah Brown",
      amount: 250,
      currency: "USD",
      method: "Bank Transfer",
      status: "Pending",
      date: "2025-10-17",
    },
  ]);

  // new payment form state
  const [newPayment, setNewPayment] = useState({
    payer: "",
    amount: "",
    currency: "USD",
    method: "",
    status: "Pending",
    date: "",
  });

  // --- derived totals grouped by currency and status ---
  const totals = payments.reduce(
    (acc, p) => {
      acc.overall[p.currency] =
        (acc.overall[p.currency] || 0) + Number(p.amount || 0);
      acc.status[p.status] = acc.status[p.status] || {};
      acc.status[p.status][p.currency] =
        (acc.status[p.status][p.currency] || 0) + Number(p.amount || 0);
      return acc;
    },
    { overall: {}, status: {} }
  );

  const mainCurrency = "USD"; // shown as primary currency in cards
  const totalMain = totals.overall[mainCurrency] || 0;
  const pendingMain =
    (totals.status["Pending"] && totals.status["Pending"][mainCurrency]) || 0;
  const completedMain =
    (totals.status["Completed"] && totals.status["Completed"][mainCurrency]) ||
    0;

  const otherCurrenciesList = Object.entries(totals.overall)
    .filter(([c]) => c !== mainCurrency)
    .map(([c, amt]) => `${c} ${formatAmount(amt, c)}`);

  const handleSavePayment = (e) => {
    e.preventDefault();
    if (
      !newPayment.payer ||
      !newPayment.amount ||
      !newPayment.method ||
      !newPayment.date
    ) {
      alert("Please fill required fields (Payer, Amount, Method, Date).");
      return;
    }
    const id = `PMT-${String(Math.floor(Math.random() * 900000) + 100000)}`;
    const entry = {
      id,
      payer: newPayment.payer,
      amount: Number(newPayment.amount),
      currency: newPayment.currency,
      method: newPayment.method,
      status: newPayment.status,
      date: newPayment.date,
    };
    setPayments((prev) => [entry, ...prev]);
    setShowNewPaymentModal(false);
    setNewPayment({
      payer: "",
      amount: "",
      currency: "USD",
      method: "",
      status: "Pending",
      date: "",
    });
    alert("✅ Payment recorded successfully!");
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Payments</h1>

        <button
          onClick={() => setShowNewPaymentModal(true)}
          className="bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          <PlusCircle size={18} /> New Payment
        </button>
      </div>

      {/* ===== PAYMENT SUMMARY ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-md bg-white border border-gray-200">
          <CardContent className="p-4 flex flex-col justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Payments</p>
              <h2 className="text-xl font-bold">
                {formatAmount(totalMain, mainCurrency)}
              </h2>
              {otherCurrenciesList.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Also: {otherCurrenciesList.join(", ")}
                </p>
              )}
            </div>
            <CreditCard size={28} className="text-blue-600" />
          </CardContent>
        </Card>

        <Card className="shadow-md bg-white border border-gray-200">
          <CardContent className="p-4 flex flex-col justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <h2 className="text-xl font-bold">
                {formatAmount(pendingMain, mainCurrency)}
              </h2>
              {otherCurrenciesList.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Also: {otherCurrenciesList.join(", ")}
                </p>
              )}
            </div>
            <XCircle size={28} className="text-yellow-500" />
          </CardContent>
        </Card>

        <Card className="shadow-md bg-white border border-gray-200">
          <CardContent className="p-4 flex flex-col justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <h2 className="text-xl font-bold">
                {formatAmount(completedMain, mainCurrency)}
              </h2>
              {otherCurrenciesList.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Also: {otherCurrenciesList.join(", ")}
                </p>
              )}
            </div>
            <CheckCircle size={28} className="text-green-600" />
          </CardContent>
        </Card>
      </div>

      {/* ===== PAYMENT TABLE ===== */}
      <Card className="shadow-md bg-white border border-gray-200">
        <CardContent className="p-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 border-b">Payment ID</th>
                <th className="p-3 border-b">Payer</th>
                <th className="p-3 border-b">Amount</th>
                <th className="p-3 border-b">Method</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border-b font-medium text-blue-700">
                    {pay.id}
                  </td>
                  <td className="p-3 border-b">{pay.payer}</td>
                  <td className="p-3 border-b">
                    {formatAmount(pay.amount, pay.currency)}
                  </td>
                  <td className="p-3 border-b">{pay.method}</td>
                  <td className="p-3 border-b">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        pay.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {pay.status}
                    </span>
                  </td>
                  <td className="p-3 border-b">{pay.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ===== NEW PAYMENT MODAL ===== */}
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
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
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
                  className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newPayment.currency}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, currency: e.target.value })
                  }
                  className="w-32 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-blue-700 text-white rounded-lg py-2 px-4 w-full hover:bg-blue-800 transition"
                >
                  Save Payment
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPaymentModal(false)}
                  className="bg-gray-500 text-white rounded-lg py-2 px-4 w-full hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
// ...existing code...
