import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.execute(sql`SELECT 1`);
    return Response.json({ ok: true, result });
  } catch (err) {
    return Response.json({ error: err.message });
  }
}