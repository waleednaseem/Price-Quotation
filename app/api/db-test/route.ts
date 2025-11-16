import { NextResponse } from "next/server";
import { Client } from "pg";

export const runtime = "nodejs";

export async function GET() {
  const connectionString = process.env.DATABASE_URL || "postgres://postgres:demo123@localhost:5432/price_quotation";
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const info = await client.query(
      "select current_database() as db, current_user as user, inet_server_addr()::text as host, inet_server_port() as port, version() as version"
    );
    await client.end();
    const row = info.rows?.[0] || {};
    return NextResponse.json({ ok: true, connected: true, details: row });
  } catch (err: any) {
    try {
      await client.end();
    } catch {}
    return NextResponse.json({ ok: false, connected: false, error: err?.message || "unknown error" }, { status: 500 });
  }
}