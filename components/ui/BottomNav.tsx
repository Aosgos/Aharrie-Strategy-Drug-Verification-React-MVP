"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, Building2, User, LayoutDashboard, Scan, BarChart3, Settings } from "lucide-react";
import { UserRole } from "@/types";

const patientItems = [
  { label:"Home",       icon:Home,          href:"/home" },
  { label:"History",    icon:History,        href:"/history" },
  { label:"Pharmacies", icon:Building2,      href:"/pharmacies" },
  { label:"Account",    icon:User,           href:"/account" },
];

const pharmacistItems = [
  { label:"Dashboard",  icon:LayoutDashboard, href:"/dashboard" },
  { label:"Scan",       icon:Scan,            href:"/scan" },
  { label:"Analytics",  icon:BarChart3,       href:"/analytics" },
  { label:"Settings",   icon:Settings,        href:"/account" },
];

export default function BottomNav({ role }: { role: UserRole }) {
  const path  = usePathname();
  const items = role === "pharmacist" ? pharmacistItems : patientItems;
  return (
    <nav className="bg-white border-t border-[#D4E8DC] flex justify-around px-2 py-2.5 pb-6 flex-shrink-0">
      {items.map(({ label, icon: Icon, href }) => {
        const active = path === href;
        return (
          <Link key={label} href={href} className="flex flex-col items-center gap-0.5 px-3">
            <Icon size={22} color={active ? "#4A7C5E" : "#8AA398"} />
            <span className="text-[10px]" style={{ color: active ? "#4A7C5E" : "#8AA398" }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
