// Two independent breakdowns share the ring: one by billing cycle,
// one by member type. `total` should equal the sum of billing-cycle counts.
export const membershipTotal = 128;

export const membershipBreakdown = [
  { id: "monthly", label: "Monthly", count: 48, percent: "37.5%", color: "#8B7CF6" },
  { id: "weekly", label: "Weekly", count: 32, percent: "25.0%", color: "#4FA6F7" },
  { id: "daily", label: "Daily", count: 28, percent: "21.9%", color: "#1E9E6B" },
  { id: "regular", label: "Regular", count: 58, percent: "45.3%", color: "#F4B740" },
  { id: "student", label: "Student", count: 70, percent: "54.7%", color: "#F17B9B" },
];
