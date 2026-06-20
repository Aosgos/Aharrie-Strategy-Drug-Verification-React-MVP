import jwt from "jsonwebtoken";
import { JWTPayload } from "@/types";

const SECRET = process.env.JWT_SECRET!;
const EXPIRY = process.env.JWT_EXPIRES_IN || "7d";

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRY });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, SECRET) as JWTPayload;
}

export function getTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];
}
