import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { senderRole, senderUserId, text } = await req.json();
    const mid = uuidv4();
    await query(
      "insert into negotiation_messages(id,quotation_id,sender_role,sender_user_id,text) values($1,$2,$3,$4,$5)",
      [mid, id, senderRole, senderUserId || null, text]
    );
    return NextResponse.json({ ok: true, id: mid });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "unknown error" }, { status: 500 });
  }
}