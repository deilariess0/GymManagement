// src/pages/Reports.jsx
import { useState, useMemo } from "react";
import { useGym } from "../context/useGym";
import { TrendingUp, Receipt, Users, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../utils/cn";

export default function Reports() {
  // Pull shared data
  const { transactions, members } = useGym();

  // State
  const [reportType, setReportType] = useState("daily"); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  // Filters
  const filteredTransactions = useMemo(() => transactions, [transactions]);

  // Totals
  const totalEarnings = filteredTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalTransactions = filteredTransactions.length;
  const totalMembers = members.length;

  // Membership Breakdown
  const membershipPlans = ["Weekly", "Monthly", "3 Months", "6 Months"];
  const membershipCounts = membershipPlans.map((plan) => ({
    plan,
    count: members.filter((m) => m.plan === plan).length,
  }));

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // CSV Download
  const handleDownload = () => {
    const headers = ["Time", "Member Name", "Type", "Plan", "Amount (₱)", "Payment", "Status"];
    const rows = filteredTransactions.map((txn) => [
      txn.time,
      txn.name,
      txn.type,
      txn.plan,
      txn.amount.toFixed(2),
      txn.payment,
      txn.status
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportType === 'daily' ? 'Daily' : 'Monthly'}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // UI Helpers
  const getInitials = (name) => name.split(" ").map(n => n[0]).join("").toUpperCase();
  const getAvatarColor = (name) => {
    const colors = ["bg-orange-500", "bg-pink-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  // Shared Pagination
  const PaginationUI = () => (
    <div className="mt-4 flex items-center justify-between border-t border-ink-950/5 pt-4">
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
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header with Download Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-950">Reports</h1>
          <p className="mt-1 text-sm text-ink-950/45">Daily and monthly performance breakdown.</p>
        </div>
        <button
          onClick={handleDownload}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-gold-500 px-3.5 py-2 text-sm font-bold text-ink-950 transition-colors hover:bg-gold-600 sm:w-auto"
        >
          <Download size={14} strokeWidth={3} /> Download Report
        </button>
      </div>

      {/* Report Type Switcher */}
      <div className="inline-flex w-full rounded-lg bg-gray-100 p-1 sm:w-auto">
        <button
          onClick={() => { setReportType("daily"); setCurrentPage(1); }}
          className={cn(
            "flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all",
            reportType === "daily" ? "bg-white text-ink-950 shadow-sm" : "text-ink-950/50"
          )}
        >
          Today's Report
        </button>
        <button
          onClick={() => { setReportType("monthly"); setCurrentPage(1); }}
          className={cn(
            "flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all",
            reportType === "monthly" ? "bg-white text-ink-950 shadow-sm" : "text-ink-950/50"
          )}
        >
          This Month's Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600">
            <TrendingUp size={20} strokeWidth={2.25} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold tracking-wide text-ink-950/45">Total Earnings</p>
            <p className="truncate text-2xl font-extrabold tracking-tight text-ink-950">₱{totalEarnings.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-600">
            <Receipt size={20} strokeWidth={2.25} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold tracking-wide text-ink-950/45">Total Transactions</p>
            <p className="truncate text-2xl font-extrabold tracking-tight text-ink-950">{totalTransactions}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-600">
            <Users size={20} strokeWidth={2.25} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold tracking-wide text-ink-950/45">Active Members</p>
            <p className="truncate text-2xl font-extrabold tracking-tight text-ink-950">{totalMembers}</p>
          </div>
        </div>
      </div>

      {/* Membership Breakdown */}
      <div className="rounded-2xl bg-white p-5 shadow-card">
        <h2 className="text-sm font-bold tracking-wide text-ink-950">Membership Breakdown</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {membershipCounts.map((item) => (
            <div key={item.plan} className="rounded-xl bg-ink-950/5 p-4 text-center">
              <p className="text-2xl font-extrabold text-ink-950">{item.count}</p>
              <p className="mt-1 text-xs font-semibold text-ink-950/45">{item.plan}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden rounded-2xl bg-white p-5 shadow-card md:block">
        <h2 className="text-sm font-bold tracking-wide text-ink-950">
          {reportType === "daily" ? "Today's Transactions" : "This Month's Transactions"}
        </h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-ink-950/35">
                <th className="pb-3 pr-3 font-semibold">Time</th>
                <th className="pb-3 pr-3 font-semibold">Member Name</th>
                <th className="pb-3 pr-3 font-semibold">Type</th>
                <th className="pb-3 pr-3 font-semibold">Plan</th>
                <th className="pb-3 pr-3 font-semibold">Amount</th>
                <th className="pb-3 pr-3 font-semibold">Payment</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((t) => (
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
                    <span className={cn("rounded-full px-2 py-1 text-xs font-medium", t.type === "Student" ? "bg-pink-100 text-pink-600" : "bg-orange-100 text-orange-600")}>
                      {t.type}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-ink-950/70">{t.plan}</td>
                  <td className="py-3 pr-3 font-semibold text-ink-950">₱{(Number(t.amount) || 0).toFixed(2)}</td>
                  <td className="py-3 pr-3 text-ink-950/70">{t.payment}</td>
                  <td className="py-3">
                    <span className={cn("rounded-full px-2 py-1 text-xs font-medium", t.status === "Checked In" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600")}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
              {paginatedTransactions.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-ink-950/40">No transactions for this period.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <PaginationUI />
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {paginatedTransactions.length > 0 ? (
          paginatedTransactions.map((t) => (
            <div key={t.id} className="rounded-2xl bg-white p-4 shadow-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${getAvatarColor(t.name)} text-xs font-bold text-white`}>
                    {getInitials(t.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-ink-950">{t.name}</p>
                    <p className="text-xs text-ink-950/50">{t.time}</p>
                  </div>
                </div>
                <span className={cn("rounded-full px-2 py-1 text-[10px] font-medium", t.status === "Checked In" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600")}>
                  {t.status}
                </span>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className={cn("rounded-full px-2 py-1 font-medium", t.type === "Student" ? "bg-pink-100 text-pink-600" : "bg-orange-100 text-orange-600")}>
                  {t.type}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-1 font-medium text-gray-600">
                  {t.plan}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-1 font-medium text-gray-600">
                  {t.payment}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-ink-950/5 pt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-950/40">Amount</p>
                <p className="text-lg font-extrabold text-ink-950">₱{(Number(t.amount) || 0).toFixed(2)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl bg-white p-10 text-center text-ink-950/40 shadow-card">
            No transactions for this period.
          </div>
        )}
        
        <div className="rounded-2xl bg-white p-4 shadow-card">
          <PaginationUI />
        </div>
      </div>
    </div>
  );
}