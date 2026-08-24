import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../../src/db/index'
import { progress } from '../../src/db/schema'
import { eq } from 'drizzle-orm'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { playerId, territory, completed, correct, total, meta } = req.body

  try {
    await db.update(progress)
      .set({
        completed,
        correct,
        total,
        meta,
        updatedAt: new Date(),
      })
      .where(eq(progress.playerId, playerId))
      .where(eq(progress.territory, territory))

    return res.status(200).json({ message: 'Progresso atualizado com sucesso!' })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
