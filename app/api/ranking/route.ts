import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Ranking por patrulha (soma dos pontos)
    const patrolRows = await db
      .select({
        patrol: players.patrol,
        total: sql<number>`coalesce(sum(${players.points}), 0)`,
        members: sql<number>`count(*)`,
      })
      .from(players)
      .groupBy(players.patrol);

    const patrolMap: Record<string, { total: number; members: number }> = {};
    for (const r of patrolRows) {
      patrolMap[r.patrol] = { total: Number(r.total), members: Number(r.members) };
    }

    const patrols = (Object.keys(PATROLS) as PatrolKey[])
      .map((key) => ({
        key,
        name: PATROLS[key].name,
        emoji: PATROLS[key].emoji,
        color: PATROLS[key].color,
        total: patrolMap[key]?.total ?? 0,
        members: patrolMap[key]?.members ?? 0,
      }))
      .sort((a, b) => b.total - a.total);

    // Ranking individual (top 30)
    const individualRows = await db
      .select()
      .from(players)
      .orderBy(desc(players.points))
      .limit(30);

    const individuals = individualRows.map((p) => ({
      id: p.id,
      name: p.name,
      patrol: p.patrol,
      patrolName: PATROLS[p.patrol as PatrolKey]?.name ?? p.patrol,
      patrolEmoji: PATROLS[p.patrol as PatrolKey]?.emoji ?? "",
      points: p.points,
      level: p.level,
    }));

    return Response.json({ patrols, individuals });
  } catch {
    return Response.json({ error: "Erro ao carregar ranking." }, { status: 500 });
  }
}
