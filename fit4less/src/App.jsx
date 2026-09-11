// src/App.jsx
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payments.jsx"; 
import Members from "./pages/Members.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";
import CheckIn from "./pages/CheckIn.jsx";
import RegisterMember from "./pages/RegisterMember.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/check-in" element={<CheckIn />} />
        <Route path="/members" element={<Members />} />
        <Route path="/members/register" element={<RegisterMember />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}