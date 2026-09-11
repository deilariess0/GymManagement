// src/components/layout/Sidebar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, ChevronRight, X } from "lucide-react"; 
import { navigation } from "../../data/navigation";
import { cn } from "../../utils/cn";

export default function Sidebar({ forceVisible = false, onClose, collapsed = false }) {
  const [expandedSections, setExpandedSections] = useState({
    "Main": true,
    "Management": true,
    "Reports": true,
    "Settings": true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sections = [
    { title: "Main", items: navigation.filter((item) => ["Dashboard", "Check-in"].includes(item.label)) },
    { title: "Management", items: navigation.filter((item) => ["Members", "Payments"].includes(item.label)) },
    { title: "Reports", items: navigation.filter((item) => ["Reports"].includes(item.label)) },
    { title: "Settings", items: navigation.filter((item) => ["Settings"].includes(item.label)) },
  ].filter((section) => section.items.length > 0);

  return (
    <>
      {/* Mobile Overlay */}
      {forceVisible && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          "flex-col bg-ink-950 text-white transition-all duration-300",
          collapsed ? "lg:w-20" : "lg:w-64",
          forceVisible ? "fixed inset-y-0 left-0 z-50 flex w-64 translate-x-0" : "hidden lg:flex",
          "lg:static lg:translate-x-0"
        )}
      >
        {/* Top Logo (Unchanged - Text Based) */}
        <div className="flex items-center gap-2.5 px-6 pb-6 pt-7">
          <img 
            src="/fit4less.jpg" 
            alt="FIT4LESS" 
            className={cn(
              "shrink-0 object-contain",
              collapsed ? "h-9 w-9 rounded-lg lg:mx-auto" : "h-10 w-auto"
            )}
          />
          
          {!collapsed && (
            <div className="leading-tight">
              <p className="text-lg font-extrabold tracking-tight">
                FIT<span className="text-gold-400">4</span>LESS
              </p>
              <p className="text-[10px] font-medium tracking-[0.2em] text-white/40">
                GYM MANAGEMENT
              </p>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3">
          {sections.map((section) => (
            <div key={section.title} className="mb-4">
              {collapsed ? (
                <div className="mx-auto mt-2 h-px w-8 bg-white/10" />
              ) : (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white/70"
                >
                  {section.title}
                  {expandedSections[section.title] ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
              )}

              {expandedSections[section.title] && (
                <div className="mt-1 space-y-1">
                  {section.items.map(({ label, path, icon: Icon }) => (
                    <NavLink
                      key={path}
                      to={path}
                      end={path === "/"}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                          collapsed ? "lg:justify-center lg:px-2" : "gap-3",
                          isActive
                            ? "bg-gold-500 text-ink-950 shadow-sm"
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        )
                      }
                    >
                      <Icon size={18} strokeWidth={2} className="shrink-0" />
                      {!collapsed && <span>{label}</span>}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* ============================================
            UPDATED BOTTOM SECTION (Matches Image 2)
            ============================================ */}
        {!collapsed && (
          <div className="px-4 pb-6 pt-4">
            {/* Top border line */}
            <div className="mb-5 h-px w-full bg-white/10" />
            
            {/* Text Branding */}
            <div className="flex flex-col items-center justify-center text-center leading-tight">
              <p className="text-[11px] font-bold tracking-[0.15em] text-white/40">
                FIT<span className="text-gold-400">4</span>LESS
              </p>
              <p className="mt-1 text-[9px] font-semibold tracking-[0.2em] text-white/30">
                MANAGEMENT SYSTEM
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}