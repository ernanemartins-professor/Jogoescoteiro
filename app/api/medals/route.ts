import { db } from "@/db";
import { achievements, progress } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const playerId = Number(searchParams.get("playerId"));
    if (!playerId) return Response.json({ error: "playerId obrigatório" }, { status: 400 });

    const owned = await db
      .select()
      .from(achievements)
      .where(eq(achievements.playerId, playerId));

    const prog = await db
      .select()
      .from(progress)
      .where(eq(progress.playerId, playerId));

    return Response.json({
      medals: owned.map((a) => a.code),
      progress: prog.map((p) => ({
        territory: p.territory,
        completed: p.completed,
        correct: p.correct,
        total: p.total,
      })),
    });
  } catch {
    return Response.json({ error: "Erro" }, { status: 500 });
  }
}
