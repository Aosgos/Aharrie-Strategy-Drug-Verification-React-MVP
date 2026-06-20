"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Flashlight, FlashlightOff, Keyboard, ChevronDown, ChevronUp, Search } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/lib/api";
import { DrugResult } from "@/types";

const DEMO_DRUGS = [
  // Authentic
  { id:"04-3275-CTBN-240601", label:"Coartem 20mg/120mg",          detail:"04-3275 · CTBN-240601",  status:"authentic"   },
  { id:"04-8969-LNRT-240815", label:"Lonart 80mg/480mg",           detail:"04-8969 · LNRT-240815",  status:"authentic"   },
  { id:"04-2508-AMXL-241105", label:"Amoxil 500mg",                detail:"04-2508 · AMXL-241105",  status:"authentic"   },
  { id:"04-3327-EMZX-241220", label:"Emzimox 500mg",               detail:"04-3327 · EMZX-241220",  status:"authentic"   },
  { id:"04-0411-EMZP-241001", label:"Emzor Paracetamol 500mg",     detail:"04-0411 · EMZP-241001",  status:"authentic"   },
  { id:"04-0005-PNDL-241108", label:"Panadol Extra 500mg/30mg",    detail:"04-0005 · PNDL-241108",  status:"authentic"   },
  { id:"04-6233-GCPG-240901", label:"Glucophage 500mg",            detail:"04-6233 · GCPG-240901",  status:"authentic"   },
  { id:"A4-5509-NRVS-241201", label:"Norvasc 5mg",                 detail:"A4-5509 · NRVS-241201",  status:"authentic"   },
  { id:"04-5021-CPTB-241015", label:"Ciprotab 500mg",              detail:"04-5021 · CPTB-241015",  status:"authentic"   },
  { id:"04-1233-FLGY-240720", label:"Flagyl 400mg",                detail:"04-1233 · FLGY-240720",  status:"authentic"   },
  { id:"04-3009-VNTL-241201", label:"Ventolin 100mcg",             detail:"04-3009 · VNTL-241201",  status:"authentic"   },
  { id:"A4-9301-TLD-241005",  label:"TLD 300/300/50mg",            detail:"A4-9301 · TLD-241005",   status:"authentic"   },
  // Suspicious
  { id:"04-3275-FAKE-240301", label:"Coartem (Unverified)",        detail:"04-3275 · FAKE-240301",  status:"suspicious"  },
  { id:"04-6233-SUSP-240501", label:"Metformin (Unverified)",      detail:"04-6233 · SUSP-240501",  status:"suspicious"  },
  // Counterfeit
  { id:"NONE-LG-2024-881",   label:"Paracetamol (FAKE)",          detail:"NOT FOUND · LG-2024-881",status:"counterfeit" },
  { id:"NONE-FAKE-LON-2024", label:"Lonart (FAKE)",               detail:"NOT FOUND · FAKE-LON",   status:"counterfeit" },
  // Expired
  { id:"04-3275-CTBN-211001", label:"Coartem (Expired)",           detail:"04-3275 · CTBN-211001",  status:"expired"     },
];

const groups = [
  { label:"Authentic",   status:"authentic",   color:"#4A7C5E", bg:"rgba(74,124,94,.15)"   },
  { label:"Suspicious",  status:"suspicious",  color:"#C07A1A", bg:"rgba(192,122,26,.13)"  },
  { label:"Counterfeit", status:"counterfeit", color:"#D4607A", bg:"rgba(212,96,122,.13)"  },
  { label:"Expired",     status:"expired",     color:"#7A7875", bg:"rgba(122,120,117,.13)" },
];

export default function ScanPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [loading,   setLoading]   = useState(false);
  const [torch,     setTorch]     = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>("Authentic");
  const [query,     setQuery]     = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return groups.map(g => ({ ...g, drugs: DEMO_DRUGS.filter(d => d.status === g.status) }));
    return groups.map(g => ({
      ...g,
      drugs: DEMO_DRUGS.filter(d => d.status === g.status && (d.label.toLowerCase().includes(q) || d.detail.toLowerCase().includes(q))),
    })).filter(g => g.drugs.length > 0);
  }, [query]);

  async function scan(id: string) {
    if (loading) return;
    setLoading(true);
    try {
      const result = await api.verify.byCode(id, token) as DrugResult;
      sessionStorage.setItem("aharrie_result", JSON.stringify(result));
      router.push("/result");
    } catch { router.push("/result"); }
    finally { setLoading(false); }
  }

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto" style={{ background:"#0D0D0D" }}>
      <div className="flex items-center justify-between px-4 pt-12 pb-2">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 border-none flex items-center justify-center cursor-pointer" aria-label="Go back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <span className="text-white text-[15px] font-medium">Scan QR code</span>
        <button onClick={() => setTorch(!torch)} className="w-9 h-9 rounded-full bg-white/10 border-none flex items-center justify-center cursor-pointer">
          {torch ? <FlashlightOff size={18} color="white" /> : <Flashlight size={18} color="white" />}
        </button>
      </div>

      <div className="flex justify-center py-5">
        <div className="relative w-52 h-52">
          {[{ t:0,l:0,bt:"3px 0 0 3px" },{ t:0,r:0,bt:"3px 3px 0 0" },{ b:0,l:0,bt:"0 0 3px 3px" },{ b:0,r:0,bt:"0 3px 3px 0" }].map((c,i) => (
            <div key={i} style={{ position:"absolute", width:28, height:28, ...c, border:"3px solid #1DCA8E", borderWidth: i===0?"3px 0 0 3px":i===1?"3px 3px 0 0":i===2?"0 0 3px 3px":"0 3px 3px 0" }} />
          ))}
          <div className="scan-line absolute left-2 right-2 h-0.5 bg-[#1DCA8E] opacity-80" />
          {loading && <div className="absolute inset-0 flex items-center justify-center bg-black/70"><div className="w-8 h-8 border-2 border-[#1DCA8E] border-t-transparent rounded-full spinner" /></div>}
        </div>
      </div>

      <div className="flex justify-around px-4 pb-3">
        {[{ l:"Total", v:DEMO_DRUGS.length, c:"#8AA398" },{ l:"Auth", v:DEMO_DRUGS.filter(d=>d.status==="authentic").length, c:"#4A7C5E" },{ l:"Susp", v:2, c:"#C07A1A" },{ l:"Fake", v:2, c:"#D4607A" },{ l:"Exp", v:1, c:"#7A7875" }].map(({ l, v, c }) => (
          <div key={l} className="text-center">
            <div className="text-[15px] font-semibold" style={{ color:c }}>{v}</div>
            <div className="text-[10px]" style={{ color:"rgba(255,255,255,.35)" }}>{l}</div>
          </div>
        ))}
      </div>

      <div className="px-4 mb-3 relative">
        <Search size={14} color="rgba(255,255,255,.4)" className="absolute left-7 top-1/2 -translate-y-1/2" />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search drug, NAFDAC no…"
          className="w-full pl-8 pr-4 py-2 rounded-xl text-white text-[12px] placeholder:text-white/30 outline-none"
          style={{ background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.1)" }} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col gap-2.5">
        {filtered.map(({ label, color, bg, drugs }) => (
          <div key={label} className="rounded-[14px] overflow-hidden" style={{ background:bg, border:"1px solid rgba(255,255,255,.06)" }}>
            <button onClick={() => setOpenGroup(openGroup === label ? null : label)}
              className="w-full flex items-center justify-between px-4 py-3 bg-transparent border-none cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background:color }} />
                <span className="text-[13px] font-semibold text-white">{label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px]" style={{ color }}>{drugs.length} drugs</span>
                {openGroup === label ? <ChevronUp size={14} color={color} /> : <ChevronDown size={14} color={color} />}
              </div>
            </button>
            {openGroup === label && (
              <div className="px-3 pb-3 flex flex-col gap-1.5 max-h-64 overflow-y-auto">
                {drugs.map(d => (
                  <button key={d.id} onClick={() => scan(d.id)} disabled={loading}
                    className="w-full rounded-xl px-3 py-2 text-left flex items-center justify-between gap-2 border-none cursor-pointer disabled:opacity-50 transition-colors"
                    style={{ background:"rgba(0,0,0,.25)" }}>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium text-white truncate">{d.label}</p>
                      <p className="text-[10px] truncate" style={{ color:"rgba(255,255,255,.4)" }}>{d.detail}</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <button onClick={() => router.push("/manual")} className="flex items-center justify-center gap-2 py-2 border-none bg-transparent cursor-pointer" style={{ color:"rgba(255,255,255,.35)", fontSize:12 }}>
          <Keyboard size={14} color="rgba(255,255,255,.35)" />Enter batch number manually
        </button>
      </div>
    </div>
  );
}
