"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { useStreak } from "@/context/StreakContext";
import { api } from "@/lib/api";
import { DrugResult } from "@/types";

const DEMOS = [
  { label:"Coartem — Authentic",       nafdac:"04-3275", batch:"CTBN-240601" },
  { label:"Glucophage — Authentic",    nafdac:"04-6233", batch:"GCPG-240901" },
  { label:"Paracetamol — Counterfeit", nafdac:"NONE",    batch:"LG-2024-881" },
];

export default function ManualLookupPage() {
  const router = useRouter();
  const { token }    = useAuth();
  const { t }        = useI18n();
  const { increment } = useStreak();

  const [nafdac,  setNafdac]  = useState("");
  const [batch,   setBatch]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!nafdac || !batch) return;
    setLoading(true); setError("");
    try {
      const result = await api.verify.byBatch(nafdac, batch, token) as DrugResult;
      sessionStorage.setItem("aharrie_result", JSON.stringify(result));
    } catch {
      const fallback: Partial<DrugResult> = {
        brandName:"Unknown drug", genericName:"Unknown", nafdacNumber: nafdac,
        batchNumber: batch, status:"unregistered", nafdacRegistered:false,
        qrIntegrity:0, databaseMatch:"No record found", recallStatus:"Unknown",
        verifiedAt: new Date().toISOString(), category:"", strength:"", form:"",
        manufacturer:"", countryOfOrigin:"", expiryDate:"Unknown", priceRangeNGN:"",
      };
      sessionStorage.setItem("aharrie_result", JSON.stringify(fallback));
    } finally {
      setLoading(false);
      increment(true);
      router.push("/result");
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full">
        <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0">
          <button onClick={() => router.back()}
            className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--t1)" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <h1 className="text-[16px] font-semibold" style={{ color: "var(--t1)" }}>Manual Lookup</h1>
        </div>

        <div className="flex flex-col items-center px-4 py-4 gap-2">
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "var(--green-lt)" }}>
            <Search size={20} color="var(--green)" />
          </div>
          <p className="text-[13px] text-center" style={{ color: "var(--t2)" }}>
            Enter the NAFDAC number and batch number from the drug packaging
          </p>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6">
          <div className="rounded-2xl p-5" style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
            <form onSubmit={submit} noValidate>
              {[
                { label:"NAFDAC registration number *", placeholder:"e.g. 04-3275", value:nafdac, setter:setNafdac },
                { label:"Batch number *", placeholder:"e.g. CTBN-240601", value:batch, setter:setBatch },
              ].map(({ label, placeholder, value, setter }) => (
                <div key={label} className="mb-3.5">
                  <label className="block text-[13px] font-medium mb-1.5" style={{ color: "var(--t1)" }}>{label}</label>
                  <input value={value} onChange={e => setter(e.target.value.toUpperCase())}
                    placeholder={placeholder} required
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none"
                    style={{ background:"var(--bg-input)", border:"1px solid var(--border)", color:"var(--t1)", fontFamily:"monospace" }} />
                </div>
              ))}
              {error && <p className="text-[12px] mb-3" style={{ color: "var(--pink)" }}>{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-medium text-white border-none cursor-pointer disabled:opacity-50"
                style={{ background: "var(--green)" }}>
                {loading
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full spinner" />
                  : <><Search size={16} color="white" />Verify drug</>}
              </button>
            </form>

            <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="text-[12px] text-center mb-3" style={{ color: "var(--t3)" }}>Try a demo lookup</p>
              {DEMOS.map(d => (
                <button key={d.label} onClick={() => { setNafdac(d.nafdac); setBatch(d.batch); }}
                  className="flex items-center gap-2 text-[12px] bg-transparent border-none cursor-pointer mb-2"
                  style={{ color: "var(--green)" }}>
                  <ShieldCheck size={13} color="var(--green)" />{d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
