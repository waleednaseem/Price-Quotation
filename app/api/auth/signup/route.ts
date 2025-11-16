import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword, createVerificationToken } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();
    const n = String(name || "").trim();
    const e = String(email || "").toLowerCase();
    const r = String(role || "client");
    const p = String(password || "");
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const strongRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/]).{8,}$/;
    if (!n || n.length < 2) return NextResponse.json({ ok: false, error: "invalid name" }, { status: 400 });
    if (!emailRe.test(e)) return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });
    if (!strongRe.test(p)) return NextResponse.json({ ok: false, error: "weak password" }, { status: 400 });
    if (r !== "admin" && r !== "client") return NextResponse.json({ ok: false, error: "invalid role" }, { status: 400 });
    const existing = await query("select id, email_verified from users where email=$1", [e]);
    if (existing.rowCount) {
      const u = existing.rows[0];
      return NextResponse.json({ ok: false, error: u.email_verified ? "user exists" : "verify email first" }, { status: 409 });
    }
    const id = uuidv4();
    const password_hash = hashPassword(p);
    await query(
      "insert into users(id,name,email,role,password_hash,approved,email_verified) values($1,$2,$3,$4,$5,$6,$7)",
      [id, n, e, r, password_hash, false, false]
    );
    const vt = createVerificationToken();
    await query("update users set verify_token_hash=$1, verify_expires=$2 where id=$3", [vt.hash, vt.expires, id]);
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || 465);
    const secure = port === 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!user || !pass) return NextResponse.json({ ok: false, error: "smtp not configured" }, { status: 500 });
    const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
    const origin = process.env.APP_ORIGIN || "http://localhost:3001";
    const link = `${origin}/api/auth/verify?token=${vt.token}`;
    await transporter.sendMail({
      from: user,
      to: e,
      subject: "Verify your email | Price Quotations",
      headers: { "X-Auto-Response-Suppress": "All" },
      text: `Hello ${n}, please verify your email within 24 hours: ${link}`,
      html: `<p>Hello ${n},</p><p>Please verify your email within 24 hours:</p><p><a href="${link}">Verify Email</a></p>`,
    });
    return NextResponse.json({ ok: true, id, verification_sent: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "unknown error" }, { status: 500 });
  }
}