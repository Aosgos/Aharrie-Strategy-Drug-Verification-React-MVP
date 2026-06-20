"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, AlertTriangle, X, Clock, RotateCcw, Flag, Share2, ChevronRight } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import Button from "@/components/ui/Button";
import { getStatusConfig } from "@/lib/verification";
import { DrugResult } from "@/types";

function InfoRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-[#F0F5F2] last:border-0">
      <span className="text-[13px] text-[#5A7067]">{label}</span>
      <span className="text-[13px] font-medium text-right max-w-[58%]" style={{ color: color ?? "#1A2E25" }}>{value}</span>
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [drug, setDrug] = useState<DrugResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("aharrie_result");
    if (raw) setDrug(JSON.parse(raw));
    else router.replace("/scan");
  }, [router]);

  if (!drug) return <div className="flex items-center justify-center min-h-screen"><div className="w-10 h-10 border-2 border-[#4A7C5E] border-t-transparent rounded-full spinner" /></div>;

  const cfg = getStatusConfig(drug.status);
  const StatusIcon = drug.status === "authentic" ? ShieldCheck : drug.status === "expired" ? Clock : drug.status === "suspicious" ? AlertTriangle : X;

  return (
    <PageShell>
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 border-b border-[#C8DDD2] bg-white">
        <button onClick={() => router.push("/scan")} className="w-8 h-8 rounded-full bg-white border border-[#C8DDD2] flex items-center justify-center cursor-pointer" aria-label="Back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A2E25" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <span className="text-[15px] font-medium text-[#1A2E25]">Verification result</span>
        <button className="w-8 h-8 rounded-full bg-white border border-[#C8DDD2] flex items-center justify-center cursor-pointer"><Share2 size={15} color="#1A2E25" /></button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6 pt-3 flex flex-col gap-3">
        <div className="rounded-2xl p-5 text-center" style={{ background: cfg.heroBg }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: cfg.iconBg }}>
            <StatusIcon size={26} color={cfg.iconColor} />
          </div>
          <h2 className="text-[20px] font-semibold mb-1.5" style={{ color: cfg.tc }}>{cfg.label}</h2>
          <p className="text-[13px] leading-relaxed" style={{ color: cfg.tc, opacity: 0.85 }}>{cfg.sub}</p>
        </div>

        <div className="bg-white rounded-2xl p-4" style={{ boxShadow:"0 2px 14px rgba(74,124,94,0.09)" }}>
          <p className="text-[11px] font-medium text-[#8AA398] uppercase tracking-wider mb-2">Drug information</p>
          <InfoRow label="Name"           value={`${drug.brandName} ${drug.form} ${drug.strength}`} />
          <InfoRow label="Generic name"   value={drug.genericName} />
          <InfoRow label="Manufacturer"   value={drug.manufacturer} />
          <InfoRow label="NAFDAC No."     value={drug.nafdacNumber} />
          <InfoRow label="Batch No."      value={drug.batchNumber} />
          <InfoRow label="Expiry"         value={drug.expiryDate} />
          <InfoRow label="Country"        value={drug.countryOfOrigin} />
          <InfoRow label="Price range"    value={drug.priceRangeNGN} />
        </div>

        <div className="bg-white rounded-2xl p-4" style={{ boxShadow:"0 2px 14px rgba(74,124,94,0.09)" }}>
          <p className="text-[11px] font-medium text-[#8AA398] uppercase tracking-wider mb-2">Verification checks</p>
          <InfoRow label="NAFDAC registration" value={drug.nafdacRegistered ? "Registered" : "Not registered"} color={drug.nafdacRegistered ? "#2E7D5A" : "#D4607A"} />
          <InfoRow label="Database match"      value={drug.databaseMatch} color={drug.status === "authentic" ? "#2E7D5A" : drug.status === "suspicious" ? "#C07A1A" : "#D4607A"} />
          <InfoRow label="Recall status"       value={drug.recallStatus}  color={drug.recallStatus === "No recall" ? "#2E7D5A" : drug.recallStatus.includes("Expired") ? "#5F5E5A" : "#D4607A"} />
          <div className="flex justify-between items-center py-2">
            <span className="text-[13px] text-[#5A7067]">QR integrity</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-[#E8F0EC] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width:`${drug.qrIntegrity}%`, background: drug.qrIntegrity >= 80 ? "#4A7C5E" : drug.qrIntegrity >= 40 ? "#C07A1A" : "#D4607A" }} />
              </div>
              <span className="text-[13px] font-medium" style={{ color: drug.qrIntegrity >= 80 ? "#4A7C5E" : drug.qrIntegrity >= 40 ? "#C07A1A" : "#D4607A" }}>{drug.qrIntegrity}%</span>
            </div>
          </div>
        </div>

        <p className="text-center text-[12px] text-[#8AA398]">Verified at {new Date(drug.verifiedAt).toLocaleTimeString()}</p>

        <div className="flex gap-2.5">
          <Button variant="outline" onClick={() => router.push("/scan")} className="flex-1"><RotateCcw size={15} />Scan again</Button>
          <Button onClick={() => router.push("/report")} className="flex-1"><Flag size={15} color="white" />Report</Button>
        </div>

        {(drug.status === "counterfeit" || drug.status === "suspicious") && (
          <button onClick={() => router.push("/report")} className="flex items-center justify-between w-full rounded-xl px-4 py-3 cursor-pointer border-none" style={{ background:"#FFE8EC" }}>
            <div className="flex items-center gap-2.5">
              <Flag size={16} color="#D4607A" />
              <div className="text-left">
                <p className="text-[13px] font-semibold" style={{ color:"#791F1F" }}>Report to NAFDAC</p>
                <p className="text-[11px]" style={{ color:"#D4607A" }}>Help protect others in your community</p>
              </div>
            </div>
            <ChevronRight size={16} color="#D4607A" />
          </button>
        )}
      </div>
    </PageShell>
  );
}
