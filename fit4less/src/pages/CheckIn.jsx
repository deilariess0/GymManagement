import React, { useState, useEffect } from 'react'; // 1. Added useEffect
import { useLocation } from 'react-router-dom';    // 2. Added useLocation
import { CheckCircle2, Clock } from 'lucide-react';
import CheckInTabs from '../components/checkin/CheckInTabs';
import MemberSearchList from '../components/checkin/MemberSearchList';
import QRScanner from '../components/checkin/QRScanner';
import MemberProfileModal from '../components/checkin/MemberProfileModal';
import { MOCK_MEMBERS } from '../data/mockData';

const CheckIn = () => {
  const location = useLocation(); // 3. Initialize location hook
  
  const [activeTab, setActiveTab] = useState('manual');
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [recentLogs, setRecentLogs] = useState([
    { id: 1, name: 'Juan Dela Cruz', time: '7:45 AM', action: 'Checked In' },
  ]);
  const [selectedMember, setSelectedMember] = useState(null);

  // 4. ADD THIS EFFECT: Check if we were sent here to open the scanner
  useEffect(() => {
    if (location.state?.openScanner) {
      setActiveTab('scan');
      // Optional: Clear the state so if they refresh the page, it doesn't stay on scanner
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // ... (Keep all your existing handleCheckIn, handleCheckOut, handleScanSuccess, handleModalConfirm, filteredMembers functions exactly as they are) ...

  const handleCheckIn = (id) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, isInside: true } : m));
    const member = members.find(m => m.id === id);
    if (member) {
      setRecentLogs(prev => [
        { id: Date.now(), name: member.name, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), action: 'Checked In' },
        ...prev
      ]);
    }
  };

  const handleCheckOut = (id) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, isInside: false } : m));
    const member = members.find(m => m.id === id);
    if (member) {
      setRecentLogs(prev => [
        { id: Date.now(), name: member.name, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), action: 'Checked Out' },
        ...prev
      ]);
    }
  };

  const handleScanSuccess = (decodedText) => {
    const memberId = parseInt(decodedText.replace(/\D/g, '')); 
    const member = members.find(m => m.id === memberId);
    if (member) {
      setSelectedMember(member);
    } else {
      alert(`Member not found for QR code: ${decodedText}`);
    }
  };

  const handleModalConfirm = (id) => {
    if (selectedMember.isInside) {
      handleCheckOut(id);
    } else {
      handleCheckIn(id);
    }
    setSelectedMember(null);
    setActiveTab('manual');
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.id.toString().includes(searchQuery)
  );

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Main Check-in Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden min-h-[500px]">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Check-in</h2>
            <p className="text-sm text-gray-500 mt-1">Scan or search a member to log today's visit.</p>
          </div>

          <CheckInTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="flex-1 overflow-hidden">
            {activeTab === 'manual' ? (
              <MemberSearchList 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                members={filteredMembers}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
              />
            ) : (
              <QRScanner 
                onScanSuccess={handleScanSuccess} 
                onScanFailure={(err) => { /* Silently handle */ }} 
              />
            )}
          </div>
        </div>

        {/* Right Sidebar: Recent Activity */}
        <div className="w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-center gap-2">
            <Clock size={18} className="text-gray-400" />
            <h3 className="font-bold text-gray-900 text-sm">Recent Activity</h3>
          </div>
          <ul className="flex-1 overflow-y-auto p-2">
            {recentLogs.map((log) => (
              <li key={log.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${log.action === 'Checked In' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  <CheckCircle2 size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{log.name}</p>
                  <p className="text-[10px] text-gray-400">{log.time}</p>
                </div>
                <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  {log.action}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <MemberProfileModal 
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onConfirmCheckIn={handleModalConfirm}
        onConfirmCheckOut={handleModalConfirm}
      />
    </>
  );
};

export default CheckIn;