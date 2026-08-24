import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../src/db/index'
import { progress } from '../src/db/schema'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { playerId, territory, completed, correct, total, meta } = req.body

  try {
    await db.insert(progress).values({
      playerId,
      territory,
      completed,
      correct,
      total,
      meta,
    })

    return res.status(200).json({ message: 'Progresso registrado com sucesso!' })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
