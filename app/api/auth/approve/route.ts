import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { approveToken } = await req.json();
    if (!approveToken) return NextResponse.json({ ok: false, error: "missing token" }, { status: 400 });
    const b64 = approveToken.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(Buffer.from(b64, "base64").toString());
    const email = String(payload.email || "").toLowerCase();
    const name = String(payload.name || "");
    const role = String(payload.role || "client");
    if (!email) return NextResponse.json({ ok: false, error: "invalid token" }, { status: 400 });
    const existing = await query("select id, role from users where email=$1", [email]);
    let id = existing.rowCount ? existing.rows[0].id : uuidv4();
    if (existing.rowCount) {
      await query("update users set name=$1, role=$2, approved=true, updated_at=now() where id=$3", [name, role, id]);
    } else {
      await query("insert into users(id,name,email,role,approved) values($1,$2,$3,$4,$5)", [id, name, email, role, true]);
    }
    const token = setSessionCookie({ id, email, name, role });
    return NextResponse.json({ ok: true, id, email, name, role, token });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "unknown error" }, { status: 500 });
  }
}