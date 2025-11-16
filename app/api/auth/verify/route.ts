import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) return NextResponse.json({ ok: false, error: "missing token" }, { status: 400 });
    const hash = hashToken(token);
    const r = await query("select id, verify_expires, email_verified from users where verify_token_hash=$1", [hash]);
    if (!r.rowCount) return NextResponse.json({ ok: false, error: "invalid token" }, { status: 400 });
    const u = r.rows[0];
    if (u.email_verified) return NextResponse.redirect(new URL("/login?verified=1", url.origin));
    if (u.verify_expires && new Date(u.verify_expires).getTime() < Date.now()) {
      return NextResponse.redirect(new URL("/login?verify_expired=1", url.origin));
    }
    await query("update users set email_verified=true, verify_token_hash=null, verify_expires=null, updated_at=now() where id=$1", [u.id]);
    return NextResponse.redirect(new URL("/login?verified=1", url.origin));
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "unknown error" }, { status: 500 });
  }
}