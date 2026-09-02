import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const result = await pool.query("SELECT 1");
    return Response.json({ ok: true, result: result.rows });
  } catch (err) {
    if (err instanceof Error) {
      return Response.json({ error: err.message });
    }
    return Response.json({ error: String(err) });
  }
}