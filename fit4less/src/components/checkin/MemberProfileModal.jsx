import React from 'react';
import { X, CheckCircle2, Fingerprint, CalendarClock, Wallet, Clock, ScanLine } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

const MemberProfileModal = ({ member, onClose, onConfirmCheckIn, onConfirmCheckOut }) => {
  if (!member) return null;

  const isInside = member.isInside;

  // Match avatar colors to the rest of the system
  const getAvatarColor = (name) => {
    const colors = ["bg-orange-500", "bg-pink-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col animate-fade-in">
        
        {/* Header / Banner */}
        <div className="relative h-24 bg-gradient-to-r from-gold-400 to-gold-500">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-ink-950/10 hover:bg-ink-950/20 rounded-full text-ink-950 transition-colors"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Avatar & Name (Overlapping banner) */}
        <div className="px-6 relative">
          <div className={cn(
            "absolute -top-12 w-24 h-24 rounded-full border-4 border-white flex items-center justify-center text-2xl font-bold shadow-sm text-white",
            getAvatarColor(member.name)
          )}>
            {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
          
          <div className="pt-14 pb-4">
            <h2 className="text-xl font-bold text-ink-950">{member.name}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={cn(
                "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                member.status === 'Active' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-rose-100 text-rose-700'
              )}>
                {member.status}
              </span>
              <span className="flex items-center gap-1 text-xs text-ink-950/50 font-medium">
                <Fingerprint size={12} /> ID: {member.id}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="px-6 py-4 grid grid-cols-2 gap-4 border-t border-ink-950/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-ink-950/40">
              <ScanLine size={16} strokeWidth={2.25} />
            </div>
            <div>
              <p className="text-[10px] text-ink-950/40 font-bold uppercase tracking-wide">Plan</p>
              <p className="text-sm font-semibold text-ink-950">{member.plan}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-ink-950/40">
              <CalendarClock size={16} strokeWidth={2.25} />
            </div>
            <div>
              <p className="text-[10px] text-ink-950/40 font-bold uppercase tracking-wide">Expires</p>
              <p className="text-sm font-semibold text-ink-950">Oct 24, 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-ink-950/40">
              <Clock size={16} strokeWidth={2.25} />
            </div>
            <div>
              <p className="text-[10px] text-ink-950/40 font-bold uppercase tracking-wide">Last Visit</p>
              <p className="text-sm font-semibold text-ink-950">Yesterday, 7:45 AM</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-ink-950/40">
              <Wallet size={16} strokeWidth={2.25} />
            </div>
            <div>
              <p className="text-[10px] text-ink-950/40 font-bold uppercase tracking-wide">Balance</p>
              <p className="text-sm font-semibold text-ink-950">₱0.00</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-2 flex gap-3 bg-surface/50 border-t border-ink-950/5">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          
          {isInside ? (
            <Button 
              variant="secondary" 
              onClick={() => onConfirmCheckOut(member.id)} 
              className="flex-1 gap-2 bg-amber-100 text-amber-700 hover:bg-amber-200"
            >
              <CheckCircle2 size={18} />
              Check Out
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={() => onConfirmCheckIn(member.id)} 
              className="flex-1 gap-2"
            >
              <CheckCircle2 size={18} />
              Confirm Check In
            </Button>
          )}
        </div>

      </div>
    </div>
  );
};

export default MemberProfileModal;