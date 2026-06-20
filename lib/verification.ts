import { supabase } from "./supabase";
import { DrugResult, VerificationStatus } from "@/types";

// ── Local fallback DB (works without Supabase during development) ─────────────
const LOCAL: Record<string, Omit<DrugResult, "verifiedAt">> = {
  "04-3275-CTBN-240601": { id:"04-3275-CTBN-240601",nafdacNumber:"04-3275",batchNumber:"CTBN-240601",brandName:"Coartem",genericName:"Artemether/Lumefantrine",category:"Antimalarial",strength:"20mg/120mg",form:"Tablet",manufacturer:"Novartis Pharma AG, Switzerland",countryOfOrigin:"Switzerland",expiryDate:"Jun 2027",status:"authentic",nafdacRegistered:true,databaseMatch:"NAFDAC verified",recallStatus:"No recall",qrIntegrity:100,priceRangeNGN:"₦800–₦9,000"},
  "04-8969-LNRT-240815": { id:"04-8969-LNRT-240815",nafdacNumber:"04-8969",batchNumber:"LNRT-240815",brandName:"Lonart",genericName:"Artemether/Lumefantrine",category:"Antimalarial",strength:"80mg/480mg",form:"Tablet",manufacturer:"Greenlife Pharmaceutical Ltd, Lagos",countryOfOrigin:"Nigeria",expiryDate:"Aug 2027",status:"authentic",nafdacRegistered:true,databaseMatch:"NAFDAC verified",recallStatus:"No recall",qrIntegrity:100,priceRangeNGN:"₦1,200–₦5,000"},
  "04-2508-AMXL-241105": { id:"04-2508-AMXL-241105",nafdacNumber:"04-2508",batchNumber:"AMXL-241105",brandName:"Amoxil",genericName:"Amoxicillin",category:"Antibiotic",strength:"500mg",form:"Capsule",manufacturer:"GlaxoSmithKline Consumer Nigeria Plc",countryOfOrigin:"Nigeria",expiryDate:"Nov 2026",status:"authentic",nafdacRegistered:true,databaseMatch:"NAFDAC verified",recallStatus:"No recall",qrIntegrity:100,priceRangeNGN:"₦350–₦1,800"},
  "04-3327-EMZX-241220": { id:"04-3327-EMZX-241220",nafdacNumber:"04-3327",batchNumber:"EMZX-241220",brandName:"Emzimox",genericName:"Amoxicillin",category:"Antibiotic",strength:"500mg",form:"Capsule",manufacturer:"Emzor Pharmaceutical Industries Ltd",countryOfOrigin:"Nigeria",expiryDate:"Dec 2026",status:"authentic",nafdacRegistered:true,databaseMatch:"NAFDAC verified",recallStatus:"No recall",qrIntegrity:100,priceRangeNGN:"₦350–₦1,200"},
  "04-0411-EMZP-241001": { id:"04-0411-EMZP-241001",nafdacNumber:"04-0411",batchNumber:"EMZP-241001",brandName:"Emzor Paracetamol",genericName:"Paracetamol",category:"Pain & Fever",strength:"500mg",form:"Tablet",manufacturer:"Emzor Pharmaceutical Industries Ltd",countryOfOrigin:"Nigeria",expiryDate:"Oct 2027",status:"authentic",nafdacRegistered:true,databaseMatch:"NAFDAC verified",recallStatus:"No recall",qrIntegrity:100,priceRangeNGN:"₦100–₦600"},
  "04-0005-PNDL-241108": { id:"04-0005-PNDL-241108",nafdacNumber:"04-0005",batchNumber:"PNDL-241108",brandName:"Panadol Extra",genericName:"Paracetamol+Caffeine",category:"Pain & Fever",strength:"500mg/30mg",form:"Caplet",manufacturer:"GlaxoSmithKline Consumer Nigeria Plc",countryOfOrigin:"Nigeria",expiryDate:"Nov 2027",status:"authentic",nafdacRegistered:true,databaseMatch:"NAFDAC verified",recallStatus:"No recall",qrIntegrity:100,priceRangeNGN:"₦200–₦1,200"},
  "04-6233-GCPG-240901": { id:"04-6233-GCPG-240901",nafdacNumber:"04-6233",batchNumber:"GCPG-240901",brandName:"Glucophage",genericName:"Metformin",category:"Diabetes",strength:"500mg",form:"Tablet",manufacturer:"Merck S.A., Lyon, France",countryOfOrigin:"France",expiryDate:"Sep 2027",status:"authentic",nafdacRegistered:true,databaseMatch:"NAFDAC verified",recallStatus:"No recall",qrIntegrity:100,priceRangeNGN:"₦300–₦2,500"},
  "A4-5509-NRVS-241201": { id:"A4-5509-NRVS-241201",nafdacNumber:"A4-5509",batchNumber:"NRVS-241201",brandName:"Norvasc",genericName:"Amlodipine",category:"Hypertension",strength:"5mg",form:"Tablet",manufacturer:"Pfizer Nigeria Ltd",countryOfOrigin:"USA",expiryDate:"Dec 2027",status:"authentic",nafdacRegistered:true,databaseMatch:"NAFDAC verified",recallStatus:"No recall",qrIntegrity:100,priceRangeNGN:"₦500–₦4,000"},
  "04-5021-CPTB-241015": { id:"04-5021-CPTB-241015",nafdacNumber:"04-5021",batchNumber:"CPTB-241015",brandName:"Ciprotab",genericName:"Ciprofloxacin",category:"Antibiotic",strength:"500mg",form:"Tablet",manufacturer:"Fidson Healthcare Plc",countryOfOrigin:"Nigeria",expiryDate:"Oct 2027",status:"authentic",nafdacRegistered:true,databaseMatch:"NAFDAC verified",recallStatus:"No recall",qrIntegrity:100,priceRangeNGN:"₦500–₦3,000"},
  "04-1233-FLGY-240720": { id:"04-1233-FLGY-240720",nafdacNumber:"04-1233",batchNumber:"FLGY-240720",brandName:"Flagyl",genericName:"Metronidazole",category:"Antibiotic",strength:"400mg",form:"Tablet",manufacturer:"May & Baker Nigeria Plc",countryOfOrigin:"Nigeria",expiryDate:"Jul 2027",status:"authentic",nafdacRegistered:true,databaseMatch:"NAFDAC verified",recallStatus:"No recall",qrIntegrity:100,priceRangeNGN:"₦300–₦1,500"},
  "04-3009-VNTL-241201": { id:"04-3009-VNTL-241201",nafdacNumber:"04-3009",batchNumber:"VNTL-241201",brandName:"Ventolin",genericName:"Salbutamol",category:"Respiratory",strength:"100mcg/puff",form:"Inhaler",manufacturer:"GlaxoSmithKline Consumer Nigeria Plc",countryOfOrigin:"Nigeria",expiryDate:"Dec 2026",status:"authentic",nafdacRegistered:true,databaseMatch:"NAFDAC verified",recallStatus:"No recall",qrIntegrity:100,priceRangeNGN:"₦2,500–₦8,000"},
  "A4-9301-TLD-241005":  { id:"A4-9301-TLD-241005",nafdacNumber:"A4-9301",batchNumber:"TLD-241005",brandName:"TLD",genericName:"Tenofovir/Lamivudine/Dolutegravir",category:"Anti-HIV",strength:"300/300/50mg",form:"Tablet",manufacturer:"ViiV Healthcare / Aspen Pharmacare",countryOfOrigin:"South Africa",expiryDate:"Oct 2027",status:"authentic",nafdacRegistered:true,databaseMatch:"NAFDAC verified",recallStatus:"No recall",qrIntegrity:100,priceRangeNGN:"Free via PEPFAR"},
  "04-3275-FAKE-240301": { id:"04-3275-FAKE-240301",nafdacNumber:"04-3275",batchNumber:"FAKE-240301",brandName:"Coartem (Unverified)",genericName:"Artemether/Lumefantrine",category:"Antimalarial",strength:"20mg/120mg",form:"Tablet",manufacturer:"Unknown source",countryOfOrigin:"Unknown",expiryDate:"Mar 2025",status:"suspicious",nafdacRegistered:true,databaseMatch:"Number valid but product mismatch",recallStatus:"Under investigation",qrIntegrity:58,priceRangeNGN:"Unknown"},
  "04-6233-SUSP-240501": { id:"04-6233-SUSP-240501",nafdacNumber:"04-6233",batchNumber:"SUSP-240501",brandName:"Metformin (Unverified)",genericName:"Metformin",category:"Diabetes",strength:"500mg",form:"Tablet",manufacturer:"Unidentified manufacturer",countryOfOrigin:"Unknown",expiryDate:"May 2026",status:"suspicious",nafdacRegistered:true,databaseMatch:"QR code mismatch",recallStatus:"Under review",qrIntegrity:61,priceRangeNGN:"Unknown"},
  "NONE-LG-2024-881":    { id:"NONE-LG-2024-881",nafdacNumber:"NOT FOUND",batchNumber:"LG-2024-881",brandName:"Paracetamol (FAKE)",genericName:"Paracetamol",category:"Pain & Fever",strength:"500mg",form:"Tablet",manufacturer:"No record found",countryOfOrigin:"Unknown",expiryDate:"Unknown",status:"counterfeit",nafdacRegistered:false,databaseMatch:"Not in any database",recallStatus:"NAFDAC Alert No. 014/2024",qrIntegrity:0,priceRangeNGN:"Unknown"},
  "NONE-FAKE-LON-2024":  { id:"NONE-FAKE-LON-2024",nafdacNumber:"NOT FOUND",batchNumber:"FAKE-LON-2024",brandName:"Lonart (FAKE)",genericName:"Artemether/Lumefantrine",category:"Antimalarial",strength:"80mg/480mg",form:"Tablet",manufacturer:"No record found",countryOfOrigin:"Unknown",expiryDate:"Unknown",status:"counterfeit",nafdacRegistered:false,databaseMatch:"Not in any database",recallStatus:"NAFDAC alert issued",qrIntegrity:0,priceRangeNGN:"Unknown"},
  "04-3275-CTBN-211001": { id:"04-3275-CTBN-211001",nafdacNumber:"04-3275",batchNumber:"CTBN-211001",brandName:"Coartem (Expired)",genericName:"Artemether/Lumefantrine",category:"Antimalarial",strength:"20mg/120mg",form:"Tablet",manufacturer:"Novartis Pharma AG, Switzerland",countryOfOrigin:"Switzerland",expiryDate:"Oct 2023",status:"expired",nafdacRegistered:true,databaseMatch:"NAFDAC verified — batch expired",recallStatus:"Expired — do not use",qrIntegrity:95,priceRangeNGN:"N/A"},
};

export async function verifyDrug(qrCode: string): Promise<DrugResult> {
  const key = qrCode.toUpperCase().trim();

  // 1. Check Supabase
  try {
    const parts  = key.split("-");
    const nafdac = parts.slice(0, 2).join("-");
    const batch  = parts.slice(2).join("-");
    if (nafdac && batch) {
      const { data } = await supabase
        .from("drugs").select("*")
        .eq("nafdac_number", nafdac).eq("batch_number", batch).single();
      if (data) return {
        id: data.id, nafdacNumber: data.nafdac_number, batchNumber: data.batch_number,
        brandName: data.brand_name, genericName: data.generic_name, category: data.category,
        strength: data.strength, form: data.form, manufacturer: data.manufacturer,
        countryOfOrigin: data.country_of_origin, expiryDate: data.expiry_date,
        status: data.status as VerificationStatus, nafdacRegistered: data.nafdac_registered,
        databaseMatch: data.database_match, recallStatus: data.recall_status,
        qrIntegrity: data.qr_integrity, priceRangeNGN: data.price_range_ngn,
        verifiedAt: new Date().toISOString(),
      };
    }
  } catch { /* fall through */ }

  // 2. Local fallback
  const local = LOCAL[key];
  if (local) return { ...local, verifiedAt: new Date().toISOString() };

  // 3. Unknown — unregistered
  return {
    id: key, nafdacNumber: "Not found", batchNumber: qrCode,
    brandName: "Unknown drug", genericName: "Unknown", category: "Unknown",
    strength: "Unknown", form: "Unknown", manufacturer: "No record found",
    countryOfOrigin: "Unknown", expiryDate: "Unknown", status: "unregistered",
    nafdacRegistered: false, databaseMatch: "No record in NAFDAC database",
    recallStatus: "Unknown", qrIntegrity: 0, priceRangeNGN: "Unknown",
    verifiedAt: new Date().toISOString(),
  };
}

export async function saveScanHistory(userId: string, result: DrugResult, qrCode: string) {
  await supabase.from("scan_history").insert({
    user_id: userId, qr_code: qrCode, drug_name: result.brandName,
    batch_number: result.batchNumber, nafdac_number: result.nafdacNumber, status: result.status,
  });
}

export async function getScanHistory(userId: string, page = 1, limit = 20) {
  const from = (page - 1) * limit;
  const { data, count } = await supabase.from("scan_history")
    .select("*", { count: "exact" }).eq("user_id", userId)
    .order("scanned_at", { ascending: false }).range(from, from + limit - 1);
  return { scans: data || [], total: count || 0, page, limit };
}

export function getStatusConfig(status: VerificationStatus) {
  const cfg = {
    authentic:    { label:"Authentic",           sub:"This drug is verified and safe to use",                          heroBg:"#E1F5EE", iconBg:"#D4EDE0", iconColor:"#2E7D5A", tc:"#085041" },
    suspicious:   { label:"Suspicious",           sub:"Unusual signals detected — consult a pharmacist before use",    heroBg:"#FFF4E0", iconBg:"#FFE8C0", iconColor:"#C07A1A", tc:"#633806" },
    counterfeit:  { label:"Counterfeit Detected", sub:"Do NOT use — not in any verified NAFDAC database",             heroBg:"#FFE8EC", iconBg:"#FFD0D8", iconColor:"#D4607A", tc:"#791F1F" },
    expired:      { label:"Expired",              sub:"This drug is past its expiry date. Do not use.",               heroBg:"#F1EFE8", iconBg:"#E0DDCC", iconColor:"#5F5E5A", tc:"#2C2C2A" },
    unregistered: { label:"Not Registered",       sub:"This drug is not found in the NAFDAC registry. Do not use.",   heroBg:"#FFE8EC", iconBg:"#FFD0D8", iconColor:"#D4607A", tc:"#791F1F" },
  };
  return cfg[status] ?? cfg.unregistered;
}
