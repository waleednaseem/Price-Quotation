import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ ok: false, error: "missing credentials" }, { status: 400 });
    const r = await query("select id,name,email,role,password_hash,approved from users where email=$1", [email.toLowerCase()]);
    if (!r.rowCount) return NextResponse.json({ ok: false, error: "user not found" }, { status: 404 });
    const u = r.rows[0];
    if (!u.approved) return NextResponse.json({ ok: false, error: "not approved" }, { status: 403 });
    if (!u.password_hash || !verifyPassword(password, u.password_hash)) return NextResponse.json({ ok: false, error: "invalid password" }, { status: 401 });
    const token = setSessionCookie({ id: u.id, email: u.email, name: u.name, role: u.role });
    return NextResponse.json({ ok: true, id: u.id, email: u.email, name: u.name, role: u.role, token });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "unknown error" }, { status: 500 });
  }
}