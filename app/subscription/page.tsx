"use client";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { SubscriptionPlan } from "@/types";

const PLANS = [
  { id:"basic" as SubscriptionPlan, name:"Basic", price:"₦5,000", period:"/month",
    desc:"For individual pharmacists",
    features:["Unlimited drug verification","NAFDAC database access","Counterfeit reporting","Verified pharmacist badge"],
    featured:false },
  { id:"professional" as SubscriptionPlan, name:"Professional", price:"₦15,000", period:"/month",
    desc:"For pharmacies and dispensaries",
    features:["Everything in Basic","Bulk QR verification","Dispensing records & audit log","Analytics dashboard","Patient-facing trust badge"],
    featured:true },
  { id:"enterprise" as SubscriptionPlan, name:"Enterprise", price:"Custom", period:"pricing",
    desc:"Hospital chains & distributors",
    features:["Everything in Professional","API & EHR integration","Multi-branch management","Dedicated NAFDAC liaison"],
    featured:false },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const { updatePlan } = useAuth();
  const { isDark } = useTheme();

  function select(plan: SubscriptionPlan) {
    updatePlan(plan);
    router.push("/dashboard");
  }

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full">
        <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0">
          <button onClick={() => router.back()}
            className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--t1)" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <h1 className="text-[16px] font-semibold" style={{ color: "var(--t1)" }}>Choose a Plan</h1>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-8 pt-2 flex flex-col gap-3">
          <p className="text-[13px] text-center" style={{ color: "var(--t2)" }}>
            All plans include unlimited drug verification. Upgrade anytime.
          </p>

          {PLANS.map(p => (
            <div key={p.id} className="relative rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.01]"
              style={{
                background: "var(--card-bg)",
                boxShadow: p.featured ? "0 8px 32px rgba(74,124,94,0.2)" : "var(--card-shadow)",
                border: p.featured ? "2px solid var(--green)" : "1px solid var(--border)",
              }}
              onClick={() => select(p.id)}>
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[11px] font-medium px-3.5 py-1 rounded-full whitespace-nowrap"
                  style={{ background: "var(--green)" }}>Most popular</span>
              )}
              <h3 className="text-[15px] font-semibold mb-0.5" style={{ color: "var(--t1)" }}>{p.name}</h3>
              <div className="text-[22px] font-semibold mb-0.5" style={{ color: "var(--green)" }}>
                {p.price}
                <span className="text-[13px] font-normal ml-1" style={{ color: "var(--t2)" }}>{p.period}</span>
              </div>
              <p className="text-[12px] mb-3" style={{ color: "var(--t2)" }}>{p.desc}</p>
              <ul className="flex flex-col gap-1.5 mb-4">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-[12px]" style={{ color: "var(--t1)" }}>
                    <Check size={14} color="var(--green)" className="flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <button className="w-full rounded-full py-3 text-[14px] font-medium text-white border-none cursor-pointer"
                style={{ background: "var(--green)" }}>
                {p.id === "enterprise" ? "Contact sales" : "Get started"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
