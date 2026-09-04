// src/App.jsx
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import PlaceholderPage from "./pages/PlaceholderPage";
import Payments from "./pages/Payments.jsx"; 
import Members from "./pages/Members.jsx";
import Reports from "./pages/Reports.jsx"; // <--- IMPORT NEW PAGE
import { navigation } from "./data/navigation";

const PLACEHOLDER_COPY = {
  "/check-in": "Scan or search a member to log today's visit.",
  "/plans-pricing": "Set up gym plans and their pricing tiers.",
  "/settings": "Configure gym profile, branding, and preferences.",
};

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        
        {/* Specific Routes for functional pages */}
        <Route path="/payments" element={<Payments />} />
        <Route path="/members" element={<Members />} />
        <Route path="/reports" element={<Reports />} /> {/* <--- ADD ROUTE */}

        {navigation
          .filter((item) => item.path !== "/" && item.path !== "/payments" && item.path !== "/members" && item.path !== "/reports")
          .map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={<PlaceholderPage title={item.label} description={PLACEHOLDER_COPY[item.path]} />}
            />
          ))}
      </Route>
    </Routes>
  );
}