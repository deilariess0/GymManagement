// src/pages/RegisterMember.jsx
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Download,
  CheckCircle2,
  ArrowLeft,
  User,
  Phone,
  Dumbbell,
  Fingerprint,
  X,
} from "lucide-react";
import { getAllMembers, addMemberToStorage } from "../utils/memberStorage";

const MEMBERSHIP_PLANS = ["Weekly", "Monthly", "3 Months", "6 Months"];

export default function RegisterMember() {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newMember, setNewMember] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "Regular",
    plan: "Monthly",
    contact: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateMemberId = () => {
    const existing = getAllMembers();
    const numericIds = existing
      .map((m) => parseInt(String(m.id).replace(/\D/g, ""), 10))
      .filter((n) => !isNaN(n));

    const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
    const nextId = maxId + 1;
    return `M-${String(nextId).padStart(4, "0")}`;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Please enter a member name");

    const existing = getAllMembers();
    const duplicate = existing.find(
      (m) => m.name.toLowerCase() === formData.name.toLowerCase().trim()
    );
    if (duplicate) {
      return alert(`A member named "${formData.name}" already exists (${duplicate.id}).`);
    }

    const memberId = generateMemberId();

    const today = new Date();
    const startDate = today.toISOString().split("T")[0];
    const planDays = { Weekly: 7, Monthly: 30, "3 Months": 90, "6 Months": 180 };
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + (planDays[formData.plan] || 30));

    const member = {
      id: memberId,
      name: formData.name.trim(),
      type: formData.type,
      plan: formData.plan,
      contact: formData.contact,
      startDate,
      endDate: endDate.toISOString().split("T")[0],
      status: "Active",
      isInside: false,
      amount: 0,
      qrValue: memberId,
    };

    addMemberToStorage(member);
    setNewMember(member);

    // Reset form fields immediately so if the modal is closed, the form is empty
    setFormData({ name: "", type: "Regular", plan: "Monthly", contact: "" });

    // Open the success modal
    setShowSuccessModal(true);
  };

  const handleDownloadQR = () => {
    const qrSvg = document.getElementById("member-qr-code");
    if (!qrSvg || !newMember) return;

    const svgData = new XMLSerializer().serializeToString(qrSvg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${newMember.name.replace(/\s+/g, "_")}_QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setNewMember(null);
  };

  const handleRegisterAnother = () => {
    handleCloseModal();
  };

  const getInitials = (name) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);

  return (
    <>
      <div className="mx-auto max-w-3xl space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/members")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-950/10 bg-white text-ink-950/60 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-ink-950 md:text-2xl">
              Register New Member
            </h1>
            <p className="text-xs text-ink-950/45 md:text-sm">
              Add a member and generate their QR code
            </p>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="rounded-2xl bg-white p-5 shadow-card md:p-6">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-ink-950/70">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-950/30" size={16} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Juan Dela Cruz"
                  className="w-full min-h-[48px] rounded-xl border border-ink-950/10 bg-surface pl-10 pr-4 text-sm text-ink-950 outline-none transition-all focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/15 placeholder:text-ink-950/30"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-ink-950/70">
                Contact Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-950/30" size={16} />
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="e.g., 0912 345 6789"
                  className="w-full min-h-[48px] rounded-xl border border-ink-950/10 bg-surface pl-10 pr-4 text-sm text-ink-950 outline-none transition-all focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/15 placeholder:text-ink-950/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-ink-950/70">
                  Member Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full min-h-[48px] rounded-xl border border-ink-950/10 bg-surface px-4 text-sm text-ink-950 outline-none transition-all focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/15"
                >
                  <option value="Regular">Regular</option>
                  <option value="Student">Student</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-ink-950/70">
                  Plan
                </label>
                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  className="w-full min-h-[48px] rounded-xl border border-ink-950/10 bg-surface px-4 text-sm text-ink-950 outline-none transition-all focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/15"
                >
                  {MEMBERSHIP_PLANS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-ink-950/5 pt-5">
              <button
                type="button"
                onClick={() => navigate("/members")}
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-ink-950/60 transition-colors hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-ink-950 transition-colors hover:bg-gold-600"
              >
                <UserPlus size={16} strokeWidth={2.5} />
                Register Member
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 
        SUCCESS MODAL (Pop-up)
        Appears after successful registration with member details + QR code
      */}
      {showSuccessModal && newMember && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4 animate-fade-in">
          <div className="max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl animate-slide-up sm:animate-fade-in">
            
            {/* Modal Header - Success Banner */}
            <div className="relative bg-emerald-50 p-5">
              <button
                onClick={handleCloseModal}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-emerald-800/50 transition-colors hover:bg-emerald-100 hover:text-emerald-900"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-base font-bold text-emerald-900">
                    Member Registered!
                  </p>
                  <p className="text-xs text-emerald-700">
                    QR code generated for {newMember.name}
                  </p>
                </div>
              </div>
            </div>

            {/* ID Card Preview */}
            <div className="p-5">
              
              {/* Card */}
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
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gold-500 text-lg font-extrabold text-ink-950">
                      {getInitials(newMember.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-lg font-extrabold text-ink-950">
                        {newMember.name}
                      </h2>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs font-bold text-ink-950/50">
                        <Fingerprint size={12} />
                        {newMember.id}
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wide text-ink-950/35">
                            Type
                          </p>
                          <p className="text-xs font-bold text-ink-950">{newMember.type}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wide text-ink-950/35">
                            Plan
                          </p>
                          <p className="text-xs font-bold text-ink-950">{newMember.plan}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wide text-ink-950/35">
                            Start Date
                          </p>
                          <p className="text-xs font-bold text-ink-950">{newMember.startDate}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wide text-ink-950/35">
                            Expires
                          </p>
                          <p className="text-xs font-bold text-ink-950">{newMember.endDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden h-32 w-px bg-ink-950/10 sm:block" />

                  {/* RIGHT: QR Code */}
                  <div className="flex shrink-0 flex-col items-center justify-center gap-2">
                    <div className="rounded-xl bg-white p-2 ring-1 ring-ink-950/5">
                      <QRCodeSVG
                        id="member-qr-code"
                        value={newMember.qrValue}
                        size={120}
                        level="H"
                        fgColor="#14141C"
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
                    <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-emerald-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleDownloadQR}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold-500 px-4 py-3 text-sm font-bold text-ink-950 transition-colors hover:bg-gold-600"
                >
                  <Download size={16} strokeWidth={2.5} />
                  Download QR Code
                </button>
                <button
                  onClick={handleRegisterAnother}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-ink-950/10 bg-white px-4 py-3 text-sm font-bold text-ink-950 transition-colors hover:bg-gray-50"
                >
                  <UserPlus size={16} strokeWidth={2.5} />
                  Register Another
                </button>
              </div>

              <button
                onClick={() => navigate("/members")}
                className="mt-3 w-full rounded-xl px-4 py-2.5 text-xs font-bold text-ink-950/45 transition-colors hover:bg-gray-50"
              >
                Go to Members List
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}