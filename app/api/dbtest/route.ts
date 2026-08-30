import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Aqui você pode testar a conexão com o banco
    // ou simplesmente retornar uma mensagem de sucesso
    return NextResponse.json({ ok: true, message: "Rota dbtest funcionando!" });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
