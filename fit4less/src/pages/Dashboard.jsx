// src/pages/Dashboard.jsx
import { useGym } from "../context/useGym";
import StatCard from "../components/dashboard/StatCard";
import TransactionsTable from "../components/dashboard/TransactionsTable";
import TopMembers from "../components/dashboard/TopMembers";
import QuickActions from "../components/dashboard/QuickActions";
import { Users, Banknote, UserCheck, CalendarClock } from "lucide-react"; // Icons for cards

export default function Dashboard() {
  // Pull live data from Context
  const { transactions } = useGym();

  // Calculate dynamic values
  const todayVisits = transactions.length;
  const todayIncome = transactions.reduce((sum, t) => sum + t.amount, 0);

  // Create the stats array dynamically (Calculated every render)
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
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Removed IncomeChart and MembershipBreakdown grid here */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* TransactionsTable now spans 2 columns to fill the empty space left by the charts */}
        <div className="lg:col-span-2">
          <TransactionsTable />
        </div>
        
        <div className="space-y-5">
          <TopMembers />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}