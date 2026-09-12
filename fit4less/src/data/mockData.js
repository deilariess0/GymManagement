// src/data/mockData.js

/**
 * Prototype members for testing the QR check-in flow.
 * Each member covers a different type/plan combo for testing.
 * All required fields (id, qrValue, dates, etc.) are included
 * so the QR scanner, ID card, and modal work correctly.
 */
export const MOCK_MEMBERS = [
  {
    id: "M-0001",
    name: "Juan Dela Cruz",
    type: "Regular",
    plan: "Monthly",
    contact: "0912 345 6789",
    startDate: "2026-09-01",
    endDate: "2026-10-01",
    status: "Active",
    isInside: false,
    amount: 800,
    qrValue: "M-0001",
  },
  {
    id: "M-0002",
    name: "Maria Santos",
    type: "Student",
    plan: "3 Months",
    contact: "0917 234 5678",
    startDate: "2026-09-01",
    endDate: "2026-11-30",
    status: "Active",
    isInside: false,
    amount: 1800,
    qrValue: "M-0002",
  },
  {
    id: "M-0003",
    name: "Pedro Cruz",
    type: "Regular",
    plan: "6 Months",
    contact: "0918 345 6789",
    startDate: "2026-09-01",
    endDate: "2027-03-01",
    status: "Active",
    isInside: false,
    amount: 3999,
    qrValue: "M-0003",
  },
];