import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();
    if (!name || !email || !role) return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
    const id = uuidv4();
    const password_hash = password ? hashPassword(password) : null;
    const existing = await query("select id, approved from users where email=$1", [email.toLowerCase()]);
    if (existing.rowCount) {
      const u = existing.rows[0];
      await query("update users set name=$1, role=$2, updated_at=now() where id=$3", [name, role, u.id]);
      return NextResponse.json({ ok: true, id: u.id, approved: u.approved });
    }
    await query(
      "insert into users(id,name,email,role,password_hash,approved) values($1,$2,$3,$4,$5,$6)",
      [id, name, email.toLowerCase(), role, password_hash, false]
    );
    return NextResponse.json({ ok: true, id, approved: false });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "unknown error" }, { status: 500 });
  }
}