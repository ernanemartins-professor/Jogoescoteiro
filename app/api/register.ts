import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
    console.error('Erro detalhado:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
