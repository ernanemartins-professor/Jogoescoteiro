import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/index'
import { players } from '@/db/schema'
import { eq } from 'drizzle-orm'

// GET - lista todos os jogadores
export async function GET() {
  try {
    const data = await db.select().from(players)
    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST - cria jogador
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, patrol } = body

    if (!name || !patrol) {
      return NextResponse.json({ error: 'name e patrol são obrigatórios' }, { status: 400 })
    }

    await db.insert(players).values({
      name,
      patrol,
      points: 0,
      level: 1,
      streak: 0,
    })

    return NextResponse.json({ message: 'Jogador registrado com sucesso!' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
