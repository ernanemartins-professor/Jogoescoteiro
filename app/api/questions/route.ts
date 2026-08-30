import { getServedQuestions } from "@/lib/questionBank";
import { territoryById } from "@/lib/gameData";

export const dynamic = "force-dynamic";

// Serve perguntas embaralhadas de um território.
// A alternativa correta é alternada entre as posições (garantido no shuffle).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const territory = searchParams.get("territory") ?? "";
  const count = Math.min(20, Math.max(1, Number(searchParams.get("count") ?? 10)));

  if (!territoryById(territory)) {
    return Response.json({ error: "Território inválido" }, { status: 400 });
  }

  const questions = getServedQuestions(territory, count);
  return Response.json({ questions });
}
