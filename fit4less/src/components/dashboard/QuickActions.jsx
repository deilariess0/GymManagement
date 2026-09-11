import { useNavigate } from "react-router-dom";
import { quickActions } from "../../data/quickActions";
import { cn } from "../../utils/cn";

const TONES = {
  gold: "bg-gold-500/12 text-gold-600",
  green: "bg-emerald-500/12 text-emerald-600",
  blue: "bg-sky-500/12 text-sky-600",
  violet: "bg-violet-500/12 text-violet-600",
};

export default function QuickActions() {
  const navigate = useNavigate();

  // Custom click handler to intercept the Check-in button
  const handleActionClick = (action) => {
    // Check if the action is the Check-in button (id: "checkin")
    if (action.id === "checkin") {
      // Navigate to check-in AND pass a state flag to open the scanner
      navigate(action.path, { state: { openScanner: true } });
    } else {
      // Normal navigation for all other buttons
      navigate(action.path);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <h2 className="text-sm font-bold tracking-wide text-ink-950">QUICK ACTIONS</h2>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {quickActions.map((action) => {
          const { id, label, icon: Icon, tone } = action;
          
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleActionClick(action)}
              className="flex flex-col items-center gap-2 rounded-xl border border-ink-950/5 py-4 text-center hover:border-gold-500/40 hover:bg-gold-500/5"
            >
              <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", TONES[tone])}>
                <Icon size={18} strokeWidth={2.25} />
              </span>
              <span className="text-xs font-semibold leading-tight text-ink-950/70">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}