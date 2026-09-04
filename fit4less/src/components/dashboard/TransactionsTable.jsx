// src/components/dashboard/TransactionsTable.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; 
import { Plus, ArrowRight, X, ChevronLeft, ChevronRight, User, CalendarClock, CheckCircle } from "lucide-react";
import { useGym } from "../../context/useGym";
import { cn } from "../../utils/cn";

const MEMBER_TYPE_TONE = { Regular: "bg-orange-100 text-orange-600", Student: "bg-pink-100 text-pink-600" };
const PAYMENT_TONE = { Cash: "bg-purple-100 text-purple-600", GCash: "bg-teal-100 text-teal-600", Maya: "bg-indigo-100 text-indigo-600" };

export default function TransactionsTable() {
  const navigate = useNavigate(); 

  const { transactions, members, addTransaction, getPrice } = useGym();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; 

  const [transactionType, setTransactionType] = useState("daily");

  const [formData, setFormData] = useState({
    name: "",
    type: "Regular",
    plan: "Daily", 
    discount: "",
    amount: "80",
    payment: "Cash",
    status: "Paid",
  });

  const MEMBERSHIP_PLANS = ["Weekly", "Monthly", "3 Months", "6 Months"];

  // UI Helpers
  const getInitials = (name) => name.split(" ").map(n => n[0]).join("").toUpperCase();
  const getAvatarColor = (name) => {
    const colors = ["bg-orange-500", "bg-pink-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  // Calculate pagination data
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return transactions.slice(startIndex, startIndex + itemsPerPage);
  }, [transactions, currentPage]);

  // Create placeholders to ensure the table always has 9 rows
  const displayRows = useMemo(() => {
    const rows = [...paginatedTransactions];
    while (rows.length < itemsPerPage) {
      rows.push({ id: `placeholder-${rows.length}`, isPlaceholder: true });
    }
    return rows;
  }, [paginatedTransactions]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const nextData = { ...prev, [name]: value };

      if (transactionType === "plan" && name === "name") {
        const existingMember = members.find(
          (m) => m.name.toLowerCase() === value.toLowerCase()
        );
        
        if (existingMember) {
          nextData.type = existingMember.type;
          nextData.plan = existingMember.plan;
        }
      }

      if (transactionType === "daily" && (name === "type" || name === "name")) {
        const price = getPrice(nextData.type, "Daily");
        nextData.amount = price.toString();
      }
      
      return nextData;
    });
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      alert("Please enter a member name.");
      return;
    }

    if (transactionType === "plan") {
      const finalData = { ...formData, amount: "0", status: "Checked In" };
      addTransaction(finalData); 
    } else {
      addTransaction(formData); 
    }

    setFormData({ name: "", type: "Regular", plan: "Daily", discount: "", amount: "80", payment: "Cash", status: "Paid" });
    setIsModalOpen(false);
    setTransactionType("daily");
  };

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-wide text-ink-950">TODAY'S TRANSACTION</h2>
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
            {displayRows.map((txn) => (
              txn.isPlaceholder ? (
                <tr key={txn.id} className="border-t border-ink-950/5">
                  <td className="py-3 pr-3">&nbsp;</td>
                  <td className="py-3 pr-3">&nbsp;</td>
                  <td className="py-3 pr-3">&nbsp;</td>
                  <td className="py-3 pr-3">&nbsp;</td>
                  <td className="py-3 pr-3">&nbsp;</td>
                  <td className="py-3 pr-3">&nbsp;</td>
                  <td className="py-3 pr-3">&nbsp;</td>
                  <td className="py-3">&nbsp;</td>
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
                    <span className={cn("rounded-full px-2 py-1 text-xs font-medium", MEMBER_TYPE_TONE[txn.type])}>{txn.type}</span>
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
                    <span className={cn("rounded-full px-2 py-1 text-xs font-medium", PAYMENT_TONE[txn.payment])}>{txn.payment}</span>
                  </td>
                  <td className="py-3">
                    <span className={cn("rounded-full px-2 py-1 text-xs font-medium", txn.status === "Checked In" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600")}>{txn.status}</span>
                  </td>
                </tr>
              )
            ))}
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

      {/* Fixed Bottom Section - Sticks to Bottom */}
      <div className="mt-auto border-t border-ink-950/5 pt-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
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
            onClick={() => handlePageChange(currentPage + 1)}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-950/60 hover:bg-ink-950/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>

        {/* Centered View all transactions button */}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6">
            
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink-950">New Transaction</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-ink-950/50 hover:bg-gray-100 hover:text-ink-950"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6 flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setTransactionType("daily")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold transition-all ${
                  transactionType === "daily" ? "bg-white text-ink-950 shadow-sm" : "text-ink-950/50"
                }`}
              >
                <CalendarClock size={16} /> Daily Visit
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
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-ink-950/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-ink-950/60 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold text-ink-950 hover:bg-gold-600 ${
                    transactionType === "plan" ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gold-500"
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