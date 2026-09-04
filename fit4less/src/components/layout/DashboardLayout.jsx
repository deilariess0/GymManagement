// src/components/layout/DashboardLayout.jsx
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { navigation } from "../../data/navigation";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // For PC collapse
  const { pathname } = useLocation();

  const current =
    navigation.find((item) => (item.path === "/" ? pathname === "/" : pathname.startsWith(item.path))) ??
    navigation[0];

  const subtitle = current.path === "/" ? "Welcome back, Admin!" : undefined;

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar 
        forceVisible={mobileOpen} 
        onClose={() => setMobileOpen(false)} 
        collapsed={isCollapsed} 
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar 
          title={current.label} 
          subtitle={subtitle} 
          onMenuClick={() => setMobileOpen(true)} 
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
        <main className="flex-1 px-5 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}