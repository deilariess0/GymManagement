// src/pages/Payments.jsx
import { useState, useMemo } from "react";
import { useGym } from "../context/useGym";
import { GYM_PRICING } from "../data/pricing";
import { Plus, X, ChevronLeft, ChevronRight, CalendarClock, User, CheckCircle, Search, TrendingUp, Receipt } from "lucide-react";

export default function Payments() {
  // Pull shared data and functions from Context
  const { transactions, members, addTransaction, getPrice } = useGym();

  // Modal & Transaction Type State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("daily");

  // Initial State
  const [formData, setFormData] = useState({ 
    name: "", 
    type: "Regular", 
    plan: "Daily", 
    discount: "", 
    amount: "", 
    payment: "Cash" 
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  const MEMBERSHIP_PLANS = ["Weekly", "Monthly", "3 Months", "6 Months"];

  // Calculate totals (Hardened)
  const totalEarningsToday = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalTransactions = transactions?.length || 0;

  // Search & Pagination Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  // Reset to Page 1 when searching
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const nextData = { ...prev, [name]: value };

      // Auto-fill Type and Plan if the member already exists
      if (name === "name") {
        const existingMember = members.find(
          (m) => m.name.toLowerCase() === value.toLowerCase()
        );
        
        if (existingMember) {
          nextData.type = existingMember.type;
          nextData.plan = existingMember.plan;
        }
      }

      // If it's a Plan Member, we only allow Weekly+ and auto-calculate
      if (transactionType === "plan") {
        nextData.plan = MEMBERSHIP_PLANS.includes(nextData.plan) ? nextData.plan : "Monthly";
        const price = getPrice(nextData.type, nextData.plan);
        nextData.amount = price.toString();
      } else {
        const price = getPrice(nextData.type, "Daily");
        nextData.amount = price.toString();
      }

      return nextData;
    });
  };

  // Handle adding transaction
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return alert("Please fill out all fields");

    if (transactionType === "plan") {
      addTransaction({ ...formData, amount: 0, status: "Checked In" });
    } else {
      addTransaction(formData);
    }

    setFormData({ name: "", type: "Regular", plan: "Daily", discount: "", amount: "", payment: "Cash" });
    setIsModalOpen(false);
    setTransactionType("daily");
  };

  // UI Helpers
  const getInitials = (name) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = ["bg-orange-500", "bg-pink-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getPaymentStyle = (payment) => {
    switch (payment) {
      case "GCash": return "bg-teal-50 text-teal-600";
      case "Cash": return "bg-purple-50 text-purple-600";
      case "Maya": return "bg-indigo-50 text-indigo-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink-950 md:text-2xl">Payments & Transactions</h1>
      </div>

      {/* Summary Cards (Mobile Friendly) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
        <div className="flex items-center gap-4 overflow-hidden rounded-2xl bg-white p-4 shadow-card md:p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 md:h-12 md:w-12">
            <TrendingUp size={18} strokeWidth={2.25} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold tracking-wide text-ink-950/45">Total Earnings Today</p>
            <p className="truncate text-xl font-extrabold tracking-tight text-ink-950 md:text-2xl">
              ₱{(Number(totalEarningsToday) || 0).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 overflow-hidden rounded-2xl bg-white p-4 shadow-card md:p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-600 md:h-12 md:w-12">
            <Receipt size={18} strokeWidth={2.25} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold tracking-wide text-ink-950/45">Total Transactions</p>
            <p className="truncate text-xl font-extrabold tracking-tight text-ink-950 md:text-2xl">
              {totalTransactions}
            </p>
          </div>
        </div>
      </div>

      {/* Search & New Transaction Buttons (Stack on Mobile) */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-1 items-center gap-2 rounded-lg border border-ink-950/10 bg-white px-3 py-2 shadow-sm">
          <Search size={18} className="text-ink-950/35" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full flex-1 bg-transparent text-sm outline-none placeholder:text-ink-950/35"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-bold text-ink-950 transition-colors hover:bg-gold-600 md:w-auto"
        >
          <Plus size={16} strokeWidth={3} /> New Transaction
        </button>
      </div>

      {/* Transactions Table (Desktop) */}
      <div className="hidden rounded-2xl bg-white p-5 shadow-card md:block">
        <h2 className="text-sm font-bold tracking-wide text-ink-950">Today's Transactions</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-ink-950/35">
                <th className="pb-3 pr-3 font-semibold">Time</th>
                <th className="pb-3 pr-3 font-semibold">Member Name</th>
                <th className="pb-3 pr-3 font-semibold">Type</th>
                <th className="pb-3 pr-3 font-semibold">Plan</th>
                <th className="pb-3 pr-3 font-semibold">Discount</th>
                <th className="pb-3 pr-3 font-semibold">Amount</th>
                <th className="pb-3 pr-3 font-semibold">Payment</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((t) => (
                  <tr key={t.id} className="border-t border-ink-950/5">
                    <td className="py-3 pr-3 text-ink-950/60">{t.time}</td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getAvatarColor(t.name)} text-xs font-bold text-white`}>
                          {getInitials(t.name)}
                        </div>
                        <span className="font-semibold text-ink-950">{t.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${t.type === "Student" ? "bg-pink-100 text-pink-600" : "bg-orange-100 text-orange-600"}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <span className="rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600">
                        {t.plan}
                      </span>
                    </td>
                    <td className={`py-3 pr-3 ${t.discount.includes("-") ? "font-medium text-rose-500" : "text-ink-950/30"}`}>{t.discount}</td>
                    <td className="py-3 pr-3 font-semibold text-ink-950">₱{(Number(t.amount) || 0).toFixed(2)}</td>
                    <td className="py-3 pr-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPaymentStyle(t.payment)}`}>
                        {t.payment}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${t.status === "Checked In" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-ink-950/40">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (Desktop) */}
        <div className="mt-4 flex items-center justify-between border-t border-ink-950/5 pt-4">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-950/60 transition-colors hover:bg-ink-950/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <span className="text-xs font-semibold text-ink-950/50">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange(currentPage + 1)}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-950/60 transition-colors hover:bg-ink-950/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Transactions Cards (Mobile) */}
      <div className="space-y-3 md:hidden">
        {paginatedTransactions.length > 0 ? (
          paginatedTransactions.map((t) => (
            <div key={t.id} className="rounded-xl bg-white p-4 shadow-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${getAvatarColor(t.name)} text-xs font-bold text-white`}>
                    {getInitials(t.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-ink-950">{t.name}</p>
                    <p className="text-xs text-ink-950/50">{t.time}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${t.status === "Checked In" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}>
                  {t.status}
                </span>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className={`rounded-full px-2 py-1 font-medium ${t.type === "Student" ? "bg-pink-100 text-pink-600" : "bg-orange-100 text-orange-600"}`}>
                  {t.type}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-1 font-medium text-gray-600">
                  {t.plan}
                </span>
                <span className={`rounded-full px-2 py-1 font-medium ${getPaymentStyle(t.payment)}`}>
                  {t.payment}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-ink-950/5 pt-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-950/40">Discount</p>
                  <p className={`text-sm font-medium ${t.discount.includes("-") ? "text-rose-500" : "text-ink-950/30"}`}>{t.discount}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-950/40">Amount</p>
                  <p className="text-lg font-extrabold text-ink-950">₱{(Number(t.amount) || 0).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl bg-white p-10 text-center text-ink-950/40 shadow-card">
            No transactions found.
          </div>
        )}

        {/* Pagination (Mobile) */}
        <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-card">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-950/60 transition-colors hover:bg-ink-950/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-xs font-semibold text-ink-950/50">
            {currentPage} / {totalPages || 1}
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange(currentPage + 1)}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-950/60 transition-colors hover:bg-ink-950/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Modal (Mobile Friendly) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink-950">New Transaction</h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full p-1 text-ink-950/50 transition-colors hover:bg-gray-100 hover:text-ink-950">
                <X size={20} />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="mb-6 flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setTransactionType("daily")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold transition-all ${
                  transactionType === "daily" ? "bg-white text-ink-950 shadow-sm" : "text-ink-950/50"
                }`}
              >
                <CalendarClock size={16} /> Daily
              </button>
              <button
                type="button"
                onClick={() => setTransactionType("plan")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold transition-all ${
                  transactionType === "plan" ? "bg-white text-ink-950 shadow-sm" : "text-ink-950/50"
                }`}
              >
                <User size={16} /> Plan Member
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-950/70">
                  {transactionType === "daily" ? "Member Name (Walk-in)" : "Member Name (Search existing)"}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Search member or enter new name..."
                  className="w-full rounded-lg border border-ink-950/10 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
                />
              </div>

              {transactionType === "daily" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-ink-950/70">Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-ink-950/10 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
                    >
                      <option value="Regular">Regular</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-ink-950/70">Amount (₱) - Auto</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      readOnly
                      className="w-full rounded-lg border border-ink-950/10 bg-gray-50 px-3 py-2 text-sm font-bold text-ink-950 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {transactionType === "plan" && (
                <div className="rounded-lg border border-gold-500/20 bg-gold-500/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-gold-600">
                    <CheckCircle size={14} /> Member already paid for their plan
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-ink-950/70">Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-ink-950/10 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
                      >
                        <option value="Regular">Regular</option>
                        <option value="Student">Student</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-ink-950/70">Plan</label>
                      <select
                        name="plan"
                        value={formData.plan}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-ink-950/10 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
                      >
                        {MEMBERSHIP_PLANS.map((plan) => (
                          <option key={plan} value={plan}>{plan}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {transactionType === "daily" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-ink-950/70">Discount (₱)</label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full rounded-lg border border-ink-950/10 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-ink-950/70">Payment Method</label>
                    <select
                      name="payment"
                      value={formData.payment}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-ink-950/10 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
                    >
                      <option value="Cash">Cash</option>
                      <option value="GCash">GCash</option>
                      <option value="Maya">Maya</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-ink-950/5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-ink-950/60 transition-colors hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold text-ink-950 transition-colors ${
                    transactionType === "plan" ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gold-500 hover:bg-gold-600"
                  }`}
                >
                  {transactionType === "plan" ? (
                    <>
                      <CheckCircle size={14} strokeWidth={3} /> Log Attendance
                    </>
                  ) : (
                    <>
                      <Plus size={14} strokeWidth={3} /> Add Transaction
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}