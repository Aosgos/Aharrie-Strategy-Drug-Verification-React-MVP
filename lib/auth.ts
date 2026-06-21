import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { supabase } from "./supabase";
import { signToken, verifyToken, getTokenFromHeader } from "./jwt";
import { User, UserRole, SubscriptionPlan, JWTPayload } from "@/types";

function toUser(row: Record<string, unknown>): User {
  return {
    id:               row.id as string,
    email:            row.email as string,
    name:             row.name as string,
    role:             row.role as UserRole,
    pharmacyName:     row.pharmacy_name as string | undefined,
    pcnLicence:       row.pcn_licence as string | undefined,
    subscriptionPlan: row.subscription_plan as SubscriptionPlan | undefined,
    subscriptionExpiry: row.subscription_expiry as string | undefined,
    createdAt:        row.created_at as string,
  };
}

// ── Register ──────────────────────────────────────────────────────────────────
export async function registerUser(data: {
  email: string; password: string; name: string; role: UserRole;
  pharmacyName?: string; pcnLicence?: string;
}): Promise<{ user: User; token: string }> {
  const { data: existing } = await supabase
    .from("users").select("id").eq("email", data.email.toLowerCase()).single();
  if (existing) throw new Error("Email already registered");

  const hash = await bcrypt.hash(data.password, 12);
  const { data: row, error } = await supabase.from("users").insert({
    email: data.email.toLowerCase(), password_hash: hash,
    name: data.name, role: data.role,
    pharmacy_name: data.pharmacyName, pcn_licence: data.pcnLicence,
  }).select().single();

  if (error) throw new Error(error.message);
  const user  = toUser(row);
  const token = await signToken({ userId: user.id, email: user.email, role: user.role });
  return { user, token };
}

// ── Login ─────────────────────────────────────────────────────────────────────
export async function loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
  const { data: row } = await supabase
    .from("users").select("*").eq("email", email.toLowerCase()).single();
  if (!row) throw new Error("Invalid email or password");

  const valid = await bcrypt.compare(password, row.password_hash as string);
  if (!valid)  throw new Error("Invalid email or password");

  const user  = toUser(row);
  const token = await signToken({ userId: user.id, email: user.email, role: user.role });
  return { user, token };
}

// ── Get user by ID ────────────────────────────────────────────────────────────
export async function getUserById(id: string): Promise<User | null> {
  const { data } = await supabase.from("users").select("*").eq("id", id).single();
  return data ? toUser(data) : null;
}

// ── Update subscription ───────────────────────────────────────────────────────
export async function updateSubscription(userId: string, plan: SubscriptionPlan): Promise<User> {
  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + 1);
  const { data, error } = await supabase
    .from("users")
    .update({ subscription_plan: plan, subscription_expiry: expiry.toISOString() })
    .eq("id", userId).select().single();
  if (error) throw new Error(error.message);
  return toUser(data);
}

// ── Auth guard helper (used in API routes) ────────────────────────────────────
export async function getAuthUser(req: NextRequest): Promise<JWTPayload | null> {
  const token = getTokenFromHeader(req.headers.get("authorization") ?? undefined);
  if (!token) return null;
  try { return await verifyToken(token); }
  catch { return null; }
}

// ── Cookie helper (used by login/register API routes) ─────────────────────────
// Setting the cookie via the Set-Cookie response header — rather than client-side
// document.cookie — guarantees it exists in the browser before any redirect can
// happen, so middleware never misses it on the very next navigation.
export const AUTH_COOKIE_OPTIONS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
  sameSite: "lax" as const,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};
