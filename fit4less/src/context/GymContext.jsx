// src/context/GymContext.jsx
import { createContext, useState } from "react";
import { GYM_PRICING } from "../data/pricing";

export const GymContext = createContext();

export function GymProvider({ children }) {
  const [transactions, setTransactions] = useState([
    { id: 1, time: "7:45 AM", name: "Juan Dela Cruz", type: "Regular", plan: "Daily", discount: "P 0.00", amount: 80, payment: "Cash", status: "Paid" },
    { id: 2, time: "8:20 AM", name: "Maria Santos", type: "Student", plan: "Monthly", discount: "-P 100.00", amount: 600, payment: "GCash", status: "Paid" },
    { id: 3, time: "9:15 AM", name: "Pedro Cruz", type: "Regular", plan: "Weekly", discount: "P 0.00", amount: 250, payment: "Maya", status: "Paid" },
    { id: 4, time: "10:05 AM", name: "Ana Reyes", type: "Regular", plan: "Daily", discount: "P 0.00", amount: 80, payment: "Cash", status: "Paid" },
    { id: 5, time: "11:30 AM", name: "Liza Ramos", type: "Student", plan: "Daily", discount: "P 0.00", amount: 70, payment: "GCash", status: "Paid" },
    { id: 6, time: "1:15 PM", name: "Marco Silva", type: "Regular", plan: "Daily", discount: "P 0.00", amount: 80, payment: "Maya", status: "Paid" },
    
    // Added 2 More Transactions
    { id: 7, time: "2:00 PM", name: "Jose Rizal", type: "Regular", plan: "Daily", discount: "P 0.00", amount: 80, payment: "Cash", status: "Paid" },
    { id: 8, time: "3:30 PM", name: "Rosa Lim", type: "Student", plan: "Daily", discount: "P 0.00", amount: 70, payment: "GCash", status: "Paid" },
  ]);

  const [members, setMembers] = useState([
    { id: 1, name: "Juan Dela Cruz", plan: "Monthly", type: "Regular", startDate: "2026-08-01", endDate: "2026-08-30", amount: 800, status: "Active" },
    { id: 2, name: "Maria Santos", plan: "3 Months", type: "Student", startDate: "2026-07-15", endDate: "2026-10-13", amount: 1800, status: "Active" },
    { id: 3, name: "Pedro Cruz", plan: "Weekly", type: "Regular", startDate: "2026-08-20", endDate: "2026-08-26", amount: 250, status: "Expiring Soon" },
    { id: 4, name: "Ana Reyes", plan: "Monthly", type: "Regular", startDate: "2026-08-05", endDate: "2026-09-04", amount: 800, status: "Active" },
    { id: 5, name: "Liza Ramos", plan: "3 Months", type: "Student", startDate: "2026-08-10", endDate: "2026-11-09", amount: 1800, status: "Active" },
    { id: 6, name: "Marco Silva", plan: "6 Months", type: "Regular", startDate: "2026-08-01", endDate: "2027-02-01", amount: 3500, status: "Active" },
  ]);

  const calculateEndDate = (plan) => {
    const today = new Date();
    let daysToAdd = 0;
    if (plan === "Daily") daysToAdd = 1;
    else if (plan === "Weekly") daysToAdd = 7;
    else if (plan === "Monthly") daysToAdd = 30;
    else if (plan === "3 Months") daysToAdd = 90;
    else if (plan === "6 Months") daysToAdd = 180;
    
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + daysToAdd);
    return endDate.toISOString().split("T")[0];
  };

  const getPrice = (type, plan) => {
    if (GYM_PRICING[type] && GYM_PRICING[type][plan]) {
      return GYM_PRICING[type][plan];
    }
    return 0;
  };

  const addTransaction = (transactionData) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newTransaction = {
      id: Date.now(),
      time: timeString,
      name: transactionData.name,
      type: transactionData.type,
      plan: transactionData.plan,
      discount: transactionData.discount ? `₱${transactionData.discount}` : "",
      amount: parseFloat(transactionData.amount),
      payment: transactionData.payment,
      status: "Paid",
    };

    setTransactions((prev) => [newTransaction, ...prev]);

    const newMember = {
      id: Date.now() + 1,
      name: transactionData.name,
      plan: transactionData.plan,
      type: transactionData.type,
      startDate: now.toISOString().split("T")[0],
      endDate: calculateEndDate(transactionData.plan),
      amount: parseFloat(transactionData.amount),
      status: "Active",
    };

    setMembers((prev) => [newMember, ...prev]);
  };

  const addMember = (memberData) => {
    const now = new Date();
    const newMember = {
      id: Date.now(),
      name: memberData.name,
      plan: memberData.plan,
      type: memberData.type,
      startDate: now.toISOString().split("T")[0],
      endDate: calculateEndDate(memberData.plan),
      amount: parseFloat(memberData.amount),
      status: "Active",
    };

    setMembers((prev) => [newMember, ...prev]);
  };

  return (
    <GymContext.Provider 
      value={{ 
        transactions, members, 
        addTransaction, addMember, getPrice, calculateEndDate 
      }}
    >
      {children}
    </GymContext.Provider>
  );
}