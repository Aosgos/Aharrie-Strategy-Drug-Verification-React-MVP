"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CircleCheck, X, AlertTriangle, Clock, FileDown } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import BottomNav from "@/components/ui/BottomNav";
import { useI18n } from "@/context/I18nContext";
import { VerificationStatus } from "@/types";

const LOG = [
  { id:"1",  drug:"Amoxicillin 500mg",  batch:"BN-20241105", patient:"Patient #1042", status:"authentic",   time:"9:14 AM"   },
  { id:"2",  drug:"Paracetamol 500mg",  batch:"LG-2024-881", patient:"Patient #1041", status:"counterfeit", time:"8:02 AM"   },
  { id:"3",  drug:"Metformin 850mg",    batch:"BN-20241020", patient:"Patient #1040", status:"authentic",   time:"Yesterday" },
  { id:"4",  drug:"Coartem 80/480mg",   batch:"BN-20231001", patient:"Patient #1039", status:"expired",     time:"Yesterday" },
  { id:"5",  drug:"Lisinopril 10mg",    batch:"BN-20241201", patient:"Patient #1038", status:"authentic",   time:"Jun 8"     },
  { id:"6",  drug:"Artemether 20mg",    batch:"BN-20240801", patient:"Patient #1037", status:"suspicious",  time:"Jun 8"     },
  { id:"7",  drug:"Amoxil 500mg",       batch:"AMXL-241105", patient:"Patient #1036", status:"authentic",   time:"Jun 7"     },
  { id:"8",  drug:"Flagyl 400mg",       batch:"FLGY-240720", patient:"Patient #1035", status:"authentic",   time:"Jun 7"     },
  { id:"9",  drug:"Glucophage 500mg",   batch:"GCPG-240901", patient:"Patient #1034", status:"authentic",   time:"Jun 6"     },
  { id:"10", drug:"Norvasc 5mg",        batch:"NRVS-241201", patient:"Patient #1033", status:"authentic",   time:"Jun 6"     },
];

const statusIcon: Record<string, { icon: typeof CircleCheck; bg: string; color: string }> = {
  authentic:   { icon: CircleCheck,  bg:"var(--green-lt)", color:"var(--green)"  },
  counterfeit: { icon: X,            bg:"var(--pink-bg)",  color:"var(--pink)"   },
  suspicious:  { icon: AlertTriangle,bg:"var(--amber-bg)", color:"var(--amber)"  },
  expired:     { icon: Clock,        bg:"rgba(122,120,117,0.12)", color:"#5F5E5A" },
};

export default function DispensingLogPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  const filtered = LOG.filter(r =>
    !query ||
    r.drug.toLowerCase().includes(query.toLowerCase()) ||
    r.batch.toLowerCase().includes(query.toLowerCase()) ||
    r.patient.toLowerCase().includes(query.toLowerCase())
  );

  const totals = {
    total:     LOG.length,
    authentic: LOG.filter(r => r.status === "authentic").length,
    flagged:   LOG.filter(r => r.status !== "authentic").length,
  };

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
          <button onClick={() => router.push("/dashboard")}
            className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--t1)" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <span className="text-[15px] font-medium" style={{ color: "var(--t1)" }}>Dispensing log</span>
          <button className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border-none"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <FileDown size={15} color="var(--t1)" />
          </button>
        </div>

        {/* Summary strip */}
        <div className="flex gap-2.5 px-4 pb-3 flex-shrink-0">
          {[
            { label:"Total",     val:totals.total,     color:"var(--green)" },
            { label:"Authentic", val:totals.authentic, color:"#2E7D5A"      },
            { label:"Flagged",   val:totals.flagged,   color:"var(--pink)"  },
          ].map(({ label, val, color }) => (
            <div key={label} className="flex-1 rounded-xl p-3 text-center"
              style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
              <p className="text-[16px] font-semibold" style={{ color }}>{val}</p>
              <p className="text-[10px]" style={{ color: "var(--t2)" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="px-4 pb-3 flex-shrink-0">
          <div className="relative">
            <Search size={15} color="var(--t3)" className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search drug, batch, or patient…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px] outline-none"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--t1)" }} />
          </div>
        </div>

        {/* Log rows */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4 flex flex-col gap-2.5">
          {filtered.map(r => {
            const s = statusIcon[r.status] ?? statusIcon.suspicious;
            const Icon = s.icon;
            return (
              <div key={r.id} className="rounded-[14px] p-4 flex items-start gap-3"
                style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: s.bg }}>
                  <Icon size={16} color={s.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <p className="text-[13px] font-semibold truncate" style={{ color: "var(--t1)" }}>{r.drug}</p>
                    <StatusBadge status={r.status as VerificationStatus} />
                  </div>
                  <p className="text-[11px]" style={{ color: "var(--t2)" }}>Batch: {r.batch}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[11px]" style={{ color: "var(--t3)" }}>{r.patient}</p>
                    <p className="text-[11px]" style={{ color: "var(--t3)" }}>{r.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <BottomNav role="pharmacist" />
      </div>
    </div>
  );
}
