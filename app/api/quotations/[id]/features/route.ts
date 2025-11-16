import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const { feature } = await req.json();
    await query(
      "insert into features(id,quotation_id,title,description,price,client_proposed_price) values($1,$2,$3,$4,$5,$6)",
      [feature.id, id, feature.title, feature.description || null, feature.price, feature.clientProposedPrice || null]
    );
    const totals = await query("select coalesce(sum(price),0) as features_total from features where quotation_id=$1", [id]);
    const dep = await query("select deployment_cost from quotations where id=$1", [id]);
    const total = Number(totals.rows[0]?.features_total || 0) + Number(dep.rows[0]?.deployment_cost || 0);
    await query("update quotations set total_cost=$1 where id=$2", [total, id]);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "unknown error" }, { status: 500 });
  }
}