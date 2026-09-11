// src/pages/Members.jsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGym } from "../context/useGym";
import { Plus, Search, UserX, Eye, X, Pencil, Filter, Download, Trash2, CheckSquare, ChevronLeft, ChevronRight, CalendarClock, RefreshCw, Dumbbell, Fingerprint } from "lucide-react";
import { cn } from "../utils/cn";
import { getAllMembers, saveMembers } from "../utils/memberStorage";

const MEMBERSHIP_PLANS = ["Weekly", "Monthly", "3 Months", "6 Months"];
const ITEMS_PER_PAGE = 5;

export default function Members() {
  const navigate = useNavigate();
  const { transactions, getPrice } = useGym();

  const [members, setMembers] = useState(() => getAllMembers());

  useEffect(() => {
    setMembers(getAllMembers());
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({ name: "", type: "Regular", plan: "Monthly", amount: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const nextData = { ...prev, [name]: value };
      if (name === "type" || name === "plan") {
        nextData.amount = getPrice(nextData.type, nextData.plan).toString();
      }
      return nextData;
    });
  };

  const resetForm = () => {
    setFormData({ name: "", type: "Regular", plan: "Monthly", amount: "" });
    setIsModalOpen(false);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setFormData({ name: member.name, type: member.type, plan: member.plan, amount: (member.amount || 0).toString() });
  };

  const handleUpdateMember = (e) => {
    e.preventDefault();
    if (!formData.name) return alert("Please enter a member name");

    const updated = members.map((m) =>
      m.id === editingMember.id ? { ...m, ...formData, amount: Number(formData.amount) || 0 } : m
    );
    setMembers(updated);
    saveMembers(updated);

    setEditingMember(null);
    resetForm();
  };

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
      const isMembership = MEMBERSHIP_PLANS.includes(member.plan);
      const matchesFilter = planFilter === "All" ? true : member.plan === planFilter;
      return matchesSearch && isMembership && matchesFilter;
    });
  }, [members, searchTerm, planFilter]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMembers, currentPage]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSelectAll = () => {
    setSelectedIds(selectedIds.length === paginatedMembers.length ? [] : paginatedMembers.map(m => m.id));
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(selId => selId !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Delete ${selectedIds.length} member(s)?`)) {
      const updated = members.filter((m) => !selectedIds.includes(m.id));
      setMembers(updated);
      saveMembers(updated);
      setSelectedIds([]);
    }
  };

  const handleBulkExport = () => alert(`Exporting ${selectedIds.length} member(s)`);

  const getInitials = (name) => name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  const getAvatarColor = (name) => {
    const colors = ["bg-orange-500", "bg-pink-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active": return "bg-emerald-100 text-emerald-700";
      case "Expiring Soon": return "bg-amber-100 text-amber-700";
      case "Expired": return "bg-rose-100 text-rose-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getMemberId = (id) => id;

  const closeProfile = () => setSelectedMember(null);
  const memberTransactions = selectedMember ? transactions.filter((txn) => txn.name === selectedMember.name) : [];

  const PaginationBar = () => (
    <div className="mt-4 flex items-center justify-between border-t border-ink-950/5 pt-4">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-950/60 transition-colors hover:bg-ink-950/5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={14} /> Previous
      </button>
      <span className="text-xs font-semibold text-ink-950/50">
        Page {currentPage} of {totalPages || 1}
      </span>
      <button
        type="button"
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={() => handlePageChange(currentPage + 1)}
        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-950/60 transition-colors hover:bg-ink-950/5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next <ChevronRight size={14} />
      </button>
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header & Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-ink-950 md:text-2xl">Members</h1>
          <p className="text-xs text-ink-950/45 md:text-sm">Manage active gym members.</p>
        </div>
        <button 
          onClick={() => navigate("/members/register")}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-bold text-ink-950 transition-colors hover:bg-gold-600 sm:w-auto"
        >
          <Plus size={18} strokeWidth={3} /> Add Member
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex flex-1 items-center">
          <Search className="absolute left-3 text-ink-950/30" size={18} strokeWidth={2.25} />
          <input 
            type="text" 
            placeholder="Search members..." 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
            className="w-full min-h-[48px] pl-10 pr-4 border border-ink-950/10 rounded-xl bg-surface text-sm text-ink-950 outline-none focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/15 transition-all placeholder:text-ink-950/30"
          />
        </div>
        <div className="relative md:w-auto">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-950/40" />
          <select 
            value={planFilter} 
            onChange={(e) => { setPlanFilter(e.target.value); setCurrentPage(1); }} 
            className="w-full appearance-none min-h-[48px] rounded-xl border border-ink-950/10 bg-surface py-2.5 pl-9 pr-8 text-sm font-semibold text-ink-950 shadow-sm outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/15 transition-all md:w-auto"
          >
            <option value="All">All Plans</option>
            {MEMBERSHIP_PLANS.map(plan => <option key={plan} value={plan}>{plan}</option>)}
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl bg-white shadow-card md:block">
        <table className="w-full text-left">
          <thead className="border-b border-ink-950/5 text-xs font-bold uppercase tracking-wide text-ink-950/35">
            <tr>
              <th className="p-4"><input type="checkbox" checked={selectedIds.length === paginatedMembers.length && paginatedMembers.length > 0} onChange={handleSelectAll} className="h-4 w-4 rounded border-ink-950/20 text-gold-500 focus:ring-gold-500" /></th>
              <th className="p-4">Member Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Plan</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-950/5">
            {paginatedMembers.map((member) => {
              const displayAmount = member.amount > 0 ? member.amount : getPrice(member.type, member.plan);
              return (
                <tr key={member.id} className={cn("hover:bg-gold-500/5 transition-colors", selectedIds.includes(member.id) && "bg-gold-500/5")}>
                  <td className="p-4"><input type="checkbox" checked={selectedIds.includes(member.id)} onChange={() => handleSelectOne(member.id)} className="h-4 w-4 rounded border-ink-950/20 text-gold-500 focus:ring-gold-500" /></td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full ${getAvatarColor(member.name)} text-xs font-bold text-white shrink-0`}>{getInitials(member.name)}</div>
                      <span className="font-semibold text-ink-950">{member.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", member.type === "Student" ? "bg-pink-100 text-pink-700" : "bg-orange-100 text-orange-700")}>{member.type}</span>
                  </td>
                  <td className="p-4 text-sm font-medium text-ink-950/70">{member.plan}</td>
                  <td className="p-4 text-xs text-ink-950/60">{member.startDate} to {member.endDate}</td>
                  <td className="p-4 font-bold text-ink-950">₱{displayAmount.toFixed(2)}</td>
                  <td className="p-4"><span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", getStatusStyle(member.status))}>{member.status}</span></td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedMember(member)} className="flex items-center gap-1 rounded-lg bg-sky-100 px-2.5 py-1.5 text-xs font-bold text-sky-700 hover:bg-sky-200 transition-colors"><Eye size={14} /> View</button>
                      <button onClick={() => openEditModal(member)} className="flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-200 transition-colors"><Pencil size={14} /> Edit</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {paginatedMembers.length === 0 && (
              <tr><td colSpan="8" className="p-10 text-center text-ink-950/40"><UserX className="mx-auto mb-2" size={30} /> No members found.</td></tr>
            )}
          </tbody>
        </table>
        <div className="px-4 pb-4">
          <PaginationBar />
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {paginatedMembers.length > 0 ? (
          paginatedMembers.map((member) => {
            const displayAmount = member.amount > 0 ? member.amount : getPrice(member.type, member.plan);
            return (
              <div key={member.id} className={cn("rounded-2xl bg-white p-4 shadow-card border border-ink-950/5", selectedIds.includes(member.id) && "border-2 border-gold-500")}>
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getAvatarColor(member.name)} text-xs font-bold text-white shrink-0`}>
                    {getInitials(member.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-ink-950 truncate">{member.name}</h4>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold shrink-0", getStatusStyle(member.status))}>
                        {member.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[10px] font-medium text-ink-950/50">
                      <span>{getMemberId(member.id)}</span>
                      <span>•</span>
                      <span className={cn("rounded px-1.5 py-0.5 font-bold", member.type === "Student" ? "bg-pink-100 text-pink-700" : "bg-orange-100 text-orange-700")}>{member.type}</span>
                      <span>•</span>
                      <span>{member.plan}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><CalendarClock size={10} /> exp {member.endDate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => setSelectedMember(member)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-sky-100 px-3 py-2.5 text-xs font-bold text-sky-700 hover:bg-sky-200 transition-colors">
                    <Eye size={14} strokeWidth={2.5} /> View
                  </button>
                  <button onClick={() => openEditModal(member)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink-950/10 text-ink-950/60 hover:bg-gray-50 transition-colors">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleSelectOne(member.id)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl bg-white p-10 text-center text-ink-950/40 shadow-card"><UserX className="mx-auto mb-2" size={30} /> No members found.</div>
        )}
        
        <div className="rounded-2xl bg-white p-4 shadow-card">
          <PaginationBar />
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-2xl bg-ink-950 p-4 text-white shadow-2xl">
          <div className="flex items-center gap-2"><CheckSquare size={18} className="text-gold-500" /><span className="text-sm font-bold">{selectedIds.length} Selected</span></div>
          <div className="flex gap-2">
            <button onClick={handleBulkExport} className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20 transition-colors"><Download size={14} /> Export</button>
            <button onClick={handleBulkDelete} className="flex items-center gap-1 rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/30 transition-colors"><Trash2 size={14} /> Delete</button>
            <button onClick={() => setSelectedIds([])} className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20 transition-colors"><X size={14} /> Clear</button>
          </div>
        </div>
      )}

      {/* 
        ============================================================
        MEMBER PROFILE MODAL (Landscape ID Card - MOBILE OPTIMIZED)
        ============================================================
      */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4 animate-fade-in">
          <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl animate-slide-up sm:animate-fade-in">
            
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-950/5 bg-white p-5">
              <div>
                <h3 className="text-base font-bold text-ink-950">Member Profile</h3>
                <p className="text-[11px] text-ink-950/45">Landscape ID card preview</p>
              </div>
              <button 
                onClick={closeProfile} 
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-950/50 transition-colors hover:bg-gray-100 hover:text-ink-950"
              >
                <X size={20} />
              </button>
            </div>

            {/* Landscape ID Card */}
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

                {/* 
                  Card Body
                  - MOBILE: Stacked (info top, QR bottom)
                  - DESKTOP: Side-by-side (info left, QR right)
                */}
                <div className="flex flex-col gap-5 bg-white p-5 sm:flex-row sm:items-center sm:gap-6">
                  
                  {/* LEFT/TOP: Member Info */}
                  <div className="flex flex-1 items-center gap-4">
                    <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${getAvatarColor(selectedMember.name)} text-lg font-extrabold text-white`}>
                      {getInitials(selectedMember.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-lg font-extrabold text-ink-950">
                        {selectedMember.name}
                      </h2>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs font-bold text-ink-950/50">
                        <Fingerprint size={12} />
                        {selectedMember.id}
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wide text-ink-950/35">Type</p>
                          <p className="text-xs font-bold text-ink-950">{selectedMember.type}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wide text-ink-950/35">Plan</p>
                          <p className="text-xs font-bold text-ink-950">{selectedMember.plan}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wide text-ink-950/35">Start Date</p>
                          <p className="text-xs font-bold text-ink-950">{selectedMember.startDate}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wide text-ink-950/35">Expires</p>
                          <p className="text-xs font-bold text-ink-950">{selectedMember.endDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider - only on desktop */}
                  <div className="hidden h-32 w-px bg-ink-950/10 sm:block" />

                  {/* RIGHT/BOTTOM: QR Code */}
                  {selectedMember.qrValue && (
                    <div className="flex shrink-0 flex-col items-center justify-center gap-2 border-t border-dashed border-ink-950/10 pt-5 sm:border-0 sm:pt-0">
                      <div className="rounded-xl bg-white p-2 ring-1 ring-ink-950/5">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${selectedMember.qrValue}`}
                          alt={`QR Code for ${selectedMember.name}`}
                          className="h-[140px] w-[140px] sm:h-[120px] sm:w-[120px]"
                        />
                      </div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-ink-950/40">
                        Scan to Check In
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="border-t border-ink-950/5 bg-surface px-5 py-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-bold uppercase tracking-wide text-ink-950/35">
                      Fit4Less Gym Management
                    </p>
                    <div className={cn(
                      "flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide",
                      selectedMember.status === "Active" ? "text-emerald-600" : "text-amber-600"
                    )}>
                      <div className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        selectedMember.status === "Active" ? "bg-emerald-500" : "bg-amber-500"
                      )} />
                      {selectedMember.status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="mt-5">
                <h4 className="mb-2 text-sm font-bold text-ink-950">Recent Transactions</h4>
                <div className="max-h-40 overflow-y-auto rounded-xl border border-ink-950/10">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-surface text-[10px] font-bold uppercase tracking-wide text-ink-950/45">
                      <tr>
                        <th className="p-2.5">Time</th>
                        <th className="p-2.5">Plan</th>
                        <th className="p-2.5">Amount</th>
                        <th className="p-2.5">Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memberTransactions.length > 0 ? memberTransactions.map((txn) => (
                        <tr key={txn.id} className="border-b border-ink-950/5 last:border-0">
                          <td className="p-2.5 text-ink-950/70">{txn.time}</td>
                          <td className="p-2.5 text-ink-950/70">{txn.plan}</td>
                          <td className="p-2.5 font-semibold text-ink-950">₱{txn.amount}</td>
                          <td className="p-2.5 text-ink-950/70">{txn.payment}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan="4" className="p-4 text-center text-ink-950/40">No transactions yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-5 flex justify-end">
                <button 
                  onClick={closeProfile} 
                  className="rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-bold text-ink-950/60 transition-colors hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/60 backdrop-blur-sm sm:items-center animate-fade-in">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6 animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink-950">Edit Member</h3>
              <button onClick={() => { setEditingMember(null); resetForm(); }} className="rounded-full p-1 text-ink-950/50 hover:bg-gray-100 hover:text-ink-950 transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleUpdateMember} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-ink-950/70">Member Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-ink-950/10 px-3 py-2.5 text-sm focus:border-gold-500 focus:ring-4 focus:ring-gold-500/15 focus:outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-ink-950/70">Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full rounded-lg border border-ink-950/10 px-3 py-2.5 text-sm focus:border-gold-500 focus:ring-4 focus:ring-gold-500/15 focus:outline-none transition-all">
                    <option value="Regular">Regular</option>
                    <option value="Student">Student</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-ink-950/70">Plan</label>
                  <select name="plan" value={formData.plan} onChange={handleChange} className="w-full rounded-lg border border-ink-950/10 px-3 py-2.5 text-sm focus:border-gold-500 focus:ring-4 focus:ring-gold-500/15 focus:outline-none transition-all">
                    {MEMBERSHIP_PLANS.map((plan) => <option key={plan} value={plan}>{plan}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-ink-950/70">Amount</label>
                <input type="number" name="amount" value={formData.amount} readOnly className="w-full rounded-lg border border-ink-950/10 bg-surface px-3 py-2.5 text-sm font-bold text-ink-950 focus:outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-ink-950/5">
                <button type="button" onClick={() => { setEditingMember(null); resetForm(); }} className="rounded-lg px-4 py-2 text-sm font-bold text-ink-950/60 hover:bg-gray-100 transition-colors">Cancel</button>
                <button type="submit" className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-bold text-ink-950 hover:bg-gold-600 transition-colors">Update Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}