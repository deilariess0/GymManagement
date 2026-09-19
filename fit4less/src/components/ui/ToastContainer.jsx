import { CheckCircle2, CalendarClock, Package, UserPlus, X } from "lucide-react";
import { useNotifications } from "../../context/useNotifications";
import { cn } from "../../utils/cn";

const TOAST_ICONS = {
  checkin:  { icon: CheckCircle2,  color: "bg-emerald-100 text-emerald-600" },
  expiring: { icon: CalendarClock, color: "bg-amber-100 text-amber-600" },
  payment:  { icon: Package,       color: "bg-sky-100 text-sky-600" },
  member:   { icon: UserPlus,      color: "bg-violet-100 text-violet-600" },
};

export default function ToastContainer() {
  const { activeToasts, removeToast } = useNotifications();

  if (activeToasts.length === 0) return null;

  return (
    // Fixed at the top-center on mobile, top-right on desktop
    <div className="fixed top-20 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2 sm:left-auto sm:right-6 sm:translate-x-0">
      {activeToasts.map((toast) => {
        const config = TOAST_ICONS[toast.type] || TOAST_ICONS.checkin;
        const Icon = config.icon;

        return (
          <div
            key={toast.id}
            className="animate-slide-up flex items-start gap-3 rounded-xl border border-ink-950/10 bg-white p-4 shadow-xl"
          >
            <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", config.color)}>
              <Icon size={16} strokeWidth={2.5} />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm font-semibold leading-tight text-ink-950">
                {toast.title}
              </p>
              <p className="mt-1 text-[10px] text-ink-950/40">Just now</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 rounded-full p-1 text-ink-950/40 transition-colors hover:bg-ink-950/5 hover:text-ink-950"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}