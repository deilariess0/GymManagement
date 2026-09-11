// src/pages/Settings.jsx
import { useState } from "react";
import { Save, MapPin, Phone, Clock, PhilippinePeso, Trash2 } from "lucide-react";
import { cn } from "../utils/cn";
import { resetMemberStorage } from "../utils/memberStorage"; // <--- NEW

export default function Settings() {
  // Form State
  const [formData, setFormData] = useState({
    gymName: "FIT4LESS Gym",
    address: "San Jose Del Monte City, Bulacan, Philippines",
    contact: "0912 345 6789",
    hours: "7:00 AM - 9:00 PM",
    dailyRegular: "80",
    dailyStudent: "70",
    weekly: "250",
    monthly: "600",
  });

  // Toggle States
  const [preferences, setPreferences] = useState({
    expiringAlerts: true,
    autoCheckout: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings saved successfully!");
  };

  // UPDATED: Now actually resets localStorage and reloads
  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all prototype data? This cannot be undone.")) {
      resetMemberStorage();
      alert("Demo data has been reset. The page will reload now.");
      window.location.reload();
    }
  };

  // Shared Input Class
  const inputClass = "w-full min-h-[48px] rounded-xl border border-ink-950/10 bg-surface px-4 py-3 text-sm text-ink-950 outline-none transition-all focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/15 placeholder:text-ink-950/30";
  
  // Shared Card Class
  const cardClass = "rounded-2xl bg-white p-5 shadow-card";
  
  // Shared Label Class
  const labelClass = "mb-1.5 block text-xs font-bold text-ink-950/70";

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-ink-950 md:text-2xl">Settings</h1>
          <p className="text-xs text-ink-950/45 md:text-sm">Configure your gym system</p>
        </div>
        <button
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-ink-950 shadow-sm transition-colors hover:bg-gold-600 sm:w-auto"
        >
          <Save size={16} strokeWidth={2.5} /> Save
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Gym Information */}
          <div className={cardClass}>
            <h2 className="text-sm font-bold tracking-wide text-ink-950">GYM INFORMATION</h2>
            
            <div className="mt-4 space-y-4">
              <div>
                <label className={labelClass}>Gym Name</label>
                <input type="text" name="gymName" value={formData.gymName} onChange={handleChange} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-950/30" size={16} />
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className={cn(inputClass, "pl-10")} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Contact Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-950/30" size={16} />
                    <input type="text" name="contact" value={formData.contact} onChange={handleChange} className={cn(inputClass, "pl-10")} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Operating Hours</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-950/30" size={16} />
                    <input type="text" name="hours" value={formData.hours} onChange={handleChange} className={cn(inputClass, "pl-10")} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Membership Rates */}
          <div className={cardClass}>
            <h2 className="text-sm font-bold tracking-wide text-ink-950">MEMBERSHIP RATES (₱)</h2>
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Daily — Regular</label>
                <div className="relative">
                  <PhilippinePeso className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-950/30" size={16} />
                  <input type="number" name="dailyRegular" value={formData.dailyRegular} onChange={handleChange} className={cn(inputClass, "pl-10")} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Daily — Student</label>
                <div className="relative">
                  <PhilippinePeso className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-950/30" size={16} />
                  <input type="number" name="dailyStudent" value={formData.dailyStudent} onChange={handleChange} className={cn(inputClass, "pl-10")} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Weekly</label>
                <div className="relative">
                  <PhilippinePeso className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-950/30" size={16} />
                  <input type="number" name="weekly" value={formData.weekly} onChange={handleChange} className={cn(inputClass, "pl-10")} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Monthly</label>
                <div className="relative">
                  <PhilippinePeso className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-950/30" size={16} />
                  <input type="number" name="monthly" value={formData.monthly} onChange={handleChange} className={cn(inputClass, "pl-10")} />
                </div>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-ink-950/40">Changes apply to all new payments.</p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">
          
          {/* Preferences */}
          <div className={cardClass}>
            <h2 className="text-sm font-bold tracking-wide text-ink-950">PREFERENCES</h2>
            
            <div className="mt-4 space-y-5">
              <div>
                <label className={labelClass}>Expiry alert (days before)</label>
                <input type="number" defaultValue="7" className={inputClass} />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-ink-950">Expiring notifications</p>
                  <p className="text-[10px] text-ink-950/45 mt-0.5">Alerts on dashboard</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle("expiringAlerts")}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    preferences.expiringAlerts ? "bg-gold-500" : "bg-gray-200"
                  )}
                >
                  <span className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    preferences.expiringAlerts ? "translate-x-5" : "translate-x-0"
                  )} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-ink-950">Auto check-out at closing</p>
                  <p className="text-[10px] text-ink-950/45 mt-0.5">Everyone out at 9:00 PM</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle("autoCheckout")}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    preferences.autoCheckout ? "bg-gold-500" : "bg-gray-200"
                  )}
                >
                  <span className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    preferences.autoCheckout ? "translate-x-5" : "translate-x-0"
                  )} />
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className={cn(cardClass, "border border-rose-100")}>
            <h2 className="text-sm font-bold tracking-wide text-rose-500">DANGER ZONE</h2>
            <p className="mt-2 text-[11px] text-ink-950/45 leading-relaxed">
              Clears all registered members and restores the original demo data.
            </p>
            <button
              onClick={handleResetData}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-100"
            >
              <Trash2 size={16} strokeWidth={2.5} /> Reset Demo Data
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}