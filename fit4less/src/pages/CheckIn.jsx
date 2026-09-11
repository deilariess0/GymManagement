import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2, Clock } from 'lucide-react';
import CheckInTabs from '../components/checkin/CheckInTabs';
import MemberSearchList from '../components/checkin/MemberSearchList';
import QRScanner from '../components/checkin/QRScanner';
import MemberProfileModal from '../components/checkin/MemberProfileModal';
import { MOCK_MEMBERS } from '../data/mockData';

const CheckIn = () => {
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('manual');
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [recentLogs, setRecentLogs] = useState([
    { id: 1, name: 'Juan Dela Cruz', time: '7:45 AM', action: 'Checked In' },
  ]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    if (location.state?.openScanner) {
      setActiveTab('scan');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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
      {/* 
        MOBILE FIX:
        - Removed h-full on mobile (kept on desktop)
        - Removed min-h-[500px] on mobile
        - Changed gap-6 to gap-4 on mobile
        - Made the card overflow visible so children can grow
      */}
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6 lg:h-full">
        
        {/* Main Check-in Card */}
        <div className="flex-1 rounded-2xl border border-ink-950/5 bg-white shadow-card lg:flex lg:flex-col lg:min-h-[500px] lg:overflow-hidden">
          
          {/* Header - Hidden on mobile (Topbar already shows it) */}
          <div className="hidden border-b border-ink-950/5 p-6 lg:block">
            <h2 className="text-xl font-bold text-ink-950">Check-in</h2>
            <p className="mt-1 text-sm text-ink-950/50">Scan or search a member to log today's visit.</p>
          </div>

          <CheckInTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Content Area */}
          <div className="flex-1 lg:overflow-hidden">
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

        {/* Recent Activity Sidebar */}
        <div className="w-full rounded-2xl border border-ink-950/5 bg-white shadow-card lg:flex lg:w-80 lg:flex-col">
          <div className="flex items-center gap-2 border-b border-ink-950/5 p-5">
            <Clock size={18} className="text-ink-950/40" />
            <h3 className="text-sm font-bold text-ink-950">Recent Activity</h3>
          </div>
          <ul className="flex-1 overflow-y-auto p-2">
            {recentLogs.map((log) => (
              <li key={log.id} className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-gold-500/5">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${log.action === 'Checked In' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  <CheckCircle2 size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-950">{log.name}</p>
                  <p className="text-[10px] text-ink-950/40">{log.time}</p>
                </div>
                <span className="rounded-md bg-ink-950/5 px-2 py-1 text-[10px] font-bold text-ink-950/50">
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