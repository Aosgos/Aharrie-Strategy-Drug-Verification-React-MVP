"use client";
import { useState } from "react";
import { Search, ShieldCheck, MapPin, ChevronRight } from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";
import { useI18n } from "@/context/I18nContext";

const PHARMACIES = [
  { id:"1", name:"HealthPlus Pharmacy",   address:"15 Admiralty Way, Lekki Phase 1", verified:true,  score:98 },
  { id:"2", name:"MedPlus Pharmacy",      address:"22 Mobolaji Bank Anthony Way, Ikeja", verified:true,  score:96 },
  { id:"3", name:"Obi's Pharmacy",        address:"4 Bode Thomas Street, Surulere",  verified:true,  score:94 },
  { id:"4", name:"Alpha Pharmacy",        address:"10 Awolowo Road, Ikoyi",          verified:true,  score:91 },
  { id:"5", name:"Fidson Care Pharmacy",  address:"Plot 39 Mobolaji Johnson Ave",    verified:true,  score:89 },
  { id:"6", name:"Community Drugs",       address:"88 Agege Motor Road, Ogba",       verified:false, score:62 },
];
function trustColor(s: number) { return s >= 90 ? "var(--green)" : s >= 70 ? "var(--amber)" : "var(--pink)"; }

export default function PharmaciesPage() {
  const { t } = useI18n();
  const [query, setQuery]         = useState("");
  const [verifiedOnly, setVerified] = useState(false);
  const filtered = PHARMACIES.filter(p =>
    (!query || p.name.toLowerCase().includes(query.toLowerCase()) || p.address.toLowerCase().includes(query.toLowerCase())) &&
    (!verifiedOnly || p.verified)
  );

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full">
        <div className="px-4 py-3 flex-shrink-0">
          <h1 className="text-[17px] font-semibold mb-3" style={{ color: "var(--t1)" }}>{t("nav_pharmacies")}</h1>
          <div className="relative mb-3">
            <Search size={15} color="var(--t3)" className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name or area…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px] outline-none"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--t1)" }} />
          </div>
          <button onClick={() => setVerified(!verifiedOnly)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border-none cursor-pointer text-[12px] font-medium transition-colors"
            style={{ background: verifiedOnly ? "var(--green)" : "var(--card-bg)", color: verifiedOnly ? "white" : "var(--t2)", boxShadow: "var(--card-shadow)" }}>
            <ShieldCheck size={13} color={verifiedOnly ? "white" : "var(--t2)"} />Verified only
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4 flex flex-col gap-2.5">
          {filtered.map(p => (
            <div key={p.id} className="rounded-2xl p-4" style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[14px] font-semibold" style={{ color: "var(--t1)" }}>{p.name}</p>
                    {p.verified && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "var(--green-lt)" }}>
                        <ShieldCheck size={11} color="var(--green)" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={11} color="var(--t3)" />
                    <p className="text-[11px]" style={{ color: "var(--t2)" }}>{p.address}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border-2"
                    style={{ borderColor: trustColor(p.score), color: trustColor(p.score) }}>
                    <span className="text-[12px] font-bold">{p.score}</span>
                  </div>
                  <span className="text-[9px] mt-0.5" style={{ color: "var(--t3)" }}>Trust</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                {p.verified
                  ? <span className="text-[11px] font-medium flex items-center gap-1" style={{ color: "var(--green)" }}>
                      <ShieldCheck size={11} color="var(--green)" />NAFDAC verified
                    </span>
                  : <span className="text-[11px] font-medium" style={{ color: "var(--pink)" }}>Not verified</span>}
                <button className="flex items-center gap-1 text-[12px] font-medium bg-transparent border-none cursor-pointer" style={{ color: "var(--green)" }}>
                  Directions<ChevronRight size={13} color="var(--green)" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <BottomNav role="patient" />
      </div>
    </div>
  );
}
