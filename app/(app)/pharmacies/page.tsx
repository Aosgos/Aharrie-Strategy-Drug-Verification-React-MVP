"use client";
import { useState } from "react";
import { Search, ShieldCheck, MapPin, ChevronRight } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import TopNav from "@/components/ui/TopNav";
import BottomNav from "@/components/ui/BottomNav";

const PHARMACIES = [
  { id:"1", name:"HealthPlus Pharmacy",   address:"15 Admiralty Way, Lekki Phase 1, Lagos", verified:true,  pcn:"PCN/2019/04512", score:98 },
  { id:"2", name:"MedPlus Pharmacy",      address:"22 Mobolaji Bank Anthony Way, Ikeja",     verified:true,  pcn:"PCN/2020/07731", score:96 },
  { id:"3", name:"Obi's Pharmacy",        address:"4 Bode Thomas Street, Surulere, Lagos",   verified:true,  pcn:"PCN/2021/09214", score:94 },
  { id:"4", name:"Alpha Pharmacy",        address:"10 Awolowo Road, Ikoyi, Lagos",           verified:true,  pcn:"PCN/2022/11045", score:91 },
  { id:"5", name:"Fidson Care Pharmacy",  address:"Plot 39 Mobolaji Johnson Ave, Alausa",    verified:true,  pcn:"PCN/2020/08812", score:89 },
  { id:"6", name:"Community Drugs",       address:"88 Agege Motor Road, Ogba, Lagos",        verified:false, pcn:"",               score:62 },
];

function trustColor(s: number) { return s >= 90 ? "#2E7D5A" : s >= 70 ? "#C07A1A" : "#D4607A"; }

export default function PharmaciesPage() {
  const [query,      setQuery]       = useState("");
  const [verifiedOnly, setVerified]  = useState(false);

  const filtered = PHARMACIES.filter(p =>
    (!query || p.name.toLowerCase().includes(query.toLowerCase()) || p.address.toLowerCase().includes(query.toLowerCase())) &&
    (!verifiedOnly || p.verified)
  );

  return (
    <PageShell>
      <TopNav title="Trusted pharmacies" backHref="/home" />
      <div className="px-4 pb-3 flex-shrink-0">
        <div className="relative mb-3">
          <Search size={15} color="#8AA398" className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name or area…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#C8DDD2] bg-[#EAF4EE] text-[13px] text-[#1A2E25] placeholder:text-[#8AA398] outline-none focus:border-[#4A7C5E]" />
        </div>
        <button onClick={() => setVerified(!verifiedOnly)} className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border cursor-pointer text-[12px] font-medium transition-colors"
          style={{ background: verifiedOnly ? "#4A7C5E" : "white", color: verifiedOnly ? "white" : "#5A7067", borderColor: verifiedOnly ? "#4A7C5E" : "#C8DDD2" }}>
          <ShieldCheck size={13} color={verifiedOnly ? "white" : "#5A7067"} />Verified only
        </button>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4 flex flex-col gap-2.5">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-2xl p-4" style={{ boxShadow:"0 2px 14px rgba(74,124,94,0.09)" }}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[14px] font-semibold text-[#1A2E25]">{p.name}</p>
                  {p.verified && (
                    <div className="w-5 h-5 rounded-full bg-[#D4EDE0] flex items-center justify-center flex-shrink-0">
                      <ShieldCheck size={11} color="#4A7C5E" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={11} color="#8AA398" />
                  <p className="text-[11px] text-[#5A7067]">{p.address}</p>
                </div>
              </div>
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center border-2" style={{ borderColor: trustColor(p.score), color: trustColor(p.score) }}>
                  <span className="text-[12px] font-bold">{p.score}</span>
                </div>
                <span className="text-[9px] text-[#8AA398] mt-0.5">Trust</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              {p.verified
                ? <span className="text-[11px] text-[#4A7C5E] font-medium flex items-center gap-1"><ShieldCheck size={11} color="#4A7C5E" />NAFDAC verified · {p.pcn}</span>
                : <span className="text-[11px] text-[#D4607A] font-medium">Not verified</span>}
              <button className="flex items-center gap-1 text-[12px] text-[#4A7C5E] font-medium bg-transparent border-none cursor-pointer">
                Directions<ChevronRight size={13} color="#4A7C5E" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <BottomNav role="patient" />
    </PageShell>
  );
}
