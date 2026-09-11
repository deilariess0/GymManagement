// src/pages/Payments.jsx
import { useState } from "react";
import { useGym } from "../context/useGym";
import TransactionsTable from "../components/dashboard/TransactionsTable";
import { Search, TrendingUp, Receipt, ArrowUp } from "lucide-react";

export default function Payments() {
  const { transactions } = useGym();
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate totals
  const totalEarningsToday = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalTransactions = transactions?.length || 0;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink-950 md:text-2xl">Payments & Transactions</h1>
      </div>

      {/* Summary Cards - 2x2 Grid on Mobile (Matches Dashboard StatCard) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        
        {/* Total Earnings Card */}
        <div className="rounded-2xl bg-white p-4 md:p-5 shadow-card">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 md:h-12 md:w-12 md:rounded-2xl">
              <TrendingUp size={18} className="md:hidden" strokeWidth={2.25} />
              <TrendingUp size={20} className="hidden md:block" strokeWidth={2.25} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] md:text-xs font-semibold tracking-wide text-ink-950/45">
                Total Earnings Today
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <p className="text-xl md:text-2xl font-extrabold tracking-tight text-ink-950">
                  ₱{(Number(totalEarningsToday) || 0).toFixed(2)}
                </p>
                <span className="flex items-center gap-0.5 text-[10px] md:text-xs font-bold text-emerald-600">
                  <ArrowUp size={10} strokeWidth={3} />
                  8%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Transactions Card */}
        <div className="rounded-2xl bg-white p-4 md:p-5 shadow-card">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 md:h-12 md:w-12 md:rounded-2xl">
              <Receipt size={18} className="md:hidden" strokeWidth={2.25} />
              <Receipt size={20} className="hidden md:block" strokeWidth={2.25} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] md:text-xs font-semibold tracking-wide text-ink-950/45">
                Total Transactions
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <p className="text-xl md:text-2xl font-extrabold tracking-tight text-ink-950">
                  {totalTransactions}
                </p>
                <span className="flex items-center gap-0.5 text-[10px] md:text-xs font-bold text-emerald-600">
                  <ArrowUp size={10} strokeWidth={3} />
                  15%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative flex w-full items-center">
        <Search className="absolute left-3 text-ink-950/30" size={18} strokeWidth={2.25} />
        <input
          type="text"
          placeholder="Search transactions by member name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full min-h-[48px] pl-10 pr-4 border border-ink-950/10 rounded-xl bg-surface text-sm text-ink-950 outline-none focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/15 transition-all placeholder:text-ink-950/30"
        />
      </div>

      {/* Transactions Table */}
      <TransactionsTable searchQuery={searchTerm} />
    </div>
  );
}