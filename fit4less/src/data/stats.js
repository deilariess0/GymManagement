// Top-row summary stats for the dashboard. Swap this for a real API
// response later — every consumer just expects this same shape.
export const stats = [
  {
    id: "visits",
    label: "Today's Visits",
    value: "42",
    trend: { direction: "up", percent: "12%" },
    note: "vs yesterday (37)",
    tone: "gold",
  },
  {
    id: "income",
    label: "Today's Income",
    value: "₱2,450.00",
    trend: { direction: "up", percent: "8%" },
    note: "vs yesterday (₱2,269.00)",
    tone: "green",
  },
  {
    id: "activeMembers",
    label: "Active Members",
    value: "128",
    trend: { direction: "up", percent: "15%" },
    note: "Total active members",
    tone: "violet",
  },
  {
    id: "expiringSoon",
    label: "Expiring Soon",
    value: "7",
    trend: { direction: "down", percent: "3%" },
    note: "Within 7 days",
    tone: "red",
  },
];
