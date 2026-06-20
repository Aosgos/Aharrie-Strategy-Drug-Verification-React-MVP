"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import TopNav from "@/components/ui/TopNav";
import StatusBadge from "@/components/ui/StatusBadge";
import BottomNav from "@/components/ui/BottomNav";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/lib/api";
import { VerificationStatus } from "@/types";

const FILTERS = ["all","authentic","suspicious","counterfeit","expired"];
const dotColor: Record<string, string> = { authentic:"#4A7C5E", suspicious:"#C07A1A", counterfeit:"#D4607A", expired:"#888" };

const MOCK = [
  { id:"1", drugName:"Amoxil 500mg",           batchNumber:"AMXL-241105", nafdacNumber:"04-2508", status:"authentic",   scannedAt:"Today, 9:14 AM"   },
  { id:"2", drugName:"Paracetamol 500mg",       batchNumber:"LG-2024-881", nafdacNumber:"NONE",    status:"counterfeit", scannedAt:"Today, 8:02 AM"   },
  { id:"3", drugName:"Coartem 20mg/120mg",      batchNumber:"CTBN-211001", nafdacNumber:"04-3275", status:"expired",     scannedAt:"Yesterday, 3:45 PM" },
  { id:"4", drugName:"Glucophage 500mg",         batchNumber:"GCPG-240901", nafdacNumber:"04-6233", status:"authentic",   scannedAt:"Yesterday, 11:30 AM" },
  { id:"5", drugName:"Coartem (Unverified)",     batchNumber:"FAKE-240301", nafdacNumber:"04-3275", status:"suspicious",  scannedAt:"Jun 8, 2:10 PM"  },
  { id:"6", drugName:"Norvasc 5mg",              batchNumber:"NRVS-241201", nafdacNumber:"A4-5509", status:"authentic",   scannedAt:"Jun 7, 10:05 AM" },
];

export default function ScanHistoryPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [scans, setScans]     = useState(MOCK);
  const [query, setQuery]     = useState("");
  const [filter, setFilter]   = useState("all");

  useEffect(() => {
    if (token) {
      api.verify.history(token).then((r: unknown) => { const d = r as { scans: typeof MOCK }; if (d?.scans?.length) setScans(d.scans); }).catch(() => {});
    }
  }, [token]);

  const filtered = scans.filter(s =>
    (filter === "all" || s.status === filter) &&
    (!query || s.drugName.toLowerCase().includes(query.toLowerCase()) || s.batchNumber.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <PageShell>
      <TopNav title="Scan history" backHref="/home" />
      <div className="px-4 pb-3 flex-shrink-0">
        <div className="relative mb-3">
          <Search size={15} color="#8AA398" className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search drug name or batch…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#C8DDD2] bg-[#EAF4EE] text-[13px] text-[#1A2E25] placeholder:text-[#8AA398] outline-none focus:border-[#4A7C5E]" />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} className="flex-shrink-0 text-[12px] font-medium px-3.5 py-1.5 rounded-full border cursor-pointer transition-colors capitalize"
              style={{ background: filter === f ? "#4A7C5E" : "white", color: filter === f ? "white" : "#5A7067", borderColor: filter === f ? "#4A7C5E" : "#C8DDD2" }}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <p className="px-4 text-[12px] text-[#8AA398] mb-2 flex-shrink-0">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4 flex flex-col gap-2.5">
        {filtered.length === 0
          ? <div className="text-center py-16 text-[#8AA398]"><p className="font-medium mb-1">No scans found</p><p className="text-[13px]">Try a different filter</p></div>
          : filtered.map(s => (
            <button key={s.id} onClick={() => router.push("/result")} className="bg-white rounded-[14px] px-4 py-3 text-left w-full border-none cursor-pointer flex items-start gap-2.5" style={{ boxShadow:"0 2px 14px rgba(74,124,94,0.09)" }}>
              <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: dotColor[s.status] || "#888" }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-[13px] font-semibold text-[#1A2E25] truncate">{s.drugName}</p>
                  <StatusBadge status={s.status as VerificationStatus} />
                </div>
                <p className="text-[11px] text-[#5A7067]">Batch: {s.batchNumber}</p>
                <p className="text-[11px] text-[#8AA398] mt-0.5">{s.scannedAt}</p>
              </div>
            </button>
          ))}
      </div>
      <BottomNav role="patient" />
    </PageShell>
  );
}
