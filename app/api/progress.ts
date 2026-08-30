import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/index'
import { progress } from '@/db/schema'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { playerId, territory, completed, correct, total, meta } = body

    if (!playerId || !territory) {
      return NextResponse.json({ error: 'playerId e territory são obrigatórios' }, { status: 400 })
    }

    await db.insert(progress).values({
      playerId,
      territory,
      completed,
      correct,
      total,
      meta,
    })

    return NextResponse.json({ message: 'Progresso registrado com sucesso!' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
