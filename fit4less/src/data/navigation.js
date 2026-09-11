// src/data/navigation.js
import {
  LayoutGrid,
  ScanLine,
  Users,
  Wallet,
  BarChart3,
  Settings,
} from "lucide-react";

// Central source of truth for the sidebar.
export const navigation = [
  { label: "Dashboard", path: "/", icon: LayoutGrid },
  { label: "Check-in", path: "/check-in", icon: ScanLine },
  { label: "Members", path: "/members", icon: Users },
  { label: "Payments", path: "/payments", icon: Wallet },
  { label: "Reports", path: "/reports", icon: BarChart3 },
  { label: "Settings", path: "/settings", icon: Settings },
];