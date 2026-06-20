"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Leaf } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  title?:    string;
  backHref?: string;
  showBack?: boolean;
  right?:    ReactNode;
  showBrand?: boolean;
}

export default function TopNav({ title, backHref, showBack = true, right, showBrand = false }: Props) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
      {showBack
        ? <button onClick={() => backHref ? router.push(backHref) : router.back()} className="w-8 h-8 rounded-full flex items-center justify-center border border-[#C8DDD2] bg-white" aria-label="Go back"><ArrowLeft size={16} color="#1A2E25" /></button>
        : <div className="w-8" />}
      {showBrand
        ? <div className="flex items-center gap-1.5 text-[15px] font-medium text-[#1A2E25]"><Leaf size={16} color="#4A7C5E" />Aharrie Strategy</div>
        : <span className="text-[15px] font-medium text-[#1A2E25]">{title}</span>}
      <div className="min-w-8 flex justify-end">{right}</div>
    </div>
  );
}
