import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../../src/db/index'
import { progress } from '../../src/db/schema'
import { eq } from 'drizzle-orm'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { playerId } = req.query

  if (!playerId) {
    return res.status(400).json({ error: 'playerId é obrigatório' })
  }

  try {
    const result = await db.select().from(progress).where(eq(progress.playerId, Number(playerId)))

    return res.status(200).json({ progress: result })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
