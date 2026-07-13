"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";
import StatusBadge from "@/components/ui/StatusBadge";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { api } from "@/lib/api";
import { VerificationStatus } from "@/types";

const MOCK = [
  { id:"1", drugName:"Amoxil 500mg",           batchNumber:"AMXL-241105", status:"authentic",   scannedAt:"Today, 9:14 AM"   },
  { id:"2", drugName:"Paracetamol 500mg",       batchNumber:"LG-2024-881", status:"counterfeit", scannedAt:"Today, 8:02 AM"   },
  { id:"3", drugName:"Coartem 20mg/120mg",      batchNumber:"CTBN-211001", status:"expired",     scannedAt:"Yesterday"        },
  { id:"4", drugName:"Glucophage 500mg",        batchNumber:"GCPG-240901", status:"authentic",   scannedAt:"Yesterday"        },
  { id:"5", drugName:"Coartem (Unverified)",    batchNumber:"FAKE-240301", status:"suspicious",  scannedAt:"Jun 8"            },
  { id:"6", drugName:"Norvasc 5mg",             batchNumber:"NRVS-241201", status:"authentic",   scannedAt:"Jun 7"            },
  { id:"7", drugName:"Ciprotab 500mg",          batchNumber:"CPTB-241015", status:"authentic",   scannedAt:"Jun 6"            },
  { id:"8", drugName:"TLD 300/300/50mg",        batchNumber:"TLD-241005",  status:"authentic",   scannedAt:"Jun 5"            },
];

const FILTERS = ["all","authentic","suspicious","counterfeit","expired"];
const dotColor: Record<string, string> = { authentic:"var(--green)", suspicious:"var(--amber)", counterfeit:"var(--pink)", expired:"var(--t3)" };

export default function ScanHistoryPage() {
  const router = useRouter();
  const { token } = useAuth();
  const { t } = useI18n();
  const [scans, setScans]   = useState(MOCK);
  const [query, setQuery]   = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (token) {
      api.verify.history(token).then((r: unknown) => {
        const d = r as { scans: typeof MOCK };
        if (d?.scans?.length) setScans(d.scans);
      }).catch(() => {});
    }
  }, [token]);

  const filtered = scans.filter(s =>
    (filter === "all" || s.status === filter) &&
    (!query || s.drugName.toLowerCase().includes(query.toLowerCase()) ||
               s.batchNumber.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
          <h1 className="text-[17px] font-semibold" style={{ color: "var(--t1)" }}>{t("nav_history")}</h1>
          <span className="text-[12px]" style={{ color: "var(--t3)" }}>{filtered.length} results</span>
        </div>

        <div className="px-4 pb-3 flex-shrink-0">
          <div className="relative mb-3">
            <Search size={15} color="var(--t3)" className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search drug name or batch…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px] outline-none"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--t1)" }} />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="flex-shrink-0 text-[12px] font-medium px-3.5 py-1.5 rounded-full border-none cursor-pointer transition-colors capitalize"
                style={{ background: filter === f ? "var(--green)" : "var(--card-bg)", color: filter === f ? "white" : "var(--t2)", boxShadow: "var(--card-shadow)" }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4 flex flex-col gap-2.5">
          {filtered.length === 0
            ? <div className="text-center py-16" style={{ color: "var(--t3)" }}>
                <p className="font-medium mb-1">No scans found</p>
                <p className="text-[13px]">Try a different filter</p>
              </div>
            : filtered.map(s => (
                <button key={s.id} onClick={() => router.push("/result")}
                  className="rounded-[14px] px-4 py-3 text-left w-full border-none cursor-pointer flex items-start gap-2.5"
                  style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
                  <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: dotColor[s.status] || "var(--t3)" }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-[13px] font-semibold truncate" style={{ color: "var(--t1)" }}>{s.drugName}</p>
                      <StatusBadge status={s.status as VerificationStatus} />
                    </div>
                    <p className="text-[11px]" style={{ color: "var(--t2)" }}>Batch: {s.batchNumber}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--t3)" }}>{s.scannedAt}</p>
                  </div>
                </button>
              ))}
        </div>
        <BottomNav role="patient" />
      </div>
    </div>
  );
}
