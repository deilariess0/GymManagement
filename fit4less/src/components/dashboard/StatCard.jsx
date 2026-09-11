import { ArrowUp, ArrowDown, Users, Banknote, UserCheck, CalendarClock } from "lucide-react";
import { cn } from "../../utils/cn";

const ICONS = {
  visits: Users,
  income: Banknote,
  activeMembers: UserCheck,
  expiringSoon: CalendarClock,
};

const TONES = {
  gold: "bg-gold-500/15 text-gold-600",
  green: "bg-emerald-500/15 text-emerald-600",
  violet: "bg-violet-500/15 text-violet-600",
  red: "bg-rose-500/15 text-rose-600",
};

export default function StatCard({ stat }) {
  const Icon = ICONS[stat.id] ?? Users;
  const isUp = stat.trend.direction === "up";

  return (
    <div className="rounded-2xl bg-white p-4 md:p-5 shadow-card">
      {/* 
        LAYOUT CHANGE: 
        - Mobile: flex-col (Icon on top, text below)
        - Desktop (md+): flex-row (Icon on left, text on right)
      */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4">
        
        {/* Icon Container - Smaller on mobile */}
        <span className={cn(
          "flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl md:rounded-2xl", 
          TONES[stat.tone]
        )}>
          <Icon size={18} className="md:hidden" strokeWidth={2.25} />
          <Icon size={20} className="hidden md:block" strokeWidth={2.25} />
        </span>

        <div className="min-w-0 flex-1">
          {/* Label - Smaller font on mobile */}
          <p className="text-[11px] md:text-xs font-semibold tracking-wide text-ink-950/45">
            {stat.label}
          </p>
          
          {/* Value & Trend Row */}
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            {/* Value - Smaller on mobile so long amounts like ₱1,310 don't overflow */}
            <p className="text-xl md:text-2xl font-extrabold tracking-tight text-ink-950">
              {stat.value}
            </p>
            
            {/* Trend Badge */}
            <span
              className={cn(
                "flex items-center gap-0.5 text-[10px] md:text-xs font-bold",
                isUp ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {isUp ? <ArrowUp size={10} strokeWidth={3} /> : <ArrowDown size={10} strokeWidth={3} />}
              {stat.trend.percent}
            </span>
          </div>
          
          {/* Note - Hidden on mobile to save space, visible on desktop */}
          <p className="mt-0.5 truncate text-[10px] md:text-xs text-ink-950/40 hidden md:block">
            {stat.note}
          </p>
          {/* Optional: Show a shortened note on mobile? Or just hide it entirely for cleanliness. */}
        </div>
      </div>
    </div>
  );
}