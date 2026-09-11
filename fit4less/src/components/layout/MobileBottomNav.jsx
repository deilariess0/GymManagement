// src/components/layout/MobileBottomNav.jsx
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  ScanLine, 
  Users, 
  CreditCard, 
  MoreHorizontal, 
  X, 
  BarChart3, 
  Settings, 
  Download 
} from "lucide-react";
import { cn } from "../../utils/cn";

const MAIN_TABS = [
  { label: "Home", path: "/", icon: Home },
  { label: "Check-in", path: "/check-in", icon: ScanLine },
  { label: "Members", path: "/members", icon: Users },
  { label: "Payments", path: "/payments", icon: CreditCard },
];

const MORE_TABS = [
  { label: "Reports", path: "/reports", icon: BarChart3, subtitle: "insights" },
  { label: "Settings", path: "/settings", icon: Settings, subtitle: "configure" },
];

export default function MobileBottomNav() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { pathname } = useLocation();

  const isMoreActive = MORE_TABS.some(tab => pathname.startsWith(tab.path));

  // Mock Export CSV action
  const handleExport = () => {
    alert("Exporting CSV...");
    setIsMoreOpen(false);
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-ink-950/5 bg-white px-2 pb-safe pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] lg:hidden">
        {MAIN_TABS.map((tab) => {
          const isActive = tab.path === "/" ? pathname === "/" : pathname.startsWith(tab.path);
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-1 transition-colors",
                isActive ? "text-gold-600" : "text-ink-950/40 hover:text-ink-950/60"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold">{tab.label}</span>
            </NavLink>
          );
        })}

        {/* More Button */}
        <button
          type="button"
          onClick={() => setIsMoreOpen(true)}
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-1 transition-colors",
            isMoreActive ? "text-gold-600" : "text-ink-950/40 hover:text-ink-950/60"
          )}
        >
          <MoreHorizontal size={20} strokeWidth={isMoreActive ? 2.5 : 2} />
          <span className="text-[10px] font-bold">More</span>
        </button>
      </nav>

      {/* More Menu Modal */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/60 backdrop-blur-sm animate-fade-in lg:hidden">
          <div className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-2xl animate-slide-up">
            
            {/* Drag Handle */}
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200" />

            {/* Header */}
            <div className="mb-1 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-ink-950">More</h3>
                <p className="text-xs text-ink-950/45 mt-0.5">Reports, settings & account</p>
              </div>
              <button 
                onClick={() => setIsMoreOpen(false)} 
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-ink-950/60 hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Main Links */}
            <div className="mt-5 space-y-1">
              {MORE_TABS.map((tab) => {
                const isActive = pathname.startsWith(tab.path);
                const Icon = tab.icon;
                return (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    onClick={() => setIsMoreOpen(false)}
                    className={cn(
                      "flex items-center gap-4 rounded-xl px-3 py-3.5 transition-colors",
                      isActive ? "bg-gold-500" : "hover:bg-gray-50"
                    )}
                  >
                    <Icon 
                      size={20} 
                      strokeWidth={2.25} 
                      className={isActive ? "text-ink-950" : "text-ink-950/70"} 
                    />
                    <div className="flex flex-1 items-center justify-between">
                      <span className={cn(
                        "text-sm font-bold",
                        isActive ? "text-ink-950" : "text-ink-950/90"
                      )}>
                        {tab.label}
                      </span>
                      <span className={cn(
                        "text-[11px] font-medium",
                        isActive ? "text-ink-950/60" : "text-ink-950/35"
                      )}>
                        {tab.subtitle}
                      </span>
                    </div>
                  </NavLink>
                );
              })}

              {/* Export CSV Action */}
              <button
                type="button"
                onClick={handleExport}
                className="flex w-full items-center gap-4 rounded-xl px-3 py-3.5 text-left hover:bg-gray-50 transition-colors"
              >
                <Download size={20} strokeWidth={2.25} className="text-ink-950/70" />
                <div className="flex flex-1 items-center justify-between">
                  <span className="text-sm font-bold text-ink-950/90">Export CSV</span>
                  <span className="text-[11px] font-medium text-ink-950/35">.csv</span>
                </div>
              </button>
            </div>

            {/* Divider */}
            <div className="my-4 h-px w-full bg-ink-950/5" />

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-200 text-violet-700 text-sm font-bold">
                DA
              </div>
              <div>
                <p className="text-sm font-bold text-ink-950">Deil Aries Santos</p>
                <p className="text-[11px] text-ink-950/45">Administrator</p>
              </div>
            </div>

            {/* Version Footer */}
            <div className="mt-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-950/25">
                FIT<span className="text-gold-500">4</span>LESS · PROTOTYPE v1.0
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}