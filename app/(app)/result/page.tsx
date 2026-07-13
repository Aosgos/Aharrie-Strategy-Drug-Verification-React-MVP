"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ShieldCheck, AlertTriangle, X, Clock, RotateCcw, Flag, Share2, ChevronRight } from "lucide-react";
import { getStatusConfig } from "@/lib/verification";
import { DrugResult } from "@/types";
import { useI18n } from "@/context/I18nContext";
import { useTheme } from "@/context/ThemeContext";

const MoleculeCanvas = dynamic(() => import("@/components/three/MoleculeCanvas").then(m => m.MoleculeCanvas), { ssr: false });

function InfoRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid var(--border)" }}>
      <span className="text-[13px]" style={{ color: "var(--t2)" }}>{label}</span>
      <span className="text-[13px] font-medium text-right max-w-[58%]" style={{ color: color ?? "var(--t1)" }}>{value}</span>
    </div>
  );
}

export default function ResultPage() {
  const router  = useRouter();
  const { t }   = useI18n();
  const { isDark } = useTheme();
  const [drug, setDrug] = useState<DrugResult | null>(null);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("aharrie_result");
    if (raw) setDrug(JSON.parse(raw));
    else router.replace("/scan");
  }, [router]);

  if (!drug) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="w-10 h-10 border-2 border-t-transparent rounded-full spinner" style={{ borderColor: "var(--green)" }} />
    </div>
  );

  const cfg = getStatusConfig(drug.status);
  const StatusIcon =
    drug.status === "authentic"  ? ShieldCheck :
    drug.status === "expired"    ? Clock :
    drug.status === "suspicious" ? AlertTriangle : X;

  async function handleShare() {
    const text = `Drug Verification Result\n${drug!.brandName} ${drug!.strength}\nStatus: ${cfg.label}\nNAFDAC: ${drug!.nafdacNumber}\nBatch: ${drug!.batchNumber}\nVerified by Aharrie Strategy`;
    if (navigator.share) {
      await navigator.share({ title: "Drug Verification", text });
    } else {
      await navigator.clipboard.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ background: "var(--card-bg)", borderBottom: "1px solid var(--border)" }}>
          <button onClick={() => router.push("/scan")}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }} aria-label="Back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--t1)" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <span className="text-[15px] font-medium" style={{ color: "var(--t1)" }}>{t("result_title")}</span>
          <button onClick={handleShare}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            {shared
              ? <ShieldCheck size={15} color="var(--green)" />
              : <Share2 size={15} color="var(--t1)" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6 pt-3 flex flex-col gap-3">
          {/* Hero status card with molecule */}
          <div className="rounded-2xl p-5" style={{ background: cfg.heroBg }}>
            <div className="flex items-center gap-4">
              {/* 3D Molecule */}
              <MoleculeCanvas width={90} height={90} scale={0.85} className="flex-shrink-0" />
              {/* Status */}
              <div className="flex-1 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{ background: cfg.iconBg }}>
                  <StatusIcon size={24} color={cfg.iconColor} />
                </div>
                <h2 className="text-[18px] font-bold mb-1" style={{ color: cfg.tc }}>{cfg.label}</h2>
                <p className="text-[12px] leading-relaxed" style={{ color: cfg.tc, opacity: 0.8 }}>{cfg.sub}</p>
              </div>
            </div>
          </div>

          {/* Drug info */}
          <div className="rounded-2xl p-4" style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
            <p className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: "var(--t3)" }}>
              {t("result_drug_info")}
            </p>
            {[
              ["Name",         `${drug.brandName} ${drug.form} ${drug.strength}`],
              ["Generic name", drug.genericName],
              ["Manufacturer", drug.manufacturer],
              ["NAFDAC No.",   drug.nafdacNumber],
              ["Batch No.",    drug.batchNumber],
              ["Expiry",       drug.expiryDate],
              ["Country",      drug.countryOfOrigin],
              ["Price range",  drug.priceRangeNGN],
            ].map(([label, value]) => (
              <InfoRow key={label} label={label} value={value} />
            ))}
          </div>

          {/* Verification checks */}
          <div className="rounded-2xl p-4" style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
            <p className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: "var(--t3)" }}>
              {t("result_verification")}
            </p>
            <InfoRow label="NAFDAC registration"
              value={drug.nafdacRegistered ? "Registered" : "Not registered"}
              color={drug.nafdacRegistered ? "#2E7D5A" : "var(--pink)"} />
            <InfoRow label="Database match" value={drug.databaseMatch}
              color={drug.status === "authentic" ? "#2E7D5A" : drug.status === "suspicious" ? "var(--amber)" : "var(--pink)"} />
            <InfoRow label="Recall status" value={drug.recallStatus}
              color={drug.recallStatus === "No recall" ? "#2E7D5A" : drug.recallStatus.includes("Expired") ? "var(--t3)" : "var(--pink)"} />
            {/* QR integrity bar */}
            <div className="flex justify-between items-center py-2">
              <span className="text-[13px]" style={{ color: "var(--t2)" }}>QR integrity</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${drug.qrIntegrity}%`,
                      background: drug.qrIntegrity >= 80 ? "#4A7C5E" : drug.qrIntegrity >= 40 ? "var(--amber)" : "var(--pink)",
                    }} />
                </div>
                <span className="text-[13px] font-medium"
                  style={{ color: drug.qrIntegrity >= 80 ? "#4A7C5E" : drug.qrIntegrity >= 40 ? "var(--amber)" : "var(--pink)" }}>
                  {drug.qrIntegrity}%
                </span>
              </div>
            </div>
          </div>

          <p className="text-center text-[12px]" style={{ color: "var(--t3)" }}>
            Verified at {new Date(drug.verifiedAt).toLocaleTimeString()}
          </p>

          {/* Action buttons */}
          <div className="flex gap-2.5">
            <button onClick={() => router.push("/scan")}
              className="flex-1 flex items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-medium cursor-pointer"
              style={{ background: "var(--card-bg)", border: "1px solid var(--border)", color: "var(--t1)" }}>
              <RotateCcw size={15} />{t("result_scan_again")}
            </button>
            <button onClick={() => router.push("/report")}
              className="flex-1 flex items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-medium text-white cursor-pointer"
              style={{ background: "var(--green)" }}>
              <Flag size={15} color="white" />{t("result_report")}
            </button>
          </div>

          {/* NAFDAC report CTA for bad drugs */}
          {(drug.status === "counterfeit" || drug.status === "suspicious") && (
            <button onClick={() => router.push("/report")}
              className="flex items-center justify-between w-full rounded-xl px-4 py-3 cursor-pointer border-none"
              style={{ background: "var(--pink-bg)" }}>
              <div className="flex items-center gap-2.5">
                <Flag size={16} color="var(--pink)" />
                <div className="text-left">
                  <p className="text-[13px] font-semibold" style={{ color: "#791F1F" }}>{t("result_report_nafdac")}</p>
                  <p className="text-[11px]" style={{ color: "var(--pink)" }}>{t("result_report_sub")}</p>
                </div>
              </div>
              <ChevronRight size={16} color="var(--pink)" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
