"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShieldCheck } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import TopNav from "@/components/ui/TopNav";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FieldInput from "@/components/ui/FieldInput";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/lib/api";
import { DrugResult } from "@/types";

const demos = [
  { label:"Coartem — Authentic",       nafdac:"04-3275", batch:"CTBN-240601" },
  { label:"Paracetamol — Counterfeit", nafdac:"NONE",    batch:"LG-2024-881" },
  { label:"Glucophage — Authentic",    nafdac:"04-6233", batch:"GCPG-240901" },
];

export default function ManualLookupPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [nafdac,  setNafdac]  = useState("");
  const [batch,   setBatch]   = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!nafdac || !batch) return;
    setLoading(true);
    try {
      const result = await api.verify.byBatch(nafdac, batch, token) as DrugResult;
      sessionStorage.setItem("aharrie_result", JSON.stringify(result));
      router.push("/result");
    } catch { router.push("/result"); }
    finally { setLoading(false); }
  }

  return (
    <PageShell>
      <TopNav title="Manual Lookup" backHref="/scan" />
      <div className="flex flex-col items-center px-4 py-4 gap-2">
        <div className="w-12 h-12 rounded-full bg-[#D4EDE0] flex items-center justify-center"><Search size={20} color="#4A7C5E" /></div>
        <p className="text-[13px] text-[#5A7067] text-center">Enter the NAFDAC number and batch number from the drug packaging</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6">
        <Card>
          <form onSubmit={submit} noValidate>
            <FieldInput label="NAFDAC registration number *" placeholder="e.g. 04-3275" value={nafdac} onChange={e => setNafdac(e.target.value)} required />
            <FieldInput label="Batch number *" placeholder="e.g. CTBN-240601" value={batch} onChange={e => setBatch(e.target.value)} required />
            <FieldInput label="Drug name (optional)" placeholder="e.g. Coartem 20mg/120mg" />
            <Button type="submit" disabled={loading} className="mt-1">
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full spinner" /> : <><Search size={16} color="white" />Verify drug</>}
            </Button>
          </form>
          <div className="border-t border-[#F0F5F2] mt-4 pt-4">
            <p className="text-[12px] text-[#8AA398] text-center mb-3">Try a demo lookup</p>
            {demos.map(d => (
              <button key={d.label} onClick={() => { setNafdac(d.nafdac); setBatch(d.batch); }}
                className="flex items-center gap-2 text-[12px] text-[#4A7C5E] bg-transparent border-none cursor-pointer mb-2">
                <ShieldCheck size={13} color="#4A7C5E" />{d.label}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
