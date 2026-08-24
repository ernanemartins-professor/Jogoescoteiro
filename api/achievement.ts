import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../src/db/index'
import { achievements } from '../src/db/schema'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { playerId, code } = req.body

  try {
    await db.insert(achievements).values({
      playerId,
      code,
    })

    return res.status(200).json({ message: 'Conquista registrada com sucesso!' })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
