import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/index'
import { players, achievements, progress } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: 'ID do jogador é obrigatório' }, { status: 400 })
  }

  try {
    const playerData = await db.select().from(players).where(eq(players.id, Number(id)))
    if (playerData.length === 0) {
      return NextResponse.json({ error: 'Jogador não encontrado' }, { status: 404 })
    }

    const playerAchievements = await db.select().from(achievements).where(eq(achievements.playerId, Number(id)))
    const playerProgress = await db.select().from(progress).where(eq(progress.playerId, Number(id)))

    return NextResponse.json({
      profile: {
        id: playerData[0].id,
        name: playerData[0].name,
        patrol: playerData[0].patrol,
        level: playerData[0].level,
        points: playerData[0].points,
        streak: playerData[0].streak,
      },
      stats: {
        progress: playerProgress.map(p => ({
          territory: p.territory,
          completed: p.completed,
          correct: p.correct,
          total: p.total,
          meta: p.meta,
          updatedAt: p.updatedAt,
        }))
      },
      achievements: playerAchievements.map(a => ({
        code: a.code,
        createdAt: a.createdAt,
      }))
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
