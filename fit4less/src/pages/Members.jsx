// src/pages/Members.jsx
import { useMemo, useState } from "react";
import { useGym } from "../context/useGym";
import { Plus, Search, UserX, Eye, X, Pencil, Filter, Download, Trash2, CheckSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../utils/cn";

const MEMBERSHIP_PLANS = ["Weekly", "Monthly", "3 Months", "6 Months"];
const ITEMS_PER_PAGE = 5;

export default function Members() {
  const { members, transactions, addMember, updateMember, getPrice } = useGym();

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

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!formData.name) return alert("Please enter a member name");
    addMember(formData);
    resetForm();
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setFormData({ name: member.name, type: member.type, plan: member.plan, amount: member.amount.toString() });
  };

  const handleUpdateMember = (e) => {
    e.preventDefault();
    if (!formData.name) return alert("Please enter a member name");
    updateMember(editingMember.id, formData);
    setEditingMember(null);
    resetForm();
  };

  // Filtering and Pagination Logic
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Bulk Selection Handlers
  const handleSelectAll = () => {
    setSelectedIds(selectedIds.length === paginatedMembers.length ? [] : paginatedMembers.map(m => m.id));
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(selId => selId !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Delete ${selectedIds.length} member(s)?`)) {
      setSelectedIds([]);
    }
  };

  const handleBulkExport = () => alert(`Exporting ${selectedIds.length} member(s)`);

  // UI Helpers
  const getInitials = (name) => name.split(" ").map(n => n[0]).join("").toUpperCase();
  const getAvatarColor = (name) => {
    const colors = ["bg-orange-500", "bg-pink-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-600";
      case "Expiring Soon": return "bg-yellow-100 text-yellow-600";
      case "Expired": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const closeProfile = () => setSelectedMember(null);
  const memberTransactions = selectedMember ? transactions.filter((txn) => txn.name === selectedMember.name) : [];

  // Shared Pagination UI (Matches Dashboard/Payments)
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
    <div className="p-4 md:p-6">
      {/* Header & Button */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-ink-950 md:text-2xl">Members</h1>
          <p className="text-xs text-ink-950/45 md:text-sm">Manage active gym members.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-gold-600 sm:w-auto">
          <Plus size={18} strokeWidth={3} /> Add Member
        </button>
      </div>

      {/* Search & Filter (Stack on Mobile) */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-ink-950/10 bg-white px-3 py-2.5 shadow-sm">
          <Search size={18} className="text-ink-950/35" />
          <input type="text" placeholder="Search members..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full flex-1 bg-transparent text-sm outline-none" />
        </div>
        <div className="relative md:w-auto">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-950/40" />
          <select value={planFilter} onChange={(e) => { setPlanFilter(e.target.value); setCurrentPage(1); }} className="w-full appearance-none rounded-xl border border-ink-950/10 bg-white py-2.5 pl-9 pr-8 text-sm font-semibold shadow-sm outline-none md:w-auto">
            <option value="All">All Plans</option>
            {MEMBERSHIP_PLANS.map(plan => <option key={plan} value={plan}>{plan}</option>)}
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl bg-white shadow-card md:block">
        <table className="w-full text-left">
          <thead className="border-b border-ink-950/5 text-xs font-semibold uppercase text-ink-950/35">
            <tr>
              <th className="p-4"><input type="checkbox" checked={selectedIds.length === paginatedMembers.length && paginatedMembers.length > 0} onChange={handleSelectAll} className="h-4 w-4" /></th>
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
                <tr key={member.id} className={cn("hover:bg-gray-50", selectedIds.includes(member.id) && "bg-gold-500/5")}>
                  <td className="p-4"><input type="checkbox" checked={selectedIds.includes(member.id)} onChange={() => handleSelectOne(member.id)} className="h-4 w-4" /></td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getAvatarColor(member.name)} text-xs font-bold text-white`}>{getInitials(member.name)}</div>
                      <span className="font-semibold text-ink-950">{member.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn("rounded-full px-2 py-1 text-xs font-medium", member.type === "Student" ? "bg-pink-100 text-pink-600" : "bg-orange-100 text-orange-600")}>{member.type}</span>
                  </td>
                  <td className="p-4 text-ink-950/70">{member.plan}</td>
                  <td className="p-4 text-xs text-ink-950/70">{member.startDate} to {member.endDate}</td>
                  <td className="p-4 font-semibold text-ink-950">P{displayAmount.toFixed(2)}</td>
                  <td className="p-4"><span className={cn("rounded-full px-2 py-1 text-xs font-medium", getStatusStyle(member.status))}>{member.status}</span></td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedMember(member)} className="flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100"><Eye size={14} /> View</button>
                      <button onClick={() => openEditModal(member)} className="flex items-center gap-1 rounded-lg bg-green-50 px-2 py-1 text-xs font-semibold text-green-600 hover:bg-green-100"><Pencil size={14} /> Edit</button>
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
              <div key={member.id} className={cn("rounded-2xl bg-white p-4 shadow-card", selectedIds.includes(member.id) && "border-2 border-gold-500")}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={selectedIds.includes(member.id)} onChange={() => handleSelectOne(member.id)} className="h-4 w-4" />
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getAvatarColor(member.name)} text-sm font-bold text-white`}>{getInitials(member.name)}</div>
                    <div>
                      <p className="font-semibold text-ink-950">{member.name}</p>
                      <p className="text-xs text-ink-950/50">{member.plan}</p>
                    </div>
                  </div>
                  <span className={cn("rounded-full px-2 py-1 text-[10px] font-medium", getStatusStyle(member.status))}>{member.status}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className={cn("rounded-full px-2 py-1 font-medium", member.type === "Student" ? "bg-pink-100 text-pink-600" : "bg-orange-100 text-orange-600")}>{member.type}</span>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">{member.startDate} to {member.endDate}</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-ink-950/5 pt-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-ink-950/40">Amount</p>
                    <p className="text-lg font-extrabold text-ink-950">P{displayAmount.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedMember(member)} className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600"><Eye size={14} /> View</button>
                    <button onClick={() => openEditModal(member)} className="flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600"><Pencil size={14} /> Edit</button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl bg-white p-10 text-center text-ink-950/40 shadow-card"><UserX className="mx-auto mb-2" size={30} /> No members found.</div>
        )}
        
        {/* Mobile Pagination Bar (Always Visible) */}
        <div className="rounded-2xl bg-white p-4 shadow-card">
          <PaginationBar />
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-2xl bg-ink-950 p-4 text-white shadow-2xl">
          <div className="flex items-center gap-2"><CheckSquare size={18} className="text-gold-500" /><span className="text-sm font-bold">{selectedIds.length} Selected</span></div>
          <div className="flex gap-2">
            <button onClick={handleBulkExport} className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20"><Download size={14} /> Export</button>
            <button onClick={handleBulkDelete} className="flex items-center gap-1 rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/30"><Trash2 size={14} /> Delete</button>
            <button onClick={() => setSelectedIds([])} className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20"><X size={14} /> Clear</button>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6">
            <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-ink-950">Member Profile</h3><button onClick={closeProfile} className="text-ink-950/50 hover:text-ink-950"><X size={20} /></button></div>
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-16 w-16 items-center justify-center rounded-full ${getAvatarColor(selectedMember.name)} text-xl font-bold text-white`}>{getInitials(selectedMember.name)}</div>
              <div>
                <h4 className="text-xl font-bold text-ink-950">{selectedMember.name}</h4>
                <div className="mt-1 flex gap-2">
                  <span className={cn("rounded-full px-2 py-1 text-xs font-medium", selectedMember.type === "Student" ? "bg-pink-100 text-pink-600" : "bg-orange-100 text-orange-600")}>{selectedMember.type}</span>
                  <span className={cn("rounded-full px-2 py-1 text-xs font-medium", getStatusStyle(selectedMember.status))}>{selectedMember.status}</span>
                </div>
              </div>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-ink-950/5 p-3"><p className="text-xs text-ink-950/45">Plan</p><p className="text-sm font-bold text-ink-950">{selectedMember.plan}</p></div>
              <div className="rounded-xl bg-ink-950/5 p-3"><p className="text-xs text-ink-950/45">Total Paid</p><p className="text-sm font-bold text-ink-950">P{(selectedMember.amount > 0 ? selectedMember.amount : getPrice(selectedMember.type, selectedMember.plan)).toFixed(2)}</p></div>
              <div className="rounded-xl bg-ink-950/5 p-3"><p className="text-xs text-ink-950/45">Start Date</p><p className="text-sm font-bold text-ink-950">{selectedMember.startDate}</p></div>
              <div className="rounded-xl bg-ink-950/5 p-3"><p className="text-xs text-ink-950/45">End Date</p><p className="text-sm font-bold text-ink-950">{selectedMember.endDate}</p></div>
            </div>
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-bold text-ink-950">Recent Transactions</h4>
              <div className="max-h-40 overflow-y-auto rounded-xl border border-ink-950/10">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-gray-50 text-xs uppercase text-ink-950/45"><tr><th className="p-2">Time</th><th className="p-2">Plan</th><th className="p-2">Amount</th><th className="p-2">Payment</th></tr></thead>
                  <tbody>
                    {memberTransactions.length > 0 ? memberTransactions.map((txn) => (
                      <tr key={txn.id} className="border-b border-ink-950/5 last:border-0">
                        <td className="p-2 text-ink-950/70">{txn.time}</td>
                        <td className="p-2 text-ink-950/70">{txn.plan}</td>
                        <td className="p-2 font-semibold text-ink-950">{txn.amount}</td>
                        <td className="p-2 text-ink-950/70">{txn.payment}</td>
                      </tr>
                    )) : (<tr><td colSpan="4" className="p-4 text-center text-ink-950/40">No transactions yet.</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-end"><button onClick={closeProfile} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-ink-950/60 hover:bg-gray-200">Close</button></div>
          </div>
        </div>
      )}

      {/* Add / Edit Modals */}
      {(isModalOpen || editingMember) && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink-950">{editingMember ? "Edit Member" : "Add New Member"}</h3>
              <button onClick={() => { setIsModalOpen(false); setEditingMember(null); resetForm(); }} className="text-ink-950/50 hover:text-ink-950"><X size={20} /></button>
            </div>
            <form onSubmit={editingMember ? handleUpdateMember : handleAddMember} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-950/70">Member Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Maria Santos" className="w-full rounded-lg border border-ink-950/10 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-950/70">Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full rounded-lg border border-ink-950/10 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none">
                    <option value="Regular">Regular</option>
                    <option value="Student">Student</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-950/70">Plan</label>
                  <select name="plan" value={formData.plan} onChange={handleChange} className="w-full rounded-lg border border-ink-950/10 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none">
                    {MEMBERSHIP_PLANS.map((plan) => <option key={plan} value={plan}>{plan}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-950/70">Amount</label>
                <input type="number" name="amount" value={formData.amount} readOnly className="w-full rounded-lg border border-ink-950/10 bg-gray-50 px-3 py-2 text-sm font-bold text-ink-950 focus:outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingMember(null); resetForm(); }} className="rounded-lg px-4 py-2 text-sm font-semibold text-ink-950/60 hover:bg-gray-100">Cancel</button>
                <button type="submit" className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-bold text-ink-950 hover:bg-gold-600">{editingMember ? "Update Member" : "Add Member"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}