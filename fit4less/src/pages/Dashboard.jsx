// src/pages/Dashboard.jsx
import { useGym } from "../context/useGym";
import StatCard from "../components/dashboard/StatCard";
import TransactionsTable from "../components/dashboard/TransactionsTable";
import TopMembers from "../components/dashboard/TopMembers";
import QuickActions from "../components/dashboard/QuickActions";
import { Users, Banknote, UserCheck, CalendarClock } from "lucide-react";

export default function Dashboard() {
  const { transactions } = useGym();

  const todayVisits = transactions.length;
  const todayIncome = transactions.reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    {
      id: "visits",
      label: "Today's Visits",
      value: todayVisits,
      trend: { direction: "up", percent: "12%" },
      note: "vs last day (37)",
      tone: "gold",
      icon: Users,
    },
    {
      id: "income",
      label: "Today's Income",
      value: `₱${todayIncome.toFixed(2)}`,
      trend: { direction: "up", percent: "8%" },
      note: "vs last day (₱2,299.00)",
      tone: "green",
      icon: Banknote,
    },
    {
      id: "activeMembers",
      label: "Active Members",
      value: 128,
      trend: { direction: "up", percent: "15%" },
      note: "vs last day (111)",
      tone: "violet",
      icon: UserCheck,
    },
    {
      id: "expiringSoon",
      label: "Expiring Soon",
      value: 7,
      trend: { direction: "up", percent: "3%" },
      note: "Within 7 days",
      tone: "red",
      icon: CalendarClock,
    },
  ];

  return (
    <div className="space-y-4 md:space-y-5">
      
      {/* 
        MOBILE-ONLY HEADING
        Hidden on desktop (lg:hidden) because the Topbar already shows the title.
        Visible only on mobile since the Topbar shows the FIT4LESS logo instead.
      */}
      <div className="lg:hidden">
        <h1 className="text-xl font-extrabold tracking-tight text-ink-950">
          Dashboard
        </h1>
        <p className="text-xs text-ink-950/50 mt-0.5">
          Welcome back, Admin!
        </p>
      </div>

      {/* Stat Cards: 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:gap-5 lg:grid-cols-3">
        {/* TransactionsTable spans 2 columns on desktop, full width on mobile */}
        <div className="lg:col-span-2">
          <TransactionsTable />
        </div>
        
        {/* Right Sidebar: TopMembers and QuickActions */}
        <div className="space-y-4 lg:space-y-5">
          <TopMembers />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}