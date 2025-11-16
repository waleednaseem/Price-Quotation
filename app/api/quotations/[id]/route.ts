import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const r = await query(
    "select q.*, json_agg(f.* order by f.created_at) filter (where f.id is not null) as features from quotations q left join features f on f.quotation_id=q.id where q.id=$1 group by q.id",
    [id]
  );
  if (!r.rowCount) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true, quotation: r.rows[0] });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();
    const fields: string[] = [];
    const values: any[] = [];
    if ("projectName" in body) {
      fields.push("project_name=$" + (fields.length + 1));
      values.push(body.projectName);
    }
    if ("companyName" in body) {
      fields.push("company_name=$" + (fields.length + 1));
      values.push(body.companyName);
    }
    if ("clientId" in body) {
      fields.push("client_id=$" + (fields.length + 1));
      values.push(body.clientId || null);
    }
    if ("deploymentCost" in body) {
      fields.push("deployment_cost=$" + (fields.length + 1));
      values.push(body.deploymentCost || 0);
    }
    if ("notes" in body) {
      fields.push("notes=$" + (fields.length + 1));
      values.push(body.notes || null);
    }
    if ("status" in body) {
      fields.push("status=$" + (fields.length + 1));
      values.push(body.status);
    }
    if (fields.length) {
      await query("update quotations set " + fields.join(",") + ", updated_at=now() where id=$" + (fields.length + 1), [...values, id]);
    }
    const totals = await query("select coalesce(sum(price),0) as features_total from features where quotation_id=$1", [id]);
    const total = Number(totals.rows[0]?.features_total || 0);
    const dep = await query("select deployment_cost from quotations where id=$1", [id]);
    const deployment = Number(dep.rows[0]?.deployment_cost || 0);
    await query("update quotations set total_cost=$1 where id=$2", [total + deployment, id]);
    const r = await query(
      "select q.*, json_agg(f.* order by f.created_at) filter (where f.id is not null) as features from quotations q left join features f on f.quotation_id=q.id where q.id=$1 group by q.id",
      [id]
    );
    return NextResponse.json({ ok: true, quotation: r.rows[0] });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "unknown error" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await query("delete from quotations where id=$1", [params.id]);
  return NextResponse.json({ ok: true });
}