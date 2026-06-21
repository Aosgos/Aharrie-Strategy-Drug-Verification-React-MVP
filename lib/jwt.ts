import { SignJWT, jwtVerify } from "jose";
import { JWTPayload } from "@/types";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const EXPIRY = process.env.JWT_EXPIRES_IN || "7d";

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, SECRET);
  return payload as unknown as JWTPayload;
}

export function getTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];
}
