import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import nodemailer from "nodemailer";
import { createVerificationToken } from "@/lib/auth";

export const runtime = "nodejs";

const lastSend: Record<string, number> = {};

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const e = String(email || "").toLowerCase();
    if (!e) return NextResponse.json({ ok: false, error: "missing email" }, { status: 400 });
    const now = Date.now();
    if (lastSend[e] && now - lastSend[e] < 60_000) return NextResponse.json({ ok: false, error: "too many requests" }, { status: 429 });
    const r = await query("select id, name, email_verified from users where email=$1", [e]);
    if (!r.rowCount) return NextResponse.json({ ok: false, error: "user not found" }, { status: 404 });
    const u = r.rows[0];
    if (u.email_verified) return NextResponse.json({ ok: true, already_verified: true });
    const vt = createVerificationToken();
    await query("update users set verify_token_hash=$1, verify_expires=$2 where id=$3", [vt.hash, vt.expires, u.id]);
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || 465);
    const secure = port === 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!user || !pass) return NextResponse.json({ ok: false, error: "smtp not configured" }, { status: 500 });
    const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
    const origin = process.env.APP_ORIGIN || "http://localhost:3001";
    const link = `${origin}/api/auth/verify?token=${vt.token}`;
    await transporter.sendMail({ from: user, to: e, subject: "Resend Verification | Price Quotations", text: `Verify: ${link}` });
    lastSend[e] = now;
    return NextResponse.json({ ok: true, resent: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "unknown error" }, { status: 500 });
  }
}