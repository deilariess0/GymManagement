// src/data/mockData.js

/**
 * Single prototype member for testing the QR check-in flow.
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
];