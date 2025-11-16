import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST() {
  try {
    const dir = path.join(process.cwd(), "db", "migrations");
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".sql")).sort();
    for (const file of files) {
      const applied = await query("select 1 from schema_migrations where filename=$1", [file]);
      if (applied.rowCount) continue;
      const sql = fs.readFileSync(path.join(dir, file), "utf8");
      await query(sql);
      await query("insert into schema_migrations(filename) values($1)", [file]);
    }
    return NextResponse.json({ ok: true, applied: files });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "unknown error" }, { status: 500 });
  }
}