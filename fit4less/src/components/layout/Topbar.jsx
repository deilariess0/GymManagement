// src/components/layout/Topbar.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu, Bell, ChevronDown, User, Settings, LogOut,
  CheckCircle2, Clock, CalendarClock, Package, UserPlus,
} from "lucide-react";
import Avatar from "../ui/Avatar";
import { cn } from "../../utils/cn";
import { useNotifications } from "../../context/useNotifications";

const NOTIFICATION_ICONS = {
  checkin:  { icon: CheckCircle2,  color: "bg-emerald-100 text-emerald-600" },
  expiring: { icon: CalendarClock, color: "bg-amber-100 text-amber-600" },
  payment:  { icon: Package,       color: "bg-sky-100 text-sky-600" },
  member:   { icon: UserPlus,      color: "bg-violet-100 text-violet-600" },
};

const DROPDOWN_SURFACE =
  "absolute right-0 top-12 z-50 overflow-hidden rounded-2xl border border-ink-950/5 bg-white shadow-card";

const ITEM_HOVER = "hover:bg-ink-950/[0.04]";

export default function Topbar({ title, subtitle, onMenuClick, onToggleCollapse }) {
  const navigate = useNavigate();

  // ---- NOTIFICATIONS FROM CONTEXT ----
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();

  // ---- LOCAL UI STATE ----
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notificationsMounted, setNotificationsMounted] = useState(false);
  const [profileMounted, setProfileMounted] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // ---- MOUNT/UNMOUNT HELPERS ----
  useEffect(() => {
    if (showNotifications) setNotificationsMounted(true);
    else if (notificationsMounted) {
      const t = setTimeout(() => setNotificationsMounted(false), 140);
      return () => clearTimeout(t);
    }
  }, [showNotifications, notificationsMounted]);

  useEffect(() => {
    if (showProfile) setProfileMounted(true);
    else if (profileMounted) {
      const t = setTimeout(() => setProfileMounted(false), 140);
      return () => clearTimeout(t);
    }
  }, [showProfile, profileMounted]);

  // ---- CLICK OUTSIDE ----
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---- ESCAPE KEY ----
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setShowNotifications(false);
        setShowProfile(false);
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // ---- HANDLERS ----
  const handleToggleNotifications = useCallback(() => {
    setShowNotifications((prev) => !prev);
    setShowProfile(false);
  }, []);

  const handleToggleProfile = useCallback(() => {
    setShowProfile((prev) => !prev);
    setShowNotifications(false);
  }, []);

  const handleNotificationClick = (id) => {
    markAsRead(id);
    setShowNotifications(false);
    navigate("/check-in");
  };

  const handleProfileAction = (path) => {
    setShowProfile(false);
    navigate(path);
  };

  const handleLogout = () => {
    setShowProfile(false);
    if (confirm("Are you sure you want to logout?")) {
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-[76px] items-center gap-4 border-b border-ink-950/5 bg-white px-5 shadow-sm lg:px-8">

      {/* Desktop Hamburger Menu */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-950/60 transition-colors hover:bg-ink-950/5 lg:flex"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Branding */}
      <div className="flex items-center lg:hidden">
        <div className="leading-tight">
          <p className="text-base font-extrabold tracking-tight text-ink-950">
            FIT<span className="text-gold-500">4</span>LESS
          </p>
          <p className="text-[8px] font-bold tracking-[0.15em] text-ink-950/40">
            GYM MANAGEMENT
          </p>
        </div>
      </div>

      {/* Desktop Title */}
      <div className="hidden shrink-0 flex-col justify-center lg:flex">
        <h1 className="text-xl font-extrabold leading-tight tracking-tight text-ink-950">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm leading-tight text-ink-950/50">{subtitle}</p>
        )}
      </div>

      {/* Right Side Controls */}
      <div className="ml-auto flex items-center justify-end gap-3">

        {/* ============ NOTIFICATIONS ============ */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={handleToggleNotifications}
            className={cn(
              "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200",
              showNotifications
                ? "border-gold-500 bg-gold-500/10 text-gold-600"
                : "border-ink-950/10 text-ink-950/60 hover:bg-ink-950/5"
            )}
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
            <Bell
              size={18}
              className={cn(
                "transition-transform duration-200",
                showNotifications && "rotate-12"
              )}
            />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsMounted && (
            <div
              className={cn(
                DROPDOWN_SURFACE,
                "w-80 sm:w-96",
                showNotifications ? "animate-dropdown-in" : "animate-dropdown-out"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-ink-950/5 px-4 py-3">
                <div>
                  <h3 className="text-sm font-bold text-ink-950">Notifications</h3>
                  <p className="text-[10px] text-ink-950/45">{unreadCount} unread</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-bold text-sky-600 transition-colors hover:text-sky-700"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif, index) => {
                    const config = NOTIFICATION_ICONS[notif.type] || NOTIFICATION_ICONS.checkin;
                    const Icon = config.icon;
                    return (
                      <button
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif.id)}
                        style={{ animationDelay: `${index * 40}ms` }}
                        className={cn(
                          "animate-dropdown-item flex w-full items-start gap-3 border-b border-ink-950/5 px-4 py-3 text-left transition-colors last:border-0",
                          "hover:bg-ink-950/[0.03]",
                          !notif.read && "bg-sky-50/50"
                        )}
                      >
                        <span className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          config.color
                        )}>
                          <Icon size={14} strokeWidth={2.5} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={cn(
                            "text-xs leading-relaxed",
                            notif.read ? "text-ink-950/60" : "font-semibold text-ink-950"
                          )}>
                            {notif.title}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-[10px] text-ink-950/40">
                            <Clock size={10} />
                            {notif.time}
                          </p>
                        </div>
                        {!notif.read && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="p-8 text-center">
                    <Bell size={24} className="mx-auto mb-2 text-ink-950/20" />
                    <p className="text-xs text-ink-950/40">No notifications</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-ink-950/5 p-2">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate("/reports");
                  }}
                  className={cn(
                    "w-full rounded-lg py-2 text-center text-xs font-bold text-ink-950/60 transition-colors",
                    ITEM_HOVER
                  )}
                >
                  View all activity
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ============ PROFILE ============ */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={handleToggleProfile}
            className={cn(
              "flex items-center gap-2.5 rounded-xl pl-1 pr-2 transition-all duration-200",
              showProfile ? "bg-ink-950/5" : "hover:bg-ink-950/5"
            )}
            aria-expanded={showProfile}
          >
            <Avatar name="Deil Aries Santos" size="md" />
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-semibold text-ink-950">
                Deil Aries Santos
              </span>
              <span className="block text-xs text-ink-950/45">Administrator</span>
            </span>
            <ChevronDown
              size={16}
              className={cn(
                "hidden text-ink-950/40 transition-transform duration-200 sm:block",
                showProfile && "rotate-180"
              )}
            />
          </button>

          {profileMounted && (
            <div
              className={cn(
                DROPDOWN_SURFACE,
                "w-64",
                showProfile ? "animate-dropdown-in" : "animate-dropdown-out"
              )}
            >
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-ink-950/5 p-4">
                <Avatar name="Deil Aries Santos" size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink-950">
                    Deil Aries Santos
                  </p>
                  <p className="truncate text-[11px] text-ink-950/45">
                    deil.santos@fit4less.ph
                  </p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button
                  onClick={() => handleProfileAction("/settings")}
                  style={{ animationDelay: "0ms" }}
                  className={cn(
                    "animate-dropdown-item flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-ink-950/70 transition-colors hover:text-ink-950",
                    ITEM_HOVER
                  )}
                >
                  <User size={16} />
                  My Profile
                </button>

                <button
                  onClick={() => handleProfileAction("/settings")}
                  style={{ animationDelay: "40ms" }}
                  className={cn(
                    "animate-dropdown-item flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-ink-950/70 transition-colors hover:text-ink-950",
                    ITEM_HOVER
                  )}
                >
                  <Settings size={16} />
                  Settings
                </button>

                <div className="my-1 h-px bg-ink-950/5" />

                <button
                  onClick={handleLogout}
                  style={{ animationDelay: "80ms" }}
                  className={cn(
                    "animate-dropdown-item flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-rose-600 transition-colors",
                    ITEM_HOVER
                  )}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>

              {/* Footer */}
              <div className="border-t border-ink-950/5 p-3 text-center">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-ink-950/25">
                  FIT<span className="text-gold-500">4</span>LESS · v1.0
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}