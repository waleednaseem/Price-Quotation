import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const q = await query(
    "select q.*, json_agg(f.* order by f.created_at) filter (where f.id is not null) as features from quotations q left join features f on f.quotation_id=q.id group by q.id order by q.created_at desc"
  );
  return NextResponse.json({ ok: true, quotations: q.rows });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, projectName, companyName, clientId, deploymentCost, notes, features } = body;
    await query(
      "insert into quotations(id,project_name,company_name,client_id,deployment_cost,notes,status,total_cost) values($1,$2,$3,$4,$5,$6,$7,$8)",
      [
        id,
        projectName,
        companyName,
        clientId || null,
        deploymentCost || 0,
        notes || null,
        "draft",
        (features || []).reduce((s: number, f: any) => s + Number(f.price || 0), Number(deploymentCost || 0)),
      ]
    );
    for (const f of features || []) {
      await query(
        "insert into features(id,quotation_id,title,description,price,client_proposed_price) values($1,$2,$3,$4,$5,$6)",
        [f.id, id, f.title, f.description || null, f.price, f.clientProposedPrice || null]
      );
    }
    const r = await query(
      "select q.*, json_agg(f.* order by f.created_at) filter (where f.id is not null) as features from quotations q left join features f on f.quotation_id=q.id where q.id=$1 group by q.id",
      [id]
    );
    return NextResponse.json({ ok: true, quotation: r.rows[0] });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "unknown error" }, { status: 500 });
  }
}