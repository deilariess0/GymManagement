import React from 'react';
import { Search, CheckCircle2, AlertCircle, Dumbbell } from 'lucide-react';
import { cn } from '../../utils/cn';

// Matching the exact tones used in your Dashboard TransactionsTable
const PLAN_TONE = {
  Regular: "bg-orange-100 text-orange-600",
  Student: "bg-pink-100 text-pink-600",
  Weekly: "bg-orange-100 text-orange-600",
  Monthly: "bg-blue-100 text-blue-600",
  Daily: "bg-teal-100 text-teal-600",
};

// Replicating the avatar color logic from your TransactionsTable
const getAvatarColor = (name) => {
  const colors = [
    "bg-orange-500", 
    "bg-pink-500", 
    "bg-blue-500", 
    "bg-green-500", 
    "bg-purple-500", 
    "bg-yellow-500"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const MemberSearchList = ({ 
  searchQuery, 
  setSearchQuery, 
  members, 
  onCheckIn, 
  onCheckOut 
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Search Bar - Matched to system styling */}
      <div className="relative p-4 pb-0">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-ink-950/30" size={18} strokeWidth={2.25} />
        <input
          type="text"
          placeholder="Search member by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full min-h-[48px] pl-11 pr-4 border border-ink-950/10 rounded-xl bg-surface text-sm text-ink-950 outline-none focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/15 transition-all placeholder:text-ink-950/30"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        <p className="text-[10px] font-bold tracking-widest uppercase text-ink-950/40 mb-1">
          Results
        </p>
        
        {members.length === 0 ? (
          <p className="text-sm text-ink-950/40 text-center py-8">No members found.</p>
        ) : (
          members.map((member) => (
            <div 
              key={member.id} 
              className="flex items-center gap-3 p-3 border border-ink-950/5 rounded-2xl hover:bg-gold-500/5 transition-colors"
            >
              {/* 
                Avatar - Now matches the Dashboard Top Members style.
                Uses dynamic color and white text for the initials.
              */}
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 text-white shadow-sm",
                getAvatarColor(member.name)
              )}>
                {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              
              {/* Member Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-ink-950 truncate">{member.name}</h4>
                
                {/* Badges Row - Matches Dashboard Tones */}
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  
                  {/* Plan Badge - Now uses the vibrant colors from your dashboard */}
                  <span className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide",
                    PLAN_TONE[member.plan] || "bg-gray-100 text-gray-600"
                  )}>
                    <Dumbbell size={10} strokeWidth={2.5} />
                    {member.plan}
                  </span>
                  
                  {/* Status Badge - Matches your system */}
                  <span className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide",
                    member.status === 'Active' 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-rose-100 text-rose-700"
                  )}>
                    {member.status === 'Active' 
                      ? <CheckCircle2 size={10} strokeWidth={3} /> 
                      : <AlertCircle size={10} strokeWidth={3} />
                    }
                    {member.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {member.isInside ? (
                <button 
                  onClick={() => onCheckOut(member.id)} 
                  className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold hover:bg-emerald-200 transition-colors shrink-0"
                >
                  <CheckCircle2 size={14} strokeWidth={2.5} /> Inside
                </button>
              ) : (
                <button 
                  onClick={() => onCheckIn(member.id)} 
                  className="inline-flex items-center justify-center px-4 h-9 rounded-lg bg-gold-500 text-ink-950 text-xs font-bold hover:bg-gold-600 transition-colors shrink-0"
                >
                  Check In
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemberSearchList;