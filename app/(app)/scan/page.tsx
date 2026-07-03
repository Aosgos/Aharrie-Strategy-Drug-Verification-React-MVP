"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Flashlight, FlashlightOff, Keyboard,
  ChevronDown, ChevronUp, Search, CameraOff,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/lib/api";
import { DrugResult } from "@/types";
import { useStreak } from "@/context/StreakContext";
import { MilestoneCelebration } from "@/components/ui/StreakDisplay";

// ── Dynamically import the scanner so it never runs on the server ────────────
// (camera APIs are browser-only; Next.js would crash trying to SSR them)
const Scanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((m) => m.Scanner),
  { ssr: false, loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#1DCA8E] border-t-transparent rounded-full animate-spin" />
    </div>
  )}
);

// ── Demo drug list (for testing without a physical QR code) ──────────────────
const DEMO_DRUGS = [
  { id:"04-3275-CTBN-240601", label:"Coartem 20mg/120mg",       detail:"04-3275 · CTBN-240601",  status:"authentic"   },
  { id:"04-8969-LNRT-240815", label:"Lonart 80mg/480mg",        detail:"04-8969 · LNRT-240815",  status:"authentic"   },
  { id:"04-2508-AMXL-241105", label:"Amoxil 500mg",             detail:"04-2508 · AMXL-241105",  status:"authentic"   },
  { id:"04-0411-EMZP-241001", label:"Emzor Paracetamol 500mg",  detail:"04-0411 · EMZP-241001",  status:"authentic"   },
  { id:"04-6233-GCPG-240901", label:"Glucophage 500mg",         detail:"04-6233 · GCPG-240901",  status:"authentic"   },
  { id:"A4-5509-NRVS-241201", label:"Norvasc 5mg",              detail:"A4-5509 · NRVS-241201",  status:"authentic"   },
  { id:"04-5021-CPTB-241015", label:"Ciprotab 500mg",           detail:"04-5021 · CPTB-241015",  status:"authentic"   },
  { id:"04-1233-FLGY-240720", label:"Flagyl 400mg",             detail:"04-1233 · FLGY-240720",  status:"authentic"   },
  { id:"A4-9301-TLD-241005",  label:"TLD 300/300/50mg",         detail:"A4-9301 · TLD-241005",   status:"authentic"   },
  { id:"04-3275-FAKE-240301", label:"Coartem (Unverified)",     detail:"04-3275 · FAKE-240301",  status:"suspicious"  },
  { id:"04-6233-SUSP-240501", label:"Metformin (Unverified)",   detail:"04-6233 · SUSP-240501",  status:"suspicious"  },
  { id:"NONE-LG-2024-881",    label:"Paracetamol (FAKE)",       detail:"NOT FOUND · LG-2024-881",status:"counterfeit" },
  { id:"NONE-FAKE-LON-2024",  label:"Lonart (FAKE)",            detail:"NOT FOUND · FAKE-LON",   status:"counterfeit" },
  { id:"04-3275-CTBN-211001", label:"Coartem (Expired)",        detail:"04-3275 · CTBN-211001",  status:"expired"     },
];

const GROUPS = [
  { label:"Authentic",   status:"authentic",   color:"#4A7C5E", bg:"rgba(74,124,94,.15)"   },
  { label:"Suspicious",  status:"suspicious",  color:"#C07A1A", bg:"rgba(192,122,26,.13)"  },
  { label:"Counterfeit", status:"counterfeit", color:"#D4607A", bg:"rgba(212,96,122,.13)"  },
  { label:"Expired",     status:"expired",     color:"#7A7875", bg:"rgba(122,120,117,.13)" },
];

type ScanMode = "camera" | "demo";

export default function ScanPage() {
  const router = useRouter();
  const { token } = useAuth();
  const { increment, streak } = useStreak();

  const [mode,       setMode]       = useState<ScanMode>("camera");
  const [torch,      setTorch]      = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [camError,   setCamError]   = useState("");
  const [openGroup,  setOpenGroup]  = useState<string | null>("Authentic");
  const [query,      setQuery]      = useState("");
  const [scanned,    setScanned]    = useState(false); // prevent duplicate triggers
  const [celebrateMilestone, setCelebrateMilestone] = useState<number | null>(null);

  // Reset scanned flag between navigations
  useEffect(() => { setScanned(false); }, []);

  // ── Handle a real QR code from the camera ──────────────────────────────────
  async function handleScan(codes: { rawValue: string }[]) {
    if (loading || scanned || !codes.length) return;
    const code = codes[0].rawValue;
    if (!code?.trim()) return;
    setScanned(true);
    await verify(code);
  }

  // ── Handle a demo drug tap ─────────────────────────────────────────────────
  async function handleDemo(id: string) {
    if (loading) return;
    await verify(id);
  }

  // ── Shared verification ────────────────────────────────────────────────────
  async function verify(code: string) {
    setLoading(true);
    const prevMilestones = streak.milestones.length;
    let result: DrugResult | null = null;
    try {
      result = await api.verify.byCode(code, token) as DrugResult;
      sessionStorage.setItem("aharrie_result", JSON.stringify(result));
    } catch {
      // Even if the API fails, still navigate to result — it'll show "Unregistered"
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
    } finally {
      setLoading(false);
    }

    // Every successful verification (real or fallback) counts toward the streak —
    // it reflects genuine engagement with checking a medication's authenticity.
    const updated = increment(true);

    if (updated.milestones.length > prevMilestones) {
      // New milestone just unlocked — celebrate before moving on
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
    <div className="flex flex-col min-h-screen max-w-md mx-auto" style={{ background:"#0D0D0D" }}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3 flex-shrink-0">
        <button onClick={() => router.back()} aria-label="Go back"
          className="w-9 h-9 rounded-full bg-white/10 border-none flex items-center justify-center cursor-pointer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <span className="text-white text-[15px] font-medium">Scan QR code</span>
        {mode === "camera"
          ? <button onClick={() => setTorch(!torch)} aria-label="Toggle torch"
              className="w-9 h-9 rounded-full bg-white/10 border-none flex items-center justify-center cursor-pointer">
              {torch ? <FlashlightOff size={18} color="white" /> : <Flashlight size={18} color="white" />}
            </button>
          : <div className="w-9" />}
      </div>

      {/* ── Mode toggle ───────────────────────────────────────────────────── */}
      <div className="flex gap-2 px-4 pb-3 flex-shrink-0">
        {(["camera","demo"] as ScanMode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); setCamError(""); setScanned(false); }}
            className="flex-1 py-2 rounded-full text-[12px] font-medium border-none cursor-pointer capitalize transition-colors"
            style={{ background: mode === m ? "#1DCA8E" : "rgba(255,255,255,.1)", color: mode === m ? "#000" : "rgba(255,255,255,.6)" }}>
            {m === "camera" ? "📷 Camera scan" : "🔬 Test drugs"}
          </button>
        ))}
      </div>

      {/* ── Camera viewfinder ─────────────────────────────────────────────── */}
      {mode === "camera" && (
        <div className="mx-4 mb-3 rounded-2xl overflow-hidden flex-shrink-0 relative" style={{ height: 260, background:"#111" }}>
          {camError ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-6 text-center">
              <CameraOff size={32} color="rgba(255,255,255,.35)" />
              <p className="text-[13px] text-white/50 leading-relaxed">{camError}</p>
              <button onClick={() => { setCamError(""); setScanned(false); }}
                className="text-[12px] text-[#1DCA8E] bg-transparent border-none cursor-pointer">
                Try again
              </button>
            </div>
          ) : loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-[#1DCA8E] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <Scanner
              onScan={handleScan}
              onError={(err) => {
                const msg = err instanceof Error ? err.message : String(err);
                if (msg.toLowerCase().includes("permission") || msg.toLowerCase().includes("allowed")) {
                  setCamError("Camera permission denied. Please allow camera access in your browser settings, then tap 'Try again'.");
                } else if (msg.toLowerCase().includes("found") || msg.toLowerCase().includes("device")) {
                  setCamError("No camera found on this device.");
                } else {
                  setCamError("Camera error: " + msg);
                }
              }}
              constraints={{ facingMode: "environment" }}
              formats={["qr_code"]}
              components={{
                torch,
                finder: false, // we draw our own frame below
              }}
              styles={{
                container: { width:"100%", height:"100%", position:"relative" },
                video:     { width:"100%", height:"100%", objectFit:"cover" },
              }}
            />
          )}
          {/* Corner frame overlaid on the video */}
          {!camError && !loading && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-44 h-44">
                {[
                  "top-0 left-0 border-t-[3px] border-l-[3px]",
                  "top-0 right-0 border-t-[3px] border-r-[3px]",
                  "bottom-0 left-0 border-b-[3px] border-l-[3px]",
                  "bottom-0 right-0 border-b-[3px] border-r-[3px]",
                ].map((cls, i) => (
                  <div key={i} className={`absolute w-7 h-7 border-[#1DCA8E] ${cls}`} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "camera" && !camError && (
        <p className="text-[12px] text-white/40 text-center px-6 mb-3 flex-shrink-0">
          Point your camera at a drug package QR code — it scans automatically
        </p>
      )}

      {/* ── Demo drug list ────────────────────────────────────────────────── */}
      {mode === "demo" && (
        <>
          <div className="px-4 mb-3 relative flex-shrink-0">
            <Search size={14} color="rgba(255,255,255,.4)" className="absolute left-7 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search drug name, NAFDAC no…"
              className="w-full pl-8 pr-4 py-2 rounded-xl text-white text-[12px] placeholder:text-white/30 outline-none"
              style={{ background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.1)" }} />
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col gap-2.5">
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
                    <span className="text-[11px]" style={{ color }}>{drugs.length} drugs</span>
                    {openGroup === label
                      ? <ChevronUp size={14} color={color} />
                      : <ChevronDown size={14} color={color} />}
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
                        {loading
                          ? <div className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin flex-shrink-0" />
                          : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Manual entry link ─────────────────────────────────────────────── */}
      <button onClick={() => router.push("/manual")}
        className="flex items-center justify-center gap-2 py-3 border-none bg-transparent cursor-pointer flex-shrink-0"
        style={{ color:"rgba(255,255,255,.35)", fontSize:12 }}>
        <Keyboard size={14} color="rgba(255,255,255,.35)" />
        Enter batch number manually
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
