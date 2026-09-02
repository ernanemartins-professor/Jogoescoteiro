import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Cria (ou recupera) um jogador por nome + patrulha
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim().slice(0, 40);
    const patrol = String(body.patrol ?? "") as PatrolKey;

    if (!name) {
      return Response.json({ error: "Informe o nome do escoteiro." }, { status: 400 });
    }
    if (!PATROLS[patrol]) {
      return Response.json({ error: "Escolha uma patrulha válida." }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(players)
      .where(and(eq(players.name, name), eq(players.patrol, patrol)))
      .limit(1);

    if (existing.length > 0) {
      return Response.json({ player: existing[0], created: false });
    }

    const inserted = await db
      .insert(players)
      .values({ name, patrol })
      .returning();

    return Response.json({ player: inserted[0], created: true });
  } catch {
    return Response.json({ error: "Erro ao registrar jogador." }, { status: 500 });
  }
}

// Retorna dados atualizados de um jogador por id
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return Response.json({ error: "id obrigatório" }, { status: 400 });
    const rows = await db.select().from(players).where(eq(players.id, id)).limit(1);
    if (rows.length === 0) return Response.json({ error: "não encontrado" }, { status: 404 });
    return Response.json({ player: rows[0] });
  } catch {
    return Response.json({ error: "Erro" }, { status: 500 });
  }
}
