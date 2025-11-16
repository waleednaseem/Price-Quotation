import fs from "fs";
import path from "path";
import { Client } from "pg";

async function run() {
  const connectionString = process.env.DATABASE_URL || "postgres://postgres@localhost:5432/price_quotation";
  const client = new Client({ connectionString });
  await client.connect();
  const dir = path.join(process.cwd(), "db", "migrations");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  await client.query("create table if not exists schema_migrations(id serial primary key, filename text not null unique, applied_at timestamptz not null default now())");
  for (const file of files) {
    const exists = await client.query("select 1 from schema_migrations where filename=$1", [file]);
    if (exists.rowCount) continue;
    const sql = fs.readFileSync(path.join(dir, file), "utf8");
    await client.query(sql);
    await client.query("insert into schema_migrations(filename) values($1)", [file]);
    console.log(`Applied ${file}`);
  }
  await client.end();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});