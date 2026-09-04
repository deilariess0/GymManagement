import { Trophy } from "lucide-react";
import { topMembers } from "../../data/topMembers";
import Avatar from "../ui/Avatar";
import { cn } from "../../utils/cn";

const RANK_STYLES = {
  1: "bg-gold-500 text-ink-950",
  2: "bg-ink-950/10 text-ink-950/70",
  3: "bg-gold-500/20 text-gold-600",
};

export default function TopMembers() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-wide text-ink-950">TOP MEMBERS (THIS MONTH)</h2>
        <Trophy size={16} className="text-gold-500" />
      </div>

      <ul className="mt-3 space-y-1">
        {topMembers.map((member) => (
          <li key={member.rank} className="flex items-center gap-3 rounded-xl px-1 py-2.5">
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                RANK_STYLES[member.rank]
              )}
            >
              {member.rank}
            </span>
            <Avatar name={member.name} size="sm" />
            <span className="flex-1 truncate text-sm font-semibold text-ink-950">{member.name}</span>
            <span className="rounded-full bg-gold-500/15 px-2.5 py-1 text-xs font-bold text-gold-600">
              {member.visits} visits
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
