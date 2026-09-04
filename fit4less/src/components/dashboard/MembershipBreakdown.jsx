import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { membershipBreakdown, membershipTotal } from "../../data/membershipBreakdown";

export default function MembershipBreakdown() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <h2 className="text-sm font-bold tracking-wide text-ink-950">Membership Breakdown</h2>

      <div className="mt-2 flex items-center gap-4">
        <div className="relative h-36 w-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={membershipBreakdown}
                dataKey="count"
                nameKey="label"
                innerRadius="68%"
                outerRadius="100%"
                paddingAngle={2}
                stroke="none"
              >
                {membershipBreakdown.map((slice) => (
                  <Cell key={slice.id} fill={slice.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xl font-extrabold text-ink-950">{membershipTotal}</p>
            <p className="text-[11px] font-medium text-ink-950/40">Total</p>
          </div>
        </div>

        <ul className="flex-1 space-y-2.5">
          {membershipBreakdown.map((slice) => (
            <li key={slice.id} className="flex items-center gap-2 text-sm">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
              <span className="flex-1 font-medium text-ink-950/70">{slice.label}</span>
              <span className="font-semibold text-ink-950">{slice.count}</span>
              <span className="w-14 text-right text-xs text-ink-950/40">({slice.percent})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
