// src/components/layout/DashboardLayout.jsx
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileBottomNav from "./MobileBottomNav"; // <--- 1. IMPORT
import { navigation } from "../../data/navigation";

// Subtitle map for each route
const PAGE_SUBTITLES = {
  "/": "Welcome back, Admin!",
  "/check-in": "Scan or search a member to log today's visit.",
  "/members": "Manage your gym's active members.",
  "/payments": "Track all income and transactions.",
  "/reports": "View your gym's performance insights.",
  "/settings": "Configure your gym system preferences.",
};

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { pathname } = useLocation();

  const current =
    navigation.find((item) => (item.path === "/" ? pathname === "/" : pathname.startsWith(item.path))) ??
    navigation[0];

  const subtitle = PAGE_SUBTITLES[current.path];

  return (
    // Lock the app to viewport height so only inner content scrolls
    <div className="flex h-screen overflow-hidden bg-surface">
      
      {/* Desktop Sidebar */}
      <Sidebar 
        forceVisible={mobileOpen} 
        onClose={() => setMobileOpen(false)} 
        collapsed={isCollapsed} 
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Topbar */}
        <Topbar 
          title={current.label} 
          subtitle={subtitle} 
          onMenuClick={() => setMobileOpen(true)} 
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
        
        {/* 
          Main Content 
          - pb-24 (mobile): Extra padding at bottom so content isn't hidden by the bottom nav
          - lg:pb-6 (desktop): Normal padding since bottom nav is hidden on desktop
        */}
        <main className="flex-1 overflow-y-auto px-5 py-6 pb-24 lg:px-8 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* 2. RENDER Mobile Bottom Navigation (Hidden on desktop via its own lg:hidden) */}
      <MobileBottomNav />
    </div>
  );
}