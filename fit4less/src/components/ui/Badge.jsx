import { cn } from "../../utils/cn";

const TONES = {
  amber: "bg-gold-500/15 text-gold-600",
  green: "bg-emerald-500/15 text-emerald-600",
  blue: "bg-sky-500/15 text-sky-600",
  violet: "bg-violet-500/15 text-violet-600",
  slate: "bg-ink-950/5 text-ink-950/70",
};

export default function Badge({ children, tone = "slate", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        TONES[tone] ?? TONES.slate,
        className
      )}
    >
      {children}
    </span>
  );
}
