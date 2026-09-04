import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronDown } from "lucide-react";
import { incomeOverview, incomeRanges } from "../../data/incomeOverview";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-ink-950/5 bg-white px-3.5 py-2.5 shadow-card">
      <p className="text-xs font-semibold text-ink-950/50">{label}</p>
      <p className="text-sm font-bold text-gold-600">₱{payload[0].value.toLocaleString()}</p>
    </div>
  );
}

export default function IncomeChart() {
  const [range, setRange] = useState(incomeRanges[0]);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-card lg:col-span-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold tracking-wide text-ink-950">Income Overview</h2>
          <div className="mt-2 flex items-center gap-4 text-xs font-medium text-ink-950/50">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-gold-500" /> Daily Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-ink-950/20" /> Previous 7 Days
            </span>
          </div>
        </div>

        <div className="relative">
          <select
            value={range}
            onChange={(event) => setRange(event.target.value)}
            className="appearance-none rounded-lg border border-ink-950/10 bg-white py-2 pl-3 pr-8 text-xs font-semibold text-ink-950/70 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
          >
            {incomeRanges.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-950/40" />
        </div>
      </div>

      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={incomeOverview} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F4B740" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#F4B740" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#EEEFF3" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8A8B98", fontSize: 12 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8A8B98", fontSize: 12 }}
              tickFormatter={(value) => `₱${value / 1000}k`}
              width={44}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#EEEFF3", strokeWidth: 24 }} />
            <Line
              type="monotone"
              dataKey="previous"
              stroke="#C7C8D2"
              strokeWidth={2}
              dot={{ r: 3, fill: "#C7C8D2", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#F4B740"
              strokeWidth={3}
              dot={{ r: 3, fill: "#F4B740", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              fill="url(#incomeFill)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
