"use client";
import { useRouter } from "next/navigation";
import { User, Bell, ShieldCheck, Leaf, HelpCircle, LogOut, ChevronRight, Star } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import TopNav from "@/components/ui/TopNav";
import BottomNav from "@/components/ui/BottomNav";
import { useAuth } from "@/lib/AuthContext";

const menuItems = [
  { icon: User,        label: "Edit profile",         danger: false },
  { icon: Bell,        label: "Notifications",        danger: false, value: "On" },
  { icon: ShieldCheck, label: "Privacy & security",   danger: false },
  { icon: Leaf,        label: "About Aharrie Strategy",danger: false },
  { icon: HelpCircle,  label: "Help & support",       danger: false },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const initials = (user?.name ?? "??")
    .split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <PageShell>
      <TopNav title="Account" showBack={false} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4 flex flex-col gap-3">

        {/* Profile card */}
        <div className="bg-white rounded-2xl p-5 flex items-center gap-4" style={{ boxShadow:"0 2px 14px rgba(74,124,94,0.09)" }}>
          <div className="w-14 h-14 rounded-full bg-[#D4EDE0] flex items-center justify-center text-[18px] font-semibold text-[#4A7C5E] flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[16px] font-semibold text-[#1A2E25] truncate">{user?.name}</p>
            <p className="text-[12px] text-[#5A7067] truncate">{user?.email || "No email set"}</p>
            {user?.role === "pharmacist" && (
              <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] text-[#4A7C5E] bg-[#D4EDE0] px-2 py-0.5 rounded-full font-medium">
                <ShieldCheck size={10} color="#4A7C5E" />Verified Pharmacist
              </span>
            )}
          </div>
        </div>

        {/* Subscription banner — pharmacist only */}
        {user?.role === "pharmacist" && user?.subscriptionPlan && (
          <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background:"#4A7C5E", boxShadow:"0 4px 16px rgba(74,124,94,0.25)" }}>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Star size={12} color="rgba(255,255,255,0.75)" />
                <p className="text-[12px] text-white/75 capitalize">{user.subscriptionPlan} plan</p>
              </div>
              <p className="text-[15px] font-semibold text-white">Active subscription</p>
              <p className="text-[11px] text-white/65 mt-0.5">Renews July 10, 2026</p>
            </div>
            <button className="bg-white/20 text-white text-[12px] font-medium px-3.5 py-1.5 rounded-full border-none cursor-pointer">
              Manage
            </button>
          </div>
        )}

        {/* Stats — patient only */}
        {user?.role === "patient" && (
          <div className="grid grid-cols-3 gap-2.5">
            {[{ label:"Total scans", val:"24" }, { label:"Authentic", val:"21" }, { label:"Flagged", val:"3" }].map(({ label, val }) => (
              <div key={label} className="bg-white rounded-xl p-3 text-center" style={{ boxShadow:"0 2px 14px rgba(74,124,94,0.09)" }}>
                <p className="text-[18px] font-semibold text-[#4A7C5E]">{val}</p>
                <p className="text-[10px] text-[#5A7067] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Menu */}
        <div className="bg-white rounded-2xl px-4" style={{ boxShadow:"0 2px 14px rgba(74,124,94,0.09)" }}>
          {menuItems.map(({ icon: Icon, label, value }) => (
            <button key={label} className="flex items-center gap-3 w-full py-3.5 border-b border-[#F0F5F2] last:border-0 bg-transparent cursor-pointer text-left">
              <div className="w-8 h-8 rounded-full bg-[#D4EDE0] flex items-center justify-center flex-shrink-0">
                <Icon size={16} color="#4A7C5E" />
              </div>
              <span className="flex-1 text-[14px] text-[#1A2E25]">{label}</span>
              {value && <span className="text-[12px] text-[#8AA398]">{value}</span>}
              <ChevronRight size={15} color="#8AA398" />
            </button>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-3 w-full py-3.5 bg-transparent cursor-pointer text-left border-0">
            <div className="w-8 h-8 rounded-full bg-[#FFE8EC] flex items-center justify-center flex-shrink-0">
              <LogOut size={16} color="#D4607A" />
            </div>
            <span className="flex-1 text-[14px] text-[#D4607A]">Sign out</span>
          </button>
        </div>

        <p className="text-center text-[11px] text-[#8AA398]">
          Aharrie Strategy v1.0.0 · NAFDAC integrated
        </p>
      </div>
      <BottomNav role={user?.role ?? "patient"} />
    </PageShell>
  );
}
