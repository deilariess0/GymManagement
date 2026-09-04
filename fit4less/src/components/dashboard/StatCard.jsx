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
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <div className="flex items-start gap-4">
        <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", TONES[stat.tone])}>
          <Icon size={20} strokeWidth={2.25} />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-ink-950/45">{stat.label}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-2xl font-extrabold tracking-tight text-ink-950">{stat.value}</p>
            <span
              className={cn(
                "flex items-center gap-0.5 text-xs font-bold",
                isUp ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {isUp ? <ArrowUp size={12} strokeWidth={3} /> : <ArrowDown size={12} strokeWidth={3} />}
              {stat.trend.percent}
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-ink-950/40">{stat.note}</p>
        </div>
      </div>
    </div>
  );
}
