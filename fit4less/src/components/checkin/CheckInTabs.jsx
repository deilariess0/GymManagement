import React from 'react';
import { User, QrCode } from 'lucide-react';

const CheckInTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'manual', label: 'Manual Search', icon: User },
    { id: 'scan', label: 'Scan QR', icon: QrCode },
  ];

  return (
    <div className="flex gap-2 p-4 pb-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 min-h-[42px] px-4 rounded-xl text-xs font-bold transition-all ${
              isActive 
                ? 'bg-amber-400 text-gray-900 shadow-sm' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default CheckInTabs;