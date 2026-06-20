import { supabase } from "./supabase";
import { Report, ReportType } from "@/types";

function toReport(r: Record<string, unknown>): Report {
  return {
    id: r.id as string, userId: r.user_id as string, drugName: r.drug_name as string,
    batchNumber: r.batch_number as string, nafdacNumber: r.nafdac_number as string | undefined,
    location: r.location as string, reportType: r.report_type as ReportType,
    details: r.details as string | undefined,
    status: r.status as Report["status"], refCode: r.ref_code as string,
    createdAt: r.created_at as string,
  };
}

export async function createReport(data: {
  userId: string; drugName: string; batchNumber: string; nafdacNumber?: string;
  location: string; reportType: ReportType; details?: string;
}): Promise<Report> {
  const refCode = "AH-RPT-" + Math.floor(100000 + Math.random() * 900000);
  const { data: row, error } = await supabase.from("reports").insert({
    user_id: data.userId, drug_name: data.drugName, batch_number: data.batchNumber,
    nafdac_number: data.nafdacNumber, location: data.location,
    report_type: data.reportType, details: data.details,
    ref_code: refCode, status: "pending",
  }).select().single();
  if (error) throw new Error(error.message);
  return toReport(row);
}

export async function getUserReports(userId: string): Promise<Report[]> {
  const { data } = await supabase.from("reports").select("*")
    .eq("user_id", userId).order("created_at", { ascending: false });
  return (data || []).map(toReport);
}

export async function getAllReports(page = 1, limit = 20, status?: string) {
  const from = (page - 1) * limit;
  let q = supabase.from("reports").select("*", { count: "exact" });
  if (status) q = q.eq("status", status);
  const { data, count } = await q.order("created_at", { ascending: false }).range(from, from + limit - 1);
  return { reports: (data || []).map(toReport), total: count || 0, page, limit };
}
