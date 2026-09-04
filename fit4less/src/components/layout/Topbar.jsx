// src/components/layout/Topbar.jsx
import { Menu, Bell, ChevronDown } from "lucide-react";
import Avatar from "../ui/Avatar";

export default function Topbar({ title, subtitle, onMenuClick, onToggleCollapse }) {
  return (
    <header className="flex items-center gap-4 border-b border-ink-950/5 bg-white px-5 py-4 lg:px-8">
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-950/60 hover:bg-ink-950/5 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Desktop Collapse Button (Changed to Hamburger Icon) */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="hidden h-9 w-9 items-center justify-center rounded-lg text-ink-950/60 hover:bg-ink-950/5 lg:flex"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <div className="hidden shrink-0 lg:block">
        <h1 className="text-xl font-extrabold tracking-tight text-ink-950">{title}</h1>
        {subtitle && <p className="text-sm text-ink-950/50">{subtitle}</p>}
      </div>

      {/* Right Side Controls */}
      <div className="ml-auto flex flex-1 items-center justify-end gap-3 lg:flex-none">
        {/* Notification Bell */}
        <button
          type="button"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ink-950/10 text-ink-950/60 hover:bg-ink-950/5"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* Admin Profile */}
        <button type="button" className="flex items-center gap-2.5 rounded-xl pl-1 pr-2 hover:bg-ink-950/5">
          <Avatar name="Deil Aries Santos" size="md" />
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-sm font-semibold text-ink-950">Deil Aries Santos</span>
            <span className="block text-xs text-ink-950/45">Administrator</span>
          </span>
          <ChevronDown size={16} className="hidden text-ink-950/40 sm:block" />
        </button>
      </div>
    </header>
  );
}