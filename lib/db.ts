import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || "postgres://postgres@localhost:5432/price_quotation";

export const pool = new Pool({ connectionString });

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}