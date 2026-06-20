"use client";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import TopNav from "@/components/ui/TopNav";
import { useAuth } from "@/lib/AuthContext";
import { SubscriptionPlan } from "@/types";

const plans = [
  { id: "basic" as SubscriptionPlan, name:"Basic", price:"₦5,000", period:"/month", desc:"For individual pharmacists", features:["Unlimited drug verification","NAFDAC database access","Counterfeit reporting","Verified pharmacist badge"], featured:false },
  { id: "professional" as SubscriptionPlan, name:"Professional", price:"₦15,000", period:"/month", desc:"For pharmacies and dispensaries", features:["Everything in Basic","Bulk QR verification","Dispensing records & audit log","Analytics dashboard","Patient-facing trust badge"], featured:true },
  { id: "enterprise" as SubscriptionPlan, name:"Enterprise", price:"Custom", period:"pricing", desc:"Hospital chains & distributors", features:["Everything in Professional","API & EHR integration","Multi-branch management","Dedicated NAFDAC liaison"], featured:false },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const { updatePlan } = useAuth();

  function select(plan: SubscriptionPlan) {
    updatePlan(plan);
    router.push("/dashboard");
  }

  return (
    <PageShell>
      <TopNav title="Choose a Plan" backHref="/login/pharmacist" />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6 pt-2 flex flex-col gap-3">
        <p className="text-[13px] text-[#5A7067] text-center">All plans include unlimited drug verification. Upgrade anytime.</p>
        {plans.map(p => (
          <div key={p.id} className="relative bg-white rounded-2xl p-5 cursor-pointer hover:border-[#4A7C5E] transition-colors"
            style={{ boxShadow:"0 2px 14px rgba(74,124,94,0.09)", border: p.featured ? "2px solid #4A7C5E" : "1.5px solid #C8DDD2" }}
            onClick={() => select(p.id)}>
            {p.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4A7C5E] text-white text-[11px] font-medium px-3.5 py-1 rounded-full whitespace-nowrap">Most popular</span>}
            <h3 className="text-[15px] font-semibold text-[#1A2E25] mb-0.5">{p.name}</h3>
            <div className="text-[22px] font-semibold text-[#4A7C5E] mb-0.5">{p.price} <span className="text-[13px] font-normal text-[#5A7067]">{p.period}</span></div>
            <p className="text-[12px] text-[#5A7067] mb-3">{p.desc}</p>
            <ul className="flex flex-col gap-1.5 mb-4">
              {p.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-[12px] text-[#1A2E25]">
                  <Check size={14} color="#4A7C5E" className="flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
            <button className="w-full bg-[#4A7C5E] text-white rounded-full py-3 text-[14px] font-medium hover:bg-[#2E5C42] transition-colors">
              {p.id === "enterprise" ? "Contact sales" : "Get started"}
            </button>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
