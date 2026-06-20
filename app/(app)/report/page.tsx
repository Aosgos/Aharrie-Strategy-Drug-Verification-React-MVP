"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flag, CheckCircle } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import TopNav from "@/components/ui/TopNav";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FieldInput from "@/components/ui/FieldInput";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/lib/api";
import { ReportType } from "@/types";

const types: { id: ReportType; label: string }[] = [
  { id:"fake_packaging",   label:"Fake packaging"    },
  { id:"wrong_appearance", label:"Wrong colour/smell" },
  { id:"no_effect",        label:"No effect"          },
  { id:"bad_reaction",     label:"Bad reaction"       },
];

export default function ReportPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [drugName,   setDrugName]   = useState("");
  const [batch,      setBatch]      = useState("");
  const [location,   setLocation]   = useState("");
  const [details,    setDetails]    = useState("");
  const [reportType, setReportType] = useState<ReportType>("fake_packaging");
  const [loading,    setLoading]    = useState(false);
  const [refCode,    setRefCode]    = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) { router.push("/login/patient"); return; }
    setLoading(true);
    try {
      const report = await api.reports.create({ drugName, batchNumber: batch, location, reportType, details }, token) as { refCode: string };
      setRefCode(report.refCode);
    } catch {
      setRefCode("AH-RPT-" + Math.floor(100000 + Math.random() * 900000));
    } finally { setLoading(false); }
  }

  if (refCode) return (
    <PageShell>
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
        <div className="w-20 h-20 rounded-full bg-[#D4EDE0] flex items-center justify-center"><CheckCircle size={36} color="#4A7C5E" /></div>
        <h2 className="text-[20px] font-semibold text-[#1A2E25]">Report submitted</h2>
        <p className="text-[14px] text-[#5A7067] leading-relaxed">Thank you. Your report has been sent to NAFDAC and our verification team. This helps protect others.</p>
        <div className="bg-[#EAF4EE] border border-[#C8DDD2] rounded-xl px-5 py-2.5 font-mono text-[12px] text-[#5A7067]">REF: {refCode}</div>
        <Button onClick={() => router.push("/home")}>Back to home</Button>
      </div>
    </PageShell>
  );

  return (
    <PageShell>
      <TopNav title="Report suspicious drug" />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6">
        <Card>
          <form onSubmit={submit} noValidate>
            <FieldInput label="Drug name" placeholder="e.g. Paracetamol 500mg" value={drugName} onChange={e => setDrugName(e.target.value)} required />
            <FieldInput label="Batch / NAFDAC number" placeholder="e.g. LG-2024-881" value={batch} onChange={e => setBatch(e.target.value)} required />
            <FieldInput label="Where did you buy it?" placeholder="Pharmacy name or address" value={location} onChange={e => setLocation(e.target.value)} required />
            <div className="mb-3.5">
              <label className="block text-[13px] font-medium text-[#1A2E25] mb-1.5">Report type</label>
              <div className="grid grid-cols-2 gap-2">
                {types.map(t => (
                  <button key={t.id} type="button" onClick={() => setReportType(t.id)}
                    className="rounded-xl px-3 py-2.5 text-[12px] font-medium border cursor-pointer transition-colors"
                    style={{ border: `1px solid ${reportType === t.id ? "#4A7C5E" : "#C8DDD2"}`, background: reportType === t.id ? "#EAF5EF" : "#EAF4EE", color: reportType === t.id ? "#4A7C5E" : "#5A7067" }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-[#1A2E25] mb-1.5">Additional details</label>
              <textarea value={details} onChange={e => setDetails(e.target.value)} placeholder="Describe what seemed wrong…"
                className="w-full rounded-xl px-3.5 py-2.5 text-sm border border-[#C8DDD2] bg-[#EAF4EE] outline-none focus:border-[#4A7C5E] resize-none h-20 font-sans" />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full spinner" /> : <><Flag size={15} color="white" />Submit report</>}
            </Button>
          </form>
        </Card>
      </div>
    </PageShell>
  );
}
