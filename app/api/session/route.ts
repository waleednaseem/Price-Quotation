import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { query } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const c = await cookies();
    const token = c.get("session")?.value;
    if (!token) return NextResponse.json({ ok: true, user: null });
    const payload = verifySession(token);
    if (!payload) return NextResponse.json({ ok: true, user: null });
    const r = await query("select id,name,email,role,picture,approved,email_verified from users where id=$1", [payload.id]);
    if (!r.rowCount) return NextResponse.json({ ok: true, user: null });
    return NextResponse.json({ ok: true, user: r.rows[0] });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "unknown error" }, { status: 500 });
  }
}