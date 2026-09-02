import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Registra pontos de uma sessão de jogo (quiz de território ou missão)
// body: { playerId, points, territory?, correct, total, streak, kind }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const playerId = Number(body.playerId);
    const points = Math.max(0, Math.floor(Number(body.points ?? 0)));
    const territory = body.territory ? String(body.territory) : null;
    const correct = Math.max(0, Math.floor(Number(body.correct ?? 0)));
    const total = Math.max(0, Math.floor(Number(body.total ?? 0)));
    const streak = Math.max(0, Math.floor(Number(body.streak ?? 0)));
    const kind = String(body.kind ?? "quiz"); // quiz | mission

    if (!playerId) {
      return Response.json({ error: "playerId obrigatório" }, { status: 400 });
    }

    const rows = await db.select().from(players).where(eq(players.id, playerId)).limit(1);
    if (rows.length === 0) {
      return Response.json({ error: "jogador não encontrado" }, { status: 404 });
    }
    const player = rows[0];

    const newPoints = player.points + points;
    const newLevel = levelForPoints(newPoints).level;
    const bestStreak = Math.max(player.streak, streak);

    await db
      .update(players)
      .set({
        points: newPoints,
        level: newLevel,
        streak: bestStreak,
        updatedAt: new Date(),
      })
      .where(eq(players.id, playerId));

    // Atualiza progresso do território (para quiz)
    let territoryCompleted = false;
    if (territory && kind === "quiz") {
      const existing = await db
        .select()
        .from(progress)
        .where(and(eq(progress.playerId, playerId), eq(progress.territory, territory)))
        .limit(1);

      const completedNow = total > 0 && correct / total >= 0.7 ? 1 : 0;
      if (completedNow) territoryCompleted = true;

      if (existing.length > 0) {
        const p = existing[0];
        await db
          .update(progress)
          .set({
            correct: p.correct + correct,
            total: p.total + total,
            completed: Math.max(p.completed, completedNow),
            updatedAt: new Date(),
          })
          .where(eq(progress.id, p.id));
      } else {
        await db.insert(progress).values({
          playerId,
          territory,
          correct,
          total,
          completed: completedNow,
        });
      }
    }

    // Concessão de medalhas
    const owned = await db
      .select()
      .from(achievements)
      .where(eq(achievements.playerId, playerId));
    const ownedCodes = new Set(owned.map((a) => a.code));
    const newMedals: string[] = [];

    const grant = (code: string) => {
      if (!ownedCodes.has(code) && MEDALS.some((m) => m.code === code)) {
        ownedCodes.add(code);
        newMedals.push(code);
      }
    };

    // Nível
    if (newLevel >= 2) grant("explorador_nivel");
    // Sequência
    if (bestStreak >= 10) grant("sequencia_ouro");
    // Missão específica
    if (kind === "mission" && body.medal) grant(String(body.medal));

    // Territórios completados
    if (territory && territoryCompleted) {
      if (territory === "orientacao") grant("navegador");
      if (territory === "natureza") grant("guardiao_natureza");
      if (territory === "nos") grant("especialista_nos");
      if (territory === "historia") grant("historiador");
      if (territory === "socorros") grant("socorrista");
    }

    // Primeira expedição: primeiro território completado
    const allProgress = await db
      .select()
      .from(progress)
      .where(eq(progress.playerId, playerId));
    const completedTerritories = allProgress.filter((p) => p.completed >= 1).length;
    if (completedTerritories >= 1) grant("primeira_expedicao");
    if (completedTerritories >= 10) grant("grande_explorador");

    // Códigos: acertos acumulados
    const codigosProg = allProgress.find((p) => p.territory === "codigos");
    if (codigosProg && codigosProg.correct >= 10) grant("codigo_secreto");
    if (codigosProg && codigosProg.correct >= 20) grant("mestre_morse");

    if (newMedals.length > 0) {
      await db
        .insert(achievements)
        .values(newMedals.map((code) => ({ playerId, code })));
    }

    const updated = await db.select().from(players).where(eq(players.id, playerId)).limit(1);

    return Response.json({
      player: updated[0],
      newMedals,
      gained: points,
    });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Erro ao salvar pontuação." }, { status: 500 });
  }
}

// evita warning de import não usado em algumas versões
void sql;
