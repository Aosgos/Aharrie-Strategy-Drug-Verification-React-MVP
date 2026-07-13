"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { FlashlightOff, Flashlight, Keyboard, ChevronDown, ChevronUp, Search } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/lib/api";
import { DrugResult } from "@/types";
import { useStreak } from "@/context/StreakContext";
import { useI18n } from "@/context/I18nContext";
import { MilestoneCelebration } from "@/components/ui/StreakDisplay";
import { Scanner3D } from "@/components/ui/Scanner3D";

const QRScanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((m) => m.Scanner),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#1DCA8E] border-t-transparent rounded-full animate-spin" /></div> }
);

const DEMO_DRUGS = [
  { id:"04-3275-CTBN-240601", label:"Coartem 20mg/120mg",       detail:"04-3275 · Authentic",    status:"authentic"   },
  { id:"04-2508-AMXL-241105", label:"Amoxil 500mg",             detail:"04-2508 · Authentic",    status:"authentic"   },
  { id:"04-0411-EMZP-241001", label:"Emzor Paracetamol 500mg",  detail:"04-0411 · Authentic",    status:"authentic"   },
  { id:"04-6233-GCPG-240901", label:"Glucophage 500mg",         detail:"04-6233 · Authentic",    status:"authentic"   },
  { id:"A4-5509-NRVS-241201", label:"Norvasc 5mg",              detail:"A4-5509 · Authentic",    status:"authentic"   },
  { id:"04-5021-CPTB-241015", label:"Ciprotab 500mg",           detail:"04-5021 · Authentic",    status:"authentic"   },
  { id:"A4-9301-TLD-241005",  label:"TLD 300/300/50mg",         detail:"A4-9301 · Authentic",    status:"authentic"   },
  { id:"04-3275-FAKE-240301", label:"Coartem (Unverified)",     detail:"04-3275 · Suspicious",   status:"suspicious"  },
  { id:"04-6233-SUSP-240501", label:"Metformin (Unverified)",   detail:"04-6233 · Suspicious",   status:"suspicious"  },
  { id:"NONE-LG-2024-881",    label:"Paracetamol (FAKE)",       detail:"NOT FOUND · Counterfeit",status:"counterfeit" },
  { id:"NONE-FAKE-LON-2024",  label:"Lonart (FAKE)",            detail:"NOT FOUND · Counterfeit",status:"counterfeit" },
  { id:"04-3275-CTBN-211001", label:"Coartem (Expired)",        detail:"04-3275 · Expired",      status:"expired"     },
];

const GROUPS = [
  { label: "Authentic",   status:"authentic",   color:"#1DCA8E", bg:"rgba(29,202,142,.1)"   },
  { label: "Suspicious",  status:"suspicious",  color:"#C07A1A", bg:"rgba(192,122,26,.1)"   },
  { label: "Counterfeit", status:"counterfeit", color:"#D4607A", bg:"rgba(212,96,122,.1)"   },
  { label: "Expired",     status:"expired",     color:"#7A7875", bg:"rgba(122,120,117,.1)"  },
];

type ScanMode   = "camera" | "demo";
type ScanState  = "idle" | "scanning" | "success" | "error";

export default function ScanPage() {
  const router   = useRouter();
  const { token } = useAuth();
  const { increment, streak } = useStreak();
  const { t } = useI18n();

  const [mode,      setMode]      = useState<ScanMode>("camera");
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [torch,     setTorch]     = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [camError,  setCamError]  = useState("");
  const [openGroup, setOpenGroup] = useState<string | null>("Authentic");
  const [query,     setQuery]     = useState("");
  const [scanned,   setScanned]   = useState(false);
  const [celebrateMilestone, setCelebrateMilestone] = useState<number | null>(null);

  useEffect(() => { setScanned(false); setScanState("idle"); }, []);

  async function handleScan(codes: { rawValue: string }[]) {
    if (loading || scanned || !codes.length) return;
    const code = codes[0].rawValue?.trim();
    if (!code) return;
    setScanned(true);
    setScanState("scanning");
    await verify(code);
  }

  async function handleDemo(id: string) {
    if (loading) return;
    setScanState("scanning");
    await verify(id);
  }

  async function verify(code: string) {
    setLoading(true);
    const prevCount = streak.milestones.length;
    try {
      const result = await api.verify.byCode(code, token) as DrugResult;
      sessionStorage.setItem("aharrie_result", JSON.stringify(result));
      setScanState("success");
      await new Promise(r => setTimeout(r, 700)); // show success animation
    } catch {
      setScanState("error");
      const fallback: Partial<DrugResult> = {
        brandName: "Unknown drug", genericName: "Unknown",
        nafdacNumber: "Not found", batchNumber: code,
        status: "unregistered", nafdacRegistered: false,
        qrIntegrity: 0, databaseMatch: "No record in NAFDAC database",
        recallStatus: "Unknown", verifiedAt: new Date().toISOString(),
        category: "", strength: "", form: "", manufacturer: "",
        countryOfOrigin: "", expiryDate: "Unknown", priceRangeNGN: "",
      };
      sessionStorage.setItem("aharrie_result", JSON.stringify(fallback));
      await new Promise(r => setTimeout(r, 600));
    } finally {
      setLoading(false);
    }
    const updated = increment(true);
    if (updated.milestones.length > prevCount) {
      setCelebrateMilestone(updated.milestones[updated.milestones.length - 1]);
    } else {
      router.push("/result");
    }
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return GROUPS.map(g => ({
      ...g,
      drugs: DEMO_DRUGS.filter(d =>
        d.status === g.status &&
        (!q || d.label.toLowerCase().includes(q) || d.detail.toLowerCase().includes(q))
      ),
    })).filter(g => g.drugs.length > 0);
  }, [query]);

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto" style={{ background: "#0D0D0D" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3 flex-shrink-0">
        <button onClick={() => router.back()} aria-label="Go back"
          className="w-9 h-9 rounded-full bg-white/10 border-none flex items-center justify-center cursor-pointer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <span className="text-white text-[15px] font-medium">{t("scan_title")}</span>
        {mode === "camera"
          ? <button onClick={() => setTorch(!torch)} aria-label="Toggle torch"
              className="w-9 h-9 rounded-full bg-white/10 border-none flex items-center justify-center cursor-pointer">
              {torch ? <FlashlightOff size={18} color="white" /> : <Flashlight size={18} color="white" />}
            </button>
          : <div className="w-9" />}
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 px-4 pb-3 flex-shrink-0">
        {(["camera","demo"] as ScanMode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); setCamError(""); setScanned(false); setScanState("idle"); }}
            className="flex-1 py-2 rounded-full text-[12px] font-medium border-none cursor-pointer capitalize transition-colors"
            style={{ background: mode === m ? "#1DCA8E" : "rgba(255,255,255,.1)", color: mode === m ? "#000" : "rgba(255,255,255,.6)" }}>
            {m === "camera" ? `📷 ${t("scan_camera")}` : `🔬 ${t("scan_demo")}`}
          </button>
        ))}
      </div>

      {/* Camera viewfinder */}
      {mode === "camera" && (
        <div className="flex flex-col items-center px-4 mb-2 flex-shrink-0">
          <div className="relative w-[220px] h-[220px] rounded-2xl overflow-hidden" style={{ background: "#111" }}>
            {camError
              ? <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-6 text-center">
                  <p className="text-[13px] text-white/50 leading-relaxed">{camError}</p>
                  <button onClick={() => { setCamError(""); setScanState("idle"); setScanned(false); }}
                    className="text-[12px] text-[#1DCA8E] bg-transparent border-none cursor-pointer">
                    Try again
                  </button>
                </div>
              : !loading && (
                <QRScanner
                  onScan={handleScan}
                  onError={(err) => {
                    const msg = err instanceof Error ? err.message : String(err);
                    setCamError(msg.toLowerCase().includes("permission")
                      ? "Camera permission denied. Allow camera access in browser settings, then tap 'Try again'."
                      : "Camera error: " + msg);
                  }}
                  constraints={{ facingMode: "environment" }}
                  formats={["qr_code"]}
                  components={{ torch, finder: false }}
                  styles={{ container: { width:"100%", height:"100%", position:"relative" }, video: { width:"100%", height:"100%", objectFit:"cover" } }}
                />
              )}
          </div>
          {/* 3D scanner overlay rendered separately (CSS positioned) */}
          <div style={{ marginTop: -220, pointerEvents: "none" }}>
            <Scanner3D state={scanState} />
          </div>
          {!camError && (
            <p className="text-[12px] text-white/40 text-center mt-4">
              {t("scan_instruction")}
            </p>
          )}
        </div>
      )}

      {/* Demo list */}
      {mode === "demo" && (
        <>
          <div className="px-4 mb-3 relative flex-shrink-0">
            <Search size={14} color="rgba(255,255,255,.4)" className="absolute left-7 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search drug name…"
              className="w-full pl-8 pr-4 py-2 rounded-xl text-white text-[12px] placeholder:text-white/30 outline-none"
              style={{ background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.1)" }} />
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2.5">
            {filtered.map(({ label, color, bg, drugs }) => (
              <div key={label} className="rounded-[14px] overflow-hidden"
                style={{ background:bg, border:"1px solid rgba(255,255,255,.06)" }}>
                <button onClick={() => setOpenGroup(openGroup === label ? null : label)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-transparent border-none cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background:color }} />
                    <span className="text-[13px] font-semibold text-white">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px]" style={{ color }}>{drugs.length}</span>
                    {openGroup === label ? <ChevronUp size={14} color={color} /> : <ChevronDown size={14} color={color} />}
                  </div>
                </button>
                {openGroup === label && (
                  <div className="px-3 pb-3 flex flex-col gap-1.5 max-h-64 overflow-y-auto">
                    {drugs.map(d => (
                      <button key={d.id} onClick={() => handleDemo(d.id)} disabled={loading}
                        className="w-full rounded-xl px-3 py-2 text-left flex items-center justify-between gap-2 border-none cursor-pointer disabled:opacity-50"
                        style={{ background:"rgba(0,0,0,.25)" }}>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-medium text-white truncate">{d.label}</p>
                          <p className="text-[10px] truncate" style={{ color:"rgba(255,255,255,.4)" }}>{d.detail}</p>
                        </div>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Manual link */}
      <button onClick={() => router.push("/manual")}
        className="flex items-center justify-center gap-2 py-3 border-none bg-transparent cursor-pointer flex-shrink-0"
        style={{ color:"rgba(255,255,255,.35)", fontSize:12 }}>
        <Keyboard size={14} color="rgba(255,255,255,.35)" />
        {t("scan_manual")}
      </button>

      {celebrateMilestone !== null && (
        <MilestoneCelebration
          milestone={celebrateMilestone}
          onClose={() => { setCelebrateMilestone(null); router.push("/result"); }}
        />
      )}
    </div>
  );
}
