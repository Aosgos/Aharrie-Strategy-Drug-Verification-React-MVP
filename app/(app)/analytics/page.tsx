"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Scan, ShieldCheck, AlertTriangle, TrendingUp } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import TopNav from "@/components/ui/TopNav";
import BottomNav from "@/components/ui/BottomNav";

const WEEKLY = [
  { day:"Mon", scans:34, authentic:30, flagged:4 },
  { day:"Tue", scans:52, authentic:48, flagged:4 },
  { day:"Wed", scans:41, authentic:38, flagged:3 },
  { day:"Thu", scans:67, authentic:61, flagged:6 },
  { day:"Fri", scans:58, authentic:54, flagged:4 },
  { day:"Sat", scans:29, authentic:27, flagged:2 },
  { day:"Sun", scans:47, authentic:44, flagged:3 },
];

const STAT_CARDS = [
  { icon: Scan,          label:"Total scans", val:"328", color:"#4A7C5E", bg:"#D4EDE0" },
  { icon: ShieldCheck,   label:"Authentic",   val:"292", color:"#2E7D5A", bg:"#D4EDE0" },
  { icon: AlertTriangle, label:"Flagged",     val:"36",  color:"#D4607A", bg:"#FFE8EC" },
  { icon: TrendingUp,    label:"Auth rate",   val:"89%", color:"#4A7C5E", bg:"#D4EDE0" },
];

const PERIODS = ["This week", "This month", "All time"];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState(0);

  return (
    <PageShell>
      <TopNav title="Analytics" backHref="/dashboard" />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4 flex flex-col gap-3">

        {/* Period selector */}
        <div className="flex gap-2">
          {PERIODS.map((p, i) => (
            <button key={p} onClick={() => setPeriod(i)}
              className="text-[12px] font-medium px-3.5 py-1.5 rounded-full border cursor-pointer transition-colors"
              style={{ background: period === i ? "#4A7C5E" : "white", color: period === i ? "white" : "#5A7067", borderColor: period === i ? "#4A7C5E" : "#C8DDD2" }}>
              {p}
            </button>
          ))}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {STAT_CARDS.map(({ icon: Icon, label, val, color, bg }) => (
            <div key={label} className="bg-white rounded-[14px] p-4" style={{ boxShadow:"0 2px 14px rgba(74,124,94,0.09)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2" style={{ background: bg }}>
                <Icon size={16} color={color} />
              </div>
              <p className="text-[22px] font-semibold" style={{ color }}>{val}</p>
              <p className="text-[11px] text-[#5A7067] mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow:"0 2px 14px rgba(74,124,94,0.09)" }}>
          <p className="text-[13px] font-semibold text-[#1A2E25] mb-1">Daily scans this week</p>
          <p className="text-[11px] text-[#8AA398] mb-4">Authentic vs flagged</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={WEEKLY} barSize={14} barGap={2}>
              <XAxis dataKey="day" tick={{ fontSize:10, fill:"#8AA398" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ fontSize:11, borderRadius:8, border:"1px solid #D4E8DC", background:"white" }}
                cursor={{ fill:"#F0F9F5" }}
              />
              <Bar dataKey="authentic" name="Authentic" fill="#4A7C5E" radius={[4,4,0,0]} />
              <Bar dataKey="flagged"   name="Flagged"   fill="#FFB3BE" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 justify-center mt-2">
            {[["#4A7C5E","Authentic"],["#FFB3BE","Flagged"]].map(([c,l]) => (
              <span key={l} className="flex items-center gap-1.5 text-[11px] text-[#5A7067]">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ background:c }} />{l}
              </span>
            ))}
          </div>
        </div>

        {/* Line chart */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow:"0 2px 14px rgba(74,124,94,0.09)" }}>
          <p className="text-[13px] font-semibold text-[#1A2E25] mb-1">Scan volume trend</p>
          <p className="text-[11px] text-[#8AA398] mb-4">Total scans per day</p>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={WEEKLY}>
              <CartesianGrid stroke="#F0F5F2" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize:10, fill:"#8AA398" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ fontSize:11, borderRadius:8, border:"1px solid #D4E8DC" }} />
              <Line type="monotone" dataKey="scans" name="Scans" stroke="#4A7C5E" strokeWidth={2.5}
                dot={{ fill:"#4A7C5E", r:3 }} activeDot={{ r:5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top flagged */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow:"0 2px 14px rgba(74,124,94,0.09)" }}>
          <p className="text-[13px] font-semibold text-[#1A2E25] mb-3">Most flagged drugs</p>
          {[["Paracetamol 500mg",8,72],["Coartem 80/480mg",5,45],["Artemether 20mg",3,27]].map(([name,count,pct]) => (
            <div key={name as string} className="mb-3 last:mb-0">
              <div className="flex justify-between mb-1">
                <p className="text-[12px] text-[#1A2E25]">{name}</p>
                <p className="text-[12px] font-semibold text-[#D4607A]">{count} flags</p>
              </div>
              <div className="h-1.5 bg-[#F0F5F2] rounded-full overflow-hidden">
                <div className="h-full bg-[#D4607A] rounded-full" style={{ width:`${pct}%` }} />
              </div>
            </div>
          ))}
        </div>

      </div>
      <BottomNav role="pharmacist" />
    </PageShell>
  );
}
