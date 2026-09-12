// src/components/dashboard/TransactionsTable.jsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  Plus, ArrowRight, X, ChevronLeft, ChevronRight, User, CalendarClock,
  CheckCircle, AlertTriangle, Dumbbell, Fingerprint,
} from "lucide-react";
import { useGym } from "../../context/useGym";
import { getAllMembers } from "../../utils/memberStorage";
import { cn } from "../../utils/cn";

const MEMBER_TYPE_TONE = {
  Regular: "bg-orange-100 text-orange-600",
  Student: "bg-pink-100 text-pink-600",
};

const PAYMENT_TONE = {
  Cash: "bg-purple-100 text-purple-600",
  GCash: "bg-teal-100 text-teal-600",
  Maya: "bg-indigo-100 text-indigo-600",
};

const MEMBERSHIP_PLANS = ["Weekly", "Monthly", "3 Months", "6 Months"];

const EMPTY_FORM = {
  name: "",
  type: "Regular",
  plan: "Daily",
  discount: "",
  amount: "80",
  payment: "Cash",
  status: "Paid",
};

export default function TransactionsTable({ searchQuery = "" }) {
  const navigate = useNavigate();
  const { transactions, addTransaction, getPrice } = useGym();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successTransaction, setSuccessTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [transactionType, setTransactionType] = useState("daily");
  const [memberWarning, setMemberWarning] = useState("");
  const [matchedMember, setMatchedMember] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  // --- UI Helpers ---
  const getInitials = (name) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);

  const getAvatarColor = (name) => {
    const colors = [
      "bg-orange-500", "bg-pink-500", "bg-blue-500",
      "bg-green-500", "bg-purple-500", "bg-yellow-500",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const findMemberByName = (name) => {
    const allMembers = getAllMembers();
    return allMembers.find(
      (m) => m.name.toLowerCase() === name.toLowerCase().trim()
    );
  };

  // --- Filtering ---
  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions;
    return transactions.filter((t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  useMemo(() => setCurrentPage(1), [searchQuery]);

  const displayRows = useMemo(() => {
    const rows = [...paginatedTransactions];
    while (rows.length < itemsPerPage) {
      rows.push({ id: `placeholder-${rows.length}`, isPlaceholder: true });
    }
    return rows;
  }, [paginatedTransactions]);

  // --- Live lookup on Plan tab ---
  // FIXED: Now also updates formData.type and formData.plan from the matched member
  useEffect(() => {
    if (transactionType !== "plan") return;
    const trimmed = formData.name.trim();
    
    if (!trimmed) {
      setMatchedMember(null);
      setMemberWarning("");
      return;
    }

    const found = findMemberByName(trimmed);
    if (found) {
      setMatchedMember(found);
      setMemberWarning("");
      // Sync the formData type & plan to match the registered member
      setFormData((prev) => ({
        ...prev,
        type: found.type,
        plan: found.plan,
      }));
    } else {
      setMatchedMember(null);
      setMemberWarning(`"${trimmed}" is not a registered member. Please register this person first.`);
    }
  }, [formData.name, transactionType]);

  // --- Reset ---
  const resetFormState = () => {
    setFormData(EMPTY_FORM);
    setMatchedMember(null);
    setMemberWarning("");
  };

  const handleTabSwitch = (type) => {
    if (type === transactionType) return;
    setTransactionType(type);
    resetFormState();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (transactionType === "daily" && (name === "type" || name === "name")) {
        next.amount = getPrice(next.type, "Daily").toString();
      }
      return next;
    });
  };

  // --- Add Transaction ---
  const handleAddTransaction = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a member name.");
      return;
    }

    if (transactionType === "plan") {
      const existing = findMemberByName(formData.name);
      if (!existing) {
        setMemberWarning(`"${formData.name}" is not a registered member. Please register this person first.`);
        return;
      }
      // Use the registered member's actual plan (not formData.plan)
      const planData = {
        ...formData,
        name: existing.name,
        type: existing.type,
        plan: existing.plan,
        status: "Checked In",
        amount: "0",
      };
      addTransaction(planData);
      setSuccessTransaction(planData);
    } else {
      const dailyData = {
        ...formData,
        amount: formData.amount || getPrice(formData.type, "Daily").toString(),
        status: "Paid",
      };
      addTransaction(dailyData);
      setSuccessTransaction(dailyData);
    }

    resetFormState();
    setIsModalOpen(false);
    setTransactionType("daily");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetFormState();
  };

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-wide text-ink-950">
          TODAY'S TRANSACTION
        </h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-gold-500 px-3.5 py-2 text-xs font-bold text-ink-950 hover:bg-gold-600"
        >
          <Plus size={14} strokeWidth={3} />
          New Transaction
        </button>
      </div>

      {/* Desktop Table */}
      <div className="mt-4 hidden flex-1 overflow-x-auto md:block">
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
            {displayRows.map((txn) =>
              txn.isPlaceholder ? (
                <tr key={txn.id} className="border-t border-ink-950/5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <td key={i} className="py-3 pr-3">&nbsp;</td>
                  ))}
                </tr>
              ) : (
                <tr key={txn.id} className="border-t border-ink-950/5">
                  <td className="py-3 pr-3 text-ink-950/60">{txn.time}</td>
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getAvatarColor(txn.name)} text-xs font-bold text-white`}>
                        {getInitials(txn.name)}
                      </div>
                      <span className="font-semibold text-ink-950">{txn.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-3">
                    <span className={cn("rounded-full px-2 py-1 text-xs font-medium", MEMBER_TYPE_TONE[txn.type])}>
                      {txn.type}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-ink-950/70">{txn.plan}</td>
                  <td className="py-3 pr-3">
                    {txn.discount ? (
                      <span className="font-medium text-rose-500">{txn.discount}</span>
                    ) : (
                      <span className="text-ink-950/30">P0.00</span>
                    )}
                  </td>
                  <td className="py-3 pr-3 font-semibold text-ink-950">
                    {typeof txn.amount === "number" ? `P${txn.amount.toFixed(2)}` : txn.amount}
                  </td>
                  <td className="py-3 pr-3">
                    <span className={cn("rounded-full px-2 py-1 text-xs font-medium", PAYMENT_TONE[txn.payment])}>
                      {txn.payment}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={cn("rounded-full px-2 py-1 text-xs font-medium", txn.status === "Checked In" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600")}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mt-4 space-y-3 flex-1 md:hidden">
        {paginatedTransactions.length > 0 ? (
          paginatedTransactions.map((txn) => (
            <div key={txn.id} className="rounded-xl bg-white p-4 border border-ink-950/5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${getAvatarColor(txn.name)} text-xs font-bold text-white`}>
                    {getInitials(txn.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-ink-950">{txn.name}</p>
                    <p className="text-xs text-ink-950/50">{txn.time}</p>
                  </div>
                </div>
                <span className={cn("rounded-full px-2 py-1 text-[10px] font-medium", txn.status === "Checked In" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600")}>
                  {txn.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className={cn("rounded-full px-2 py-1 font-medium", MEMBER_TYPE_TONE[txn.type])}>{txn.type}</span>
                <span className="rounded-full bg-gray-100 px-2 py-1 font-medium text-gray-600">{txn.plan}</span>
                <span className={cn("rounded-full px-2 py-1 font-medium", PAYMENT_TONE[txn.payment])}>{txn.payment}</span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-ink-950/5 pt-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-950/40">Discount</p>
                  <p className={cn("text-sm font-medium", txn.discount ? "text-rose-500" : "text-ink-950/30")}>
                    {txn.discount ? txn.discount : "P0.00"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-950/40">Amount</p>
                  <p className="text-lg font-extrabold text-ink-950">
                    {typeof txn.amount === "number" ? `P${txn.amount.toFixed(2)}` : txn.amount}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl bg-white p-10 text-center text-ink-950/40 border border-ink-950/5">
            No transactions found.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-auto border-t border-ink-950/5 pt-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-950/60 hover:bg-ink-950/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <span className="text-xs font-semibold text-ink-950/50">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-950/60 hover:bg-ink-950/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/payments")}
            className="flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-700"
          >
            View all transactions
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* INPUT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6">

            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink-950">New Transaction</h3>
              <button
                onClick={closeModal}
                className="rounded-full p-1 text-ink-950/50 hover:bg-gray-100 hover:text-ink-950"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => handleTabSwitch("daily")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold transition-all ${
                  transactionType === "daily" ? "bg-white text-ink-950 shadow-sm" : "text-ink-950/50"
                }`}
              >
                <CalendarClock size={16} /> Daily Visit
              </button>
              <button
                type="button"
                onClick={() => handleTabSwitch("plan")}
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
                  placeholder={
                    transactionType === "daily"
                      ? "Enter walk-in name..."
                      : "Search registered member..."
                  }
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none transition-colors",
                    matchedMember
                      ? "border-emerald-300 bg-emerald-50/50 focus:border-emerald-500"
                      : memberWarning
                      ? "border-rose-300 bg-rose-50/50 focus:border-rose-500"
                      : "border-ink-950/10 focus:border-gold-500"
                  )}
                />

                {/* LIVE MEMBER PREVIEW WITH QR */}
                {transactionType === "plan" && matchedMember && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between bg-ink-950 px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded bg-gold-500">
                          <Dumbbell size={10} className="text-ink-950" strokeWidth={3} />
                        </div>
                        <p className="text-[10px] font-extrabold tracking-wider text-white">
                          FIT<span className="text-gold-500">4</span>LESS
                        </p>
                      </div>
                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">
                        Member ID
                      </p>
                    </div>

                    <div className="flex items-center gap-3 p-3">
                      <div className="flex flex-1 items-center gap-3 min-w-0">
                        <div className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white",
                          getAvatarColor(matchedMember.name)
                        )}>
                          {getInitials(matchedMember.name)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-extrabold text-ink-950">
                            {matchedMember.name}
                          </p>
                          <div className="mt-0.5 flex items-center gap-1 text-[10px] font-bold text-ink-950/50">
                            <Fingerprint size={10} />
                            {matchedMember.id}
                          </div>

                          <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1">
                            <div>
                              <p className="text-[8px] font-bold uppercase tracking-wide text-ink-950/35">Type</p>
                              <p className="text-[10px] font-bold text-ink-950">{matchedMember.type}</p>
                            </div>
                            <div>
                              <p className="text-[8px] font-bold uppercase tracking-wide text-ink-950/35">Plan</p>
                              <p className="text-[10px] font-bold text-ink-950">{matchedMember.plan}</p>
                            </div>
                            <div>
                              <p className="text-[8px] font-bold uppercase tracking-wide text-ink-950/35">Start</p>
                              <p className="text-[10px] font-bold text-ink-950">{matchedMember.startDate}</p>
                            </div>
                            <div>
                              <p className="text-[8px] font-bold uppercase tracking-wide text-ink-950/35">Expires</p>
                              <p className="text-[10px] font-bold text-ink-950">{matchedMember.endDate}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-center justify-center gap-1.5 border-l border-dashed border-ink-950/10 pl-3">
                        <div className="rounded-lg bg-white p-1.5 ring-1 ring-ink-950/5">
                          <QRCodeSVG
                            value={matchedMember.qrValue || matchedMember.id}
                            size={72}
                            level="H"
                            fgColor="#14141C"
                          />
                        </div>
                        <p className="text-[7px] font-bold uppercase tracking-widest text-ink-950/40">
                          Scan to Check In
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-ink-950/5 bg-surface px-3 py-1.5">
                      <p className="text-[8px] font-bold uppercase tracking-wide text-ink-950/35">
                        Fit4Less Gym Management
                      </p>
                      <div className={cn(
                        "flex items-center gap-1 text-[8px] font-bold uppercase tracking-wide",
                        matchedMember.status === "Active" ? "text-emerald-600" : "text-amber-600"
                      )}>
                        <div className={cn(
                          "h-1 w-1 rounded-full",
                          matchedMember.status === "Active" ? "bg-emerald-500" : "bg-amber-500"
                        )} />
                        {matchedMember.status}
                      </div>
                    </div>
                  </div>
                )}

                {/* MEMBER NOT FOUND */}
                {transactionType === "plan" && memberWarning && !matchedMember && (
                  <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-600" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-amber-900">Member Not Found</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-amber-700">{memberWarning}</p>
                      <button
                        type="button"
                        onClick={() => {
                          closeModal();
                          navigate("/members/register");
                        }}
                        className="mt-2 inline-flex items-center gap-1 rounded-md bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-600"
                      >
                        Register This Member
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Daily Visit Fields */}
              {transactionType === "daily" && (
                <>
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
                      <label className="mb-1 block text-xs font-semibold text-ink-950/70">Amount (P) - Auto</label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        readOnly
                        className="w-full rounded-lg border border-ink-950/10 bg-gray-50 px-3 py-2 text-sm font-bold text-ink-950 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-ink-950/70">Discount (P)</label>
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
                </>
              )}

              {/* Plan Member Fields */}
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

              <div className="flex justify-end gap-3 pt-4 border-t border-ink-950/5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-ink-950/60 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={transactionType === "plan" && !matchedMember}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-opacity",
                    transactionType === "plan"
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gold-500 text-ink-950 hover:bg-gold-600",
                    transactionType === "plan" && !matchedMember && "cursor-not-allowed opacity-40"
                  )}
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

      {/* SUCCESS POPUP */}
      {successTransaction && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4 animate-fade-in">
          <div className="w-full max-w-sm overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl animate-slide-up sm:animate-fade-in">

            <div className="flex flex-col items-center gap-3 bg-emerald-50 px-5 py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle size={28} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-base font-bold text-emerald-900">
                  Transaction Added
                </p>
                <p className="mt-0.5 text-xs text-emerald-700">
                  {successTransaction.status === "Checked In"
                    ? "Attendance logged successfully"
                    : "Payment recorded successfully"}
                </p>
              </div>
            </div>

            <div className="space-y-3 p-5">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                  getAvatarColor(successTransaction.name)
                )}>
                  {getInitials(successTransaction.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink-950">
                    {successTransaction.name}
                  </p>
                  <p className="text-[10px] font-semibold text-ink-950/50">
                    {successTransaction.type} • {successTransaction.plan}
                  </p>
                </div>
                <span className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-bold shrink-0",
                  successTransaction.status === "Checked In"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-emerald-100 text-emerald-700"
                )}>
                  {successTransaction.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-surface p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-ink-950/40">Amount</p>
                  <p className="text-sm font-extrabold text-ink-950">
                    ₱{successTransaction.status === "Checked In"
                      ? "0.00"
                      : Number(successTransaction.amount).toFixed(2)}
                  </p>
                </div>
                <div className="rounded-xl bg-surface p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-ink-950/40">Payment</p>
                  <p className="text-sm font-extrabold text-ink-950">
                    {successTransaction.status === "Checked In" ? "—" : successTransaction.payment}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSuccessTransaction(null)}
                  className="flex-1 rounded-xl border border-ink-950/10 bg-white px-4 py-2.5 text-sm font-bold text-ink-950 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSuccessTransaction(null);
                    setIsModalOpen(true);
                  }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-bold text-ink-950 hover:bg-gold-600"
                >
                  <Plus size={14} strokeWidth={3} /> New Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}