import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Teste básico de conexão
    const result = await db.execute(sql`SELECT 1`);
    return Response.json({ ok: true, result });
  } catch (err) {
    if (err instanceof Error) {
      return Response.json({ error: err.message });
    }
    return Response.json({ error: String(err) });
  }
}