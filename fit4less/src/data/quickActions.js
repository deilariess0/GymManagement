// src/data/quickActions.js
import { ScanLine, UserPlus, Wallet, BarChart3 } from "lucide-react";

export const quickActions = [
  { id: "checkin", label: "Check-in Member", icon: ScanLine, tone: "gold", path: "/check-in" },
  { id: "add-member", label: "Add Member", icon: UserPlus, tone: "green", path: "/members/register" }, // <--- CHANGED
  { id: "new-payment", label: "New Payment", icon: Wallet, tone: "blue", path: "/payments" },
  { id: "view-reports", label: "View Reports", icon: BarChart3, tone: "violet", path: "/reports" },
];