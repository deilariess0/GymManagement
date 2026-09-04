import {
  LayoutGrid,
  ScanLine,
  Users,
  Wallet,
  BarChart3,
  Tag,
  Settings,
} from "lucide-react";

// Central source of truth for the sidebar. Add a route here and it
// automatically appears in the nav + gets a placeholder page via App.jsx.
export const navigation = [
  { label: "Dashboard", path: "/", icon: LayoutGrid },
  { label: "Check-in", path: "/check-in", icon: ScanLine },
  { label: "Members", path: "/members", icon: Users },
  { label: "Payments", path: "/payments", icon: Wallet },
  { label: "Reports", path: "/reports", icon: BarChart3 },
  { label: "Plans & Pricing", path: "/plans-pricing", icon: Tag },
  { label: "Settings", path: "/settings", icon: Settings },
];