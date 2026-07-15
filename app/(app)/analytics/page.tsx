"use client";
import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis,
} from "recharts";
import { Scan, ShieldCheck, AlertTriangle, TrendingUp, BarChart3, PieChart as PieIcon, Activity, Target } from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";
import { useI18n } from "@/context/I18nContext";
import { useTheme } from "@/context/ThemeContext";

const WEEKLY = [
  { day:"Mon", authentic:30, suspicious:2, counterfeit:1, expired:1, total:34 },
  { day:"Tue", authentic:48, suspicious:2, counterfeit:1, expired:1, total:52 },
  { day:"Wed", authentic:38, suspicious:2, counterfeit:1, expired:0, total:41 },
  { day:"Thu", authentic:61, suspicious:3, counterfeit:2, expired:1, total:67 },
  { day:"Fri", authentic:54, suspicious:2, counterfeit:1, expired:1, total:58 },
  { day:"Sat", authentic:27, suspicious:1, counterfeit:1, expired:0, total:29 },
  { day:"Sun", authentic:44, suspicious:2, counterfeit:1, expired:0, total:47 },
];

const MONTHLY = [
  { month:"Jan", authentic:820, flagged:42 }, { month:"Feb", authentic:910, flagged:38 },
  { month:"Mar", authentic:870, flagged:51 }, { month:"Apr", authentic:960, flagged:33 },
  { month:"May", authentic:1020, flagged:45 },{ month:"Jun", authentic:1100, flagged:29 },
];

const PIE_DATA = [
  { name:"Authentic",   value:292, color:"#4A7C5E" },
  { name:"Suspicious",  value:22,  color:"#C07A1A"  },
  { name:"Counterfeit", value:8,   color:"#D4607A"  },
  { name:"Expired",     value:6,   color:"#7A7875"  },
];

const RADAR_DATA = [
  { subject:"Antimalarial", A:95, B:60 },
  { subject:"Antibiotic",   A:88, B:45 },
  { subject:"Diabetes",     A:92, B:30 },
  { subject:"Hypertension", A:85, B:25 },
  { subject:"Vitamins",     A:97, B:15 },
  { subject:"Respiratory",  A:89, B:20 },
];

const PERIODS = ["This week","This month","All time"];
type ChartTab = "bar" | "area" | "pie" | "radar";

function makeTooltip(isDark: boolean) {
  // eslint-disable-next-line react/display-name
  return function CustomTooltip({ active, payload, label }: {
    active?: boolean;
    // Use unknown[] to bypass recharts internal type variance issues at the call site
    payload?: unknown[];
    label?: string;
  }) {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-xl px-3 py-2 text-[11px]"
        style={{ background: isDark ? "#1A2D22" : "#fff", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
        <p className="font-semibold mb-1" style={{ color: "var(--t1)" }}>{label}</p>
        {(payload as { name?: string; value?: number; color?: string }[]).map((p, i) => (
          <p key={i} style={{ color: p.color ?? "var(--t1)" }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  };
}

export default function AnalyticsPage() {
  const { t } = useI18n();
  const { isDark } = useTheme();
  const [period, setPeriod] = useState(0);
  const [chartTab, setChartTab] = useState<ChartTab>("bar");

  const axisColor = isDark ? "#4A7060" : "#8AA398";
  const gridColor = isDark ? "#1E3D2F" : "#F0F5F2";

  const STAT_CARDS = [
    { icon: Scan,          label: t("analytics_scans"),    val: "328", color: "var(--green)", bg: "var(--green-lt)" },
    { icon: ShieldCheck,   label: t("analytics_authentic"), val: "292", color: "#2E7D5A",     bg: "var(--green-lt)" },
    { icon: AlertTriangle, label: t("analytics_flagged"),  val: "36",  color: "var(--pink)",  bg: "var(--pink-bg)"  },
    { icon: TrendingUp,    label: t("analytics_auth_rate"),val: "89%", color: "var(--green)", bg: "var(--green-lt)" },
  ];

  const CHART_TABS: { id: ChartTab; icon: typeof BarChart3; label: string }[] = [
    { id: "bar",   icon: BarChart3,  label: "Bar"   },
    { id: "area",  icon: Activity,   label: "Area"  },
    { id: "pie",   icon: PieIcon,    label: "Pie"   },
    { id: "radar", icon: Target,     label: "Radar" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
          <h1 className="text-[17px] font-semibold" style={{ color: "var(--t1)" }}>{t("analytics_title")}</h1>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4 flex flex-col gap-3">
          {/* Period selector */}
          <div className="flex gap-2">
            {PERIODS.map((p, i) => (
              <button key={p} onClick={() => setPeriod(i)}
                className="text-[12px] font-medium px-3.5 py-1.5 rounded-full border-none cursor-pointer transition-colors"
                style={{ background: period === i ? "var(--green)" : "var(--card-bg)", color: period === i ? "#fff" : "var(--t2)", boxShadow: period === i ? "none" : "var(--card-shadow)" }}>
                {p}
              </button>
            ))}
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-2.5">
            {STAT_CARDS.map(({ icon: Icon, label, val, color, bg }) => (
              <div key={label} className="rounded-[14px] p-4" style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2" style={{ background: bg }}>
                  <Icon size={16} color={color} />
                </div>
                <p className="text-[22px] font-semibold" style={{ color }}>{val}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--t2)" }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Chart type tabs */}
          <div className="flex gap-2">
            {CHART_TABS.map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => setChartTab(id)}
                className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border-none cursor-pointer transition-colors text-[10px] font-medium"
                style={{ background: chartTab === id ? "var(--green)" : "var(--card-bg)", color: chartTab === id ? "#fff" : "var(--t2)", boxShadow: "var(--card-shadow)" }}>
                <Icon size={16} color={chartTab === id ? "#fff" : "var(--t2)"} />
                {label}
              </button>
            ))}
          </div>

          {/* Bar chart */}
          {chartTab === "bar" && (
            <div className="rounded-2xl p-4" style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
              <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--t1)" }}>{t("analytics_daily")}</p>
              <p className="text-[11px] mb-4" style={{ color: "var(--t3)" }}>Breakdown by status</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={WEEKLY} barSize={10} barGap={2}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize:10, fill: axisColor }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={makeTooltip(isDark)} cursor={{ fill: "rgba(74,124,94,0.05)" }} />
                  <Legend wrapperStyle={{ fontSize:10, color: "var(--t2)" }} />
                  <Bar dataKey="authentic"   name="Authentic"   fill="#4A7C5E" radius={[4,4,0,0]} />
                  <Bar dataKey="suspicious"  name="Suspicious"  fill="#C07A1A" radius={[4,4,0,0]} />
                  <Bar dataKey="counterfeit" name="Counterfeit" fill="#D4607A" radius={[4,4,0,0]} />
                  <Bar dataKey="expired"     name="Expired"     fill="#7A7875" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Area chart */}
          {chartTab === "area" && (
            <div className="rounded-2xl p-4" style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
              <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--t1)" }}>Monthly trend</p>
              <p className="text-[11px] mb-4" style={{ color: "var(--t3)" }}>Authentic vs flagged over time</p>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={MONTHLY}>
                  <defs>
                    <linearGradient id="authGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#4A7C5E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4A7C5E" stopOpacity={0.01} />
                    </linearGradient>
                    <linearGradient id="flagGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#D4607A" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D4607A" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize:10, fill: axisColor }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={makeTooltip(isDark)} />
                  <Legend wrapperStyle={{ fontSize:10, color: "var(--t2)" }} />
                  <Area type="monotone" dataKey="authentic" name="Authentic" stroke="#4A7C5E" strokeWidth={2} fill="url(#authGrad)" />
                  <Area type="monotone" dataKey="flagged"   name="Flagged"   stroke="#D4607A" strokeWidth={2} fill="url(#flagGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Pie chart */}
          {chartTab === "pie" && (
            <div className="rounded-2xl p-4" style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
              <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--t1)" }}>Verification breakdown</p>
              <p className="text-[11px] mb-4" style={{ color: "var(--t3)" }}>Share of total 328 scans</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                    paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}>
                    {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={makeTooltip(isDark)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {PIE_DATA.map(({ name, color, value }) => (
                  <div key={name} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
                    <span className="text-[11px]" style={{ color: "var(--t2)" }}>{name}: {value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Radar chart */}
          {chartTab === "radar" && (
            <div className="rounded-2xl p-4" style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
              <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--t1)" }}>Authenticity by category</p>
              <p className="text-[11px] mb-4" style={{ color: "var(--t3)" }}>Auth rate (A) vs flag count (B) per drug category</p>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={RADAR_DATA}>
                  <PolarGrid stroke={gridColor} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize:10, fill: axisColor }} />
                  <Radar name="Auth rate" dataKey="A" stroke="#4A7C5E" fill="#4A7C5E" fillOpacity={0.25} />
                  <Radar name="Flags" dataKey="B" stroke="#D4607A" fill="#D4607A" fillOpacity={0.2} />
                  <Legend wrapperStyle={{ fontSize:10, color: "var(--t2)" }} />
                  <Tooltip content={makeTooltip(isDark)} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Most flagged drugs */}
          <div className="rounded-2xl p-4" style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
            <p className="text-[13px] font-semibold mb-3" style={{ color: "var(--t1)" }}>{t("analytics_top_flagged")}</p>
            {[
              { name:"Paracetamol 500mg",  count:8, pct:72, color:"#D4607A" },
              { name:"Coartem 80/480mg",   count:5, pct:45, color:"#C07A1A" },
              { name:"Artemether 20mg",    count:3, pct:27, color:"#4A7C5E" },
              { name:"Amoxicillin 500mg",  count:2, pct:18, color:"#7A7875" },
            ].map(({ name, count, pct, color }) => (
              <div key={name} className="mb-3 last:mb-0">
                <div className="flex justify-between mb-1">
                  <p className="text-[12px]" style={{ color: "var(--t1)" }}>{name}</p>
                  <p className="text-[12px] font-semibold" style={{ color }}>{count} flags</p>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width:`${pct}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <BottomNav role="pharmacist" />
      </div>
    </div>
  );
}
