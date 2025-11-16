import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const runtime = "nodejs";

export async function DELETE(_: Request, { params }: { params: { id: string; fid: string } }) {
  const { id, fid } = params;
  await query("delete from features where id=$1 and quotation_id=$2", [fid, id]);
  const totals = await query("select coalesce(sum(price),0) as features_total from features where quotation_id=$1", [id]);
  const dep = await query("select deployment_cost from quotations where id=$1", [id]);
  const total = Number(totals.rows[0]?.features_total || 0) + Number(dep.rows[0]?.deployment_cost || 0);
  await query("update quotations set total_cost=$1 where id=$2", [total, id]);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: { params: { id: string; fid: string } }) {
  try {
    const { id, fid } = params;
    const body = await req.json();
    const fields: string[] = [];
    const values: any[] = [];
    if ("title" in body) {
      fields.push("title=$" + (fields.length + 1));
      values.push(body.title);
    }
    if ("description" in body) {
      fields.push("description=$" + (fields.length + 1));
      values.push(body.description || null);
    }
    if ("price" in body) {
      fields.push("price=$" + (fields.length + 1));
      values.push(body.price);
    }
    if ("clientProposedPrice" in body) {
      fields.push("client_proposed_price=$" + (fields.length + 1));
      values.push(body.clientProposedPrice || null);
    }
    if (fields.length) {
      await query("update features set " + fields.join(",") + ", updated_at=now() where id=$" + (fields.length + 1) + " and quotation_id=$" + (fields.length + 2), [...values, fid, id]);
    }
    const totals = await query("select coalesce(sum(price),0) as features_total from features where quotation_id=$1", [id]);
    const dep = await query("select deployment_cost from quotations where id=$1", [id]);
    const total = Number(totals.rows[0]?.features_total || 0) + Number(dep.rows[0]?.deployment_cost || 0);
    await query("update quotations set total_cost=$1 where id=$2", [total, id]);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "unknown error" }, { status: 500 });
  }
}