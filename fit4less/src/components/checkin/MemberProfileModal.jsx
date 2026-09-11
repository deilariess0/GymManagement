// src/components/checkin/MemberProfileModal.jsx
import React from 'react';
import { X, CheckCircle2, Fingerprint, Dumbbell, RotateCcw, ArrowRight } from 'lucide-react';
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

  const getInitials = (name) => 
    name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4 animate-fade-in">
      <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl animate-slide-up sm:animate-fade-in">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-ink-950/5 p-5">
          <div>
            <h3 className="text-base font-bold text-ink-950">
              {isInside ? "Member Check-Out" : "Member Check-In"}
            </h3>
            <p className="text-[11px] text-ink-950/45">Scan verified — confirm the action below</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-950/50 transition-colors hover:bg-gray-100 hover:text-ink-950"
          >
            <X size={20} />
          </button>
        </div>

        {/* Landscape ID Card Preview */}
        <div className="p-5">
          <div className="overflow-hidden rounded-2xl border border-ink-950/10 shadow-sm">

            {/* Card Header */}
            <div className="flex items-center justify-between bg-ink-950 px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gold-500">
                  <Dumbbell size={12} className="text-ink-950" strokeWidth={3} />
                </div>
                <p className="text-xs font-extrabold tracking-wider text-white">
                  FIT<span className="text-gold-500">4</span>LESS
                </p>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                Member ID
              </p>
            </div>

            {/* Card Body */}
            <div className="flex flex-col gap-5 bg-white p-5 sm:flex-row sm:items-center sm:gap-6">

              {/* LEFT: Member Info */}
              <div className="flex flex-1 items-center gap-4">
                <div className={cn(
                  "flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-lg font-extrabold text-white",
                  getAvatarColor(member.name)
                )}>
                  {getInitials(member.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-extrabold text-ink-950">
                    {member.name}
                  </h2>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs font-bold text-ink-950/50">
                    <Fingerprint size={12} />
                    {member.id}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wide text-ink-950/35">Type</p>
                      <p className="text-xs font-bold text-ink-950">{member.type}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wide text-ink-950/35">Plan</p>
                      <p className="text-xs font-bold text-ink-950">{member.plan}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wide text-ink-950/35">Start Date</p>
                      <p className="text-xs font-bold text-ink-950">{member.startDate || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wide text-ink-950/35">Expires</p>
                      <p className="text-xs font-bold text-ink-950">{member.endDate || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden h-32 w-px bg-ink-950/10 sm:block" />

              {/* RIGHT: QR Code */}
              <div className="flex shrink-0 flex-col items-center justify-center gap-2 border-t border-dashed border-ink-950/10 pt-5 sm:border-0 sm:pt-0">
                <div className="rounded-xl bg-white p-2 ring-1 ring-ink-950/5">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${member.qrValue || member.id}`}
                    alt={`QR Code for ${member.name}`}
                    className="h-[140px] w-[140px] sm:h-[120px] sm:w-[120px]"
                  />
                </div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-ink-950/40">
                  Scan to Check In
                </p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="border-t border-ink-950/5 bg-surface px-5 py-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold uppercase tracking-wide text-ink-950/35">
                  Fit4Less Gym Management
                </p>
                <div className={cn(
                  "flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide",
                  member.status === "Active" ? "text-emerald-600" : "text-amber-600"
                )}>
                  <div className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    member.status === "Active" ? "bg-emerald-500" : "bg-amber-500"
                  )} />
                  {member.status}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>

            {isInside ? (
              <Button
                variant="secondary"
                onClick={() => onConfirmCheckOut(member.id)}
                className="flex-1 gap-2 bg-amber-100 text-amber-700 hover:bg-amber-200"
              >
                <RotateCcw size={16} />
                Confirm Check-Out
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => onConfirmCheckIn(member.id)}
                className="flex-1 gap-2 bg-emerald-500 text-white hover:bg-emerald-600"
              >
                <CheckCircle2 size={16} />
                Confirm Check-In
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfileModal;