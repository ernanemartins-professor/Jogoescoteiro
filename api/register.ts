import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../src/db/index'
import { players } from '../src/db/schema'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { name, patrol } = req.body

  try {
    await db.insert(players).values({
      name,
      patrol,
      points: 0,
      level: 1,
      streak: 0,
    })

    return res.status(200).json({ message: 'Jogador registrado com sucesso!' })
  } } catch (err: any) {
  console.error('Erro detalhado:', err)
  return res.status(500).json({ error: err.message })
}

}
