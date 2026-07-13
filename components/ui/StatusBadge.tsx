import { VerificationStatus } from "@/types";
const cfg: Record<VerificationStatus, { label: string; bg: string; color: string }> = {
  authentic:    { label:"Authentic",    bg:"#E1F5EE", color:"#2E7D5A" },
  suspicious:   { label:"Suspicious",   bg:"#FFF4E0", color:"#C07A1A" },
  counterfeit:  { label:"Counterfeit",  bg:"#FFE8EC", color:"#D4607A" },
  expired:      { label:"Expired",      bg:"#F1EFE8", color:"#5F5E5A" },
  unregistered: { label:"Unregistered", bg:"#FFE8EC", color:"#D4607A" },
};
export default function StatusBadge({ status }: { status: VerificationStatus }) {
  const { label, bg, color } = cfg[status] ?? cfg.unregistered;
  return <span className="text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap" style={{ background: bg, color }}>{label}</span>;
}
