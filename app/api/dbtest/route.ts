import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Aqui você pode testar a conexão com o banco
    // ou simplesmente retornar uma mensagem de sucesso
    return NextResponse.json({ ok: true, message: "Rota dbtest funcionando!" });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
