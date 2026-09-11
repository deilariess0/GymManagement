// src/App.jsx
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import PlaceholderPage from "./pages/Settings.jsx";
import Payments from "./pages/Payments.jsx"; 
import Members from "./pages/Members.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";
import CheckIn from "./pages/CheckIn.jsx"; // <--- 1. IMPORT NEW PAGE
import { navigation } from "./data/navigation";

const PLACEHOLDER_COPY = {
  // "/check-in" removed because it is now a functional page
  "/plans-pricing": "Set up gym plans and their pricing tiers.",
  "/settings": "Configure gym profile, branding, and preferences.",
};

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        
        {/* Specific Routes for functional pages */}
        <Route path="/check-in" element={<CheckIn />} /> {/* <--- 2. ADD ROUTE */}
        <Route path="/payments" element={<Payments />} />
        <Route path="/members" element={<Members />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />

        {navigation
          .filter((item) => 
            item.path !== "/" && 
            item.path !== "/check-in" && // <--- 3. ADD TO FILTER
            item.path !== "/payments" && 
            item.path !== "/members" && 
            item.path !== "/reports"
          )
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