import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const type: string | undefined = body?.type || "invite";
    const quotationId: string | undefined = body?.quotationId;
    const email: string | undefined = body?.email;
    const name: string | undefined = body?.name;
    const role: "admin" | "client" | undefined = body?.role;

    if (type === "invite") {
      if (!quotationId || !email) {
        return NextResponse.json({ ok: false, error: "Missing quotationId or email" }, { status: 400 });
      }
    } else if (type === "register") {
      if (!email || !name || !role) {
        return NextResponse.json({ ok: false, error: "Missing name, email or role" }, { status: 400 });
      }
    }

    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || 465);
    const secure = port === 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      return NextResponse.json({ ok: false, error: "SMTP credentials not configured" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    try {
      await transporter.verify();
    } catch (err: any) {
      return NextResponse.json({ ok: false, error: `SMTP verify failed: ${err?.message || 'unknown error'}` }, { status: 500 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    if (type === "invite") {
      const token = uuidv4();
      const link = `${origin}/client/${quotationId}?token=${token}`;

      await transporter.sendMail({
        from: user,
        to: email!,
        subject: "Quotation Invitation",
        text: `You have been invited to review a quotation. Open the link to view and accept:\n\n${link}`,
        html: `
          <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;background:linear-gradient(135deg,#FFF7ED,#FFEDD5);padding:0;margin:0">
            <div style="max-width:600px;margin:24px auto;background:#ffffff;border:1px solid #FDE68A;border-radius:16px;box-shadow:0 10px 25px rgba(234,88,12,0.15);overflow:hidden">
              <div style="padding:24px 24px 12px;background:linear-gradient(135deg,#F59E0B,#EA580C);color:#fff">
                <div style="font-weight:800;font-size:20px;letter-spacing:.3px">Quotation Invitation</div>
                <div style="opacity:.95;font-size:13px;margin-top:6px">You are invited to review a quotation.</div>
              </div>
              <div style="padding:24px;color:#1f2937;font-size:14px;line-height:1.6">
                <p style="margin:0 0 12px;color:#374151">Click the button below to open and respond to your quotation.</p>
                <p style="text-align:center;margin:22px 0">
                  <a href="${link}" style="display:inline-block;background:#EA580C;color:#ffffff;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:700;box-shadow:0 6px 12px rgba(234,88,12,0.3)">View Quotation</a>
                </p>
                <div style="margin-top:14px;padding:12px;border:1px dashed #FDE68A;border-radius:10px;background:#FFFBEB;color:#6b7280">
                  If the button doesn't work, copy this URL:<br/>
                  <a href="${link}" style="color:#EA580C;text-decoration:none">${link}</a>
                </div>
              </div>
              <div style="padding:16px 24px;background:#fff7ed;color:#6b7280;font-size:12px">Powered by Price Quotations</div>
            </div>
          </div>
        `,
      });

      return NextResponse.json({ ok: true, token, link });
    }

    // type === "register"
    const welcomeTitle = role === "admin" ? "Welcome, Admin" : "Welcome, Client";
    const roleDesc = role === "admin" ? "Create and manage quotations for your customers." : "View and respond to quotations sent to you.";
    const payload = { email, name, role, ts: Date.now() };
    const base64 = Buffer.from(JSON.stringify(payload)).toString("base64");
    const approveToken = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    const panelLink = `${origin}/login?approveToken=${approveToken}`;

    await transporter.sendMail({
      from: user!,
      to: email!,
      subject: `${welcomeTitle} | Price Quotations`,
      text: `Hello ${name}, your account has been registered as ${role}. Click the link to approve and sign in: ${panelLink}`,
      html: `
        <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;background:linear-gradient(135deg,#FFF7ED,#FFEDD5);padding:0;margin:0">
          <div style="max-width:640px;margin:24px auto;background:#ffffff;border:1px solid #FDE68A;border-radius:18px;box-shadow:0 12px 28px rgba(234,88,12,0.18);overflow:hidden">
            <div style="padding:28px;background:radial-gradient(1200px 480px at 0% 0%, rgba(255,255,255,.3), rgba(255,255,255,0)), linear-gradient(135deg,#F59E0B,#EA580C);color:#fff">
              <div style="display:flex;align-items:center;gap:10px">
                <div style="height:36px;width:36px;border-radius:10px;background:#fff1;color:#fff;border:1px solid #FDE68A;display:flex;align-items:center;justify-content:center">
                  <span style="font-weight:900">PQ</span>
                </div>
                <div style="font-weight:800;font-size:22px;letter-spacing:.3px">${welcomeTitle}</div>
              </div>
              <div style="opacity:.95;font-size:13px;margin-top:6px">Price Quotations</div>
            </div>
            <div style="padding:24px;color:#1f2937;font-size:14px;line-height:1.7">
              <p style="margin:0 0 10px;color:#374151">Hello <strong>${name}</strong>,</p>
              <p style="margin:0 0 12px;color:#374151">Your account has been successfully registered as <strong>${role}</strong>.</p>
              <p style="margin:0 0 16px;color:#6b7280">${roleDesc}</p>
              <p style="text-align:center;margin:22px 0">
                <a href="${panelLink}" style="display:inline-block;background:#EA580C;color:#ffffff;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:800;box-shadow:0 8px 16px rgba(234,88,12,0.35)">Approve & Sign In</a>
              </p>
              <div style="margin-top:14px;padding:12px;border:1px dashed #FDE68A;border-radius:12px;background:#FFFBEB;color:#6b7280">
                If the button doesn't work, copy this URL:<br/>
                <a href="${panelLink}" style="color:#EA580C;text-decoration:none">${panelLink}</a>
              </div>
            </div>
            <div style="padding:18px 24px;background:#fff7ed;color:#6b7280;font-size:12px">
              Need help? Reply to this email.
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true, link: panelLink });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Invite failed" }, { status: 500 });
  }
}