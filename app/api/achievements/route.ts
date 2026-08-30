import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/index'
import { achievements } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const playerId = searchParams.get('playerId')

    if (!playerId) {
      return NextResponse.json({ error: 'playerId é obrigatório' }, { status: 400 })
    }

    const data = await db.select().from(achievements).where(eq(achievements.playerId, Number(playerId)))

    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
