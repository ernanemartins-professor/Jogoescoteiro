import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../../src/db/index'
import { players, achievements, progress } from '../../src/db/schema'
import { eq } from 'drizzle-orm'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: 'ID do jogador é obrigatório' })
  }

  try {
    // Dados básicos do jogador
    const playerData = await db.select().from(players).where(eq(players.id, Number(id)))
    if (playerData.length === 0) {
      return res.status(404).json({ error: 'Jogador não encontrado' })
    }

    // Conquistas
    const playerAchievements = await db.select().from(achievements).where(eq(achievements.playerId, Number(id)))

    // Progresso
    const playerProgress = await db.select().from(progress).where(eq(progress.playerId, Number(id)))

    // Resposta formatada
    return res.status(200).json({
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
    return res.status(500).json({ error: err.message })
  }
}
