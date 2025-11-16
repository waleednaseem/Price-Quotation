import crypto from "crypto";
import { cookies } from "next/headers";

export function createVerificationToken() {
  const raw = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return { token: raw, hash, expires };
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  const check = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(check, "hex"));
}

function b64url(input: Buffer | string) {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return b.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+/g, "");
}

export function signSession(payload: Record<string, any>) {
  const secret = process.env.AUTH_SECRET || "dev-secret";
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify(payload));
  const data = `${header}.${body}`;
  const sig = crypto.createHmac("sha256", secret).update(data).digest();
  return `${data}.${b64url(sig)}`;
}

export function verifySession(token: string) {
  try {
    const secret = process.env.AUTH_SECRET || "dev-secret";
    const [h, b, s] = token.split(".");
    const data = `${h}.${b}`;
    const expected = crypto.createHmac("sha256", secret).update(data).digest();
    const got = Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
    if (!crypto.timingSafeEqual(expected, got)) return null;
    return JSON.parse(Buffer.from(b.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
  } catch {
    return null;
  }
}

export async function setSessionCookie(data: Record<string, any>) {
  const token = signSession(data);
  const c = await cookies();
  c.set("session", token, { httpOnly: true, sameSite: "lax", path: "/" });
  return token;
}

export async function clearSessionCookie() {
  const c = await cookies();
  c.set("session", "", { httpOnly: true, expires: new Date(0), path: "/" });
}