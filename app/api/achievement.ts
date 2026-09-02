import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { playerId, code } = body

    if (!playerId || !code) {
      return NextResponse.json({ error: 'playerId e code são obrigatórios' }, { status: 400 })
    }

    await db.insert(achievements).values({
      playerId,
      code,
    })

    return NextResponse.json({ message: 'Conquista registrada com sucesso!' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
