import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ error: "ID do jogador é obrigatório" }, { status: 400 });
  }

  try {
    const { data: playerData, error: playerError } = await supabase
      .from("players")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (playerError || !playerData) {
      return NextResponse.json({ error: "Jogador não encontrado" }, { status: 404 });
    }

    const { data: playerAchievements } = await supabase
      .from("achievements")
      .select("*")
      .eq("playerId", Number(id));

    const { data: playerProgress } = await supabase
      .from("progress")
      .select("*")
      .eq("playerId", Number(id));

    return NextResponse.json({
      profile: {
        id: playerData.id,
        name: playerData.name,
        patrol: playerData.patrol,
        level: playerData.level,
        points: playerData.points,
        streak: playerData.streak,
      },
      stats: {
        progress: playerProgress?.map((p) => ({
          territory: p.territory,
          completed: p.completed,
          correct: p.correct,
          total: p.total,
          meta: p.meta,
          updatedAt: p.updatedAt,
        })),
      },
      achievements: playerAchievements?.map((a) => ({
        code: a.code,
        createdAt: a.createdAt,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}