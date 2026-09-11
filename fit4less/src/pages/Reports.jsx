// src/pages/Reports.jsx
import { useState, useMemo } from "react";
import { useGym } from "../context/useGym";
import { TrendingUp, Users, Download, ChevronLeft, ChevronRight, Wallet, AlertCircle, BarChart3, PieChart } from "lucide-react";
import { cn } from "../utils/cn";

export default function Reports() {
  const { transactions, members } = useGym();

  const [reportType, setReportType] = useState("monthly"); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  // --- DATA PROCESSING ---

  // 1. Totals
  const totalEarnings = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalTransactions = transactions.length;
  const totalMembers = members.length;
  const avgPerDay = totalEarnings / 7; // Mock 7-day average

  // 2. Plan Distribution
  const membershipPlans = ["Daily", "Weekly", "Monthly", "3 Months", "6 Months"];
  const planDistribution = membershipPlans.map((plan) => {
    const count = members.filter((m) => m.plan === plan).length;
    const revenue = members.filter((m) => m.plan === plan).reduce((sum, m) => sum + (Number(m.amount) || 0), 0);
    return { plan, count, revenue };
  }).filter(p => p.count > 0);

  // 3. Payment Method Distribution
  const paymentMethods = ["Cash", "GCash", "Maya"];
  const paymentDistribution = paymentMethods.map((method) => {
    const count = transactions.filter((t) => t.payment === method).length;
    const amount = transactions.filter((t) => t.payment === method).reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    return { method, count, amount };
  });

  // 4. Income - Last 7 Days (Mock Data derived from transactions)
  const daysOfWeek = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  const weeklyIncome = daysOfWeek.map((day, index) => {
    // In a real app, you'd filter by actual dates. Here we mock it for the UI.
    const amount = index === 6 ? totalEarnings : Math.floor(Math.random() * 1000) + 100; 
    return { day, amount };
  });
  const maxIncome = Math.max(...weeklyIncome.map(d => d.amount));

  // --- UI HELPERS ---
  const getInitials = (name) => name.split(" ").map(n => n[0]).join("").toUpperCase();
  const getAvatarColor = (name) => {
    const colors = ["bg-orange-500", "bg-pink-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const handleDownload = () => {
    const headers = ["Time", "Member Name", "Type", "Plan", "Amount (₱)", "Payment", "Status"];
    const rows = transactions.map((txn) => [
      txn.time, txn.name, txn.type, txn.plan, txn.amount.toFixed(2), txn.payment, txn.status
    ]);
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Fit4Less_Report.csv`;
    link.click();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-ink-950 md:text-2xl">Reports</h1>
          <p className="text-xs text-ink-950/45 md:text-sm">Business insights at a glance</p>
        </div>
        <button
          onClick={handleDownload}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink-950/10 bg-white px-4 py-2.5 text-sm font-bold text-ink-950 shadow-sm transition-colors hover:bg-gray-50 sm:w-auto"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-4 shadow-card md:p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
              <span className="text-lg font-bold">₱</span>
            </span>
            <div>
              <p className="text-[11px] font-semibold text-ink-950/45">Income This Month</p>
              <p className="text-xl font-extrabold text-ink-950">₱{totalEarnings.toFixed(2)}</p>
              <p className="text-[10px] text-ink-950/40">{totalTransactions} transactions</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-card md:p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
              <span className="text-lg font-bold">₱</span>
            </span>
            <div>
              <p className="text-[11px] font-semibold text-ink-950/45">Avg / Day (7d)</p>
              <p className="text-xl font-extrabold text-ink-950">₱{avgPerDay.toFixed(2)}</p>
              <p className="text-[10px] text-ink-950/40">last 7 days</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-card md:p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-600">
              <Users size={18} strokeWidth={2.5} />
            </span>
            <div>
              <p className="text-[11px] font-semibold text-ink-950/45">Total Members</p>
              <p className="text-xl font-extrabold text-ink-950">{totalMembers}</p>
              <p className="text-[10px] text-ink-950/40">1 new this month</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-card md:p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600">
              <AlertCircle size={18} strokeWidth={2.5} />
            </span>
            <div>
              <p className="text-[11px] font-semibold text-ink-950/45">Status</p>
              <p className="text-xl font-extrabold text-ink-950">3/4/1</p>
              <p className="text-[10px] text-ink-950/40">active / expiring / expired</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart + Side Panels */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        
        {/* Left: Income Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-wide text-ink-950">INCOME — LAST 7 DAYS</h2>
          </div>
          
          {/* CSS Bar Chart */}
          <div className="mt-6 flex h-48 items-end justify-between gap-2">
            {weeklyIncome.map((item, index) => {
              const heightPercentage = (item.amount / maxIncome) * 100;
              return (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[10px] font-bold text-ink-950/60">₱{item.amount}</span>
                  <div 
                    className="w-full max-w-[40px] rounded-t-md bg-gold-500 transition-all duration-500 hover:bg-gold-600"
                    style={{ height: `${heightPercentage}%`, minHeight: '4px' }}
                  />
                  <span className="text-[10px] font-semibold text-ink-950/40">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Side Panels */}
        <div className="space-y-5">
          
          {/* Plan Distribution */}
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold tracking-wide text-ink-950">PLAN DISTRIBUTION</h2>
              <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-[10px] font-bold text-gold-600">This month</span>
            </div>
            <div className="space-y-3">
              {planDistribution.map((item) => {
                const percentage = (item.count / totalMembers) * 100;
                return (
                  <div key={item.plan} className="flex items-center gap-3">
                    <span className="w-16 text-xs font-semibold text-ink-950/70">{item.plan}</span>
                    <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-gold-500" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-ink-950/50 w-20 text-right">
                      {item.count} • ₱{item.revenue}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold tracking-wide text-ink-950">PAYMENT METHODS</h2>
              <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-[10px] font-bold text-gold-600">This month</span>
            </div>
            <div className="space-y-3">
              {paymentDistribution.map((item) => {
                const percentage = (item.count / totalTransactions) * 100;
                return (
                  <div key={item.method} className="flex items-center gap-3">
                    <span className="w-16 text-xs font-semibold text-ink-950/70">{item.method}</span>
                    <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-gold-500" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-ink-950/50 w-20 text-right">
                      {item.count} • ₱{item.amount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}