import Link from "next/link";
import { TERRITORIES, LEVELS } from "@/lib/gameData";
import { RAW_QUESTIONS } from "@/lib/questionBank";

export const dynamic = "force-dynamic";

export default function InstrucoesPage() {
  const total = RAW_QUESTIONS.length;
  return (
    <main className="mx-auto max-w-2xl px-4 pb-16">
      <div className="pt-6 text-center">
        <h1 className="text-3xl font-black text-amber-300">📖 Como Jogar</h1>
        <p className="text-sm text-emerald-300/80">A Grande Expedição</p>
      </div>

      <section className="card mt-6 rounded-2xl p-5">
        <h2 className="text-lg font-bold text-emerald-100">🎯 Objetivo</h2>
        <p className="mt-2 text-sm text-emerald-200">
          Não é uma prova — é uma aventura! O conhecimento escoteiro é a ferramenta para avançar
          pelos territórios, cumprir missões e ajudar sua patrulha a liderar o ranking.
        </p>
      </section>

      <section className="card mt-4 rounded-2xl p-5">
        <h2 className="text-lg font-bold text-emerald-100">🚩 Patrulhas</h2>
        <p className="mt-2 text-sm text-emerald-200">
          Ao entrar, você escolhe uma das 4 patrulhas: 🐆 Pantera, 🦜 Arara Azul, ⭐ Cruzeiro do Sul
          ou 🦁 Leão. Toda pontuação que você conquista soma para a sua patrulha!
        </p>
      </section>

      <section className="card mt-4 rounded-2xl p-5">
        <h2 className="text-lg font-bold text-emerald-100">🗺️ {TERRITORIES.length} Territórios</h2>
        <div className="mt-2 grid grid-cols-2 gap-1.5 text-sm text-emerald-200">
          {TERRITORIES.map((t) => (
            <span key={t.id}>
              {t.emoji} {t.name}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-emerald-400">
          Banco com <b className="text-amber-300">{total}</b> perguntas — a alternativa correta muda
          de lugar a cada rodada!
        </p>
      </section>

      <section className="card mt-4 rounded-2xl p-5">
        <h2 className="text-lg font-bold text-emerald-100">🏆 Pontuação</h2>
        <ul className="mt-2 space-y-1 text-sm text-emerald-200">
          <li>• Pergunta fácil: +10 · média: +20 · difícil: +30</li>
          <li>• Resposta rápida: bônus de velocidade (⏱️)</li>
          <li>• Sequência de acertos (3+): bônus 🔥</li>
          <li>• Missão: até +100 pontos</li>
          <li>• Complete um território com 70% para conquistá-lo</li>
        </ul>
      </section>

      <section className="card mt-4 rounded-2xl p-5">
        <h2 className="text-lg font-bold text-emerald-100">🎮 Níveis</h2>
        <div className="mt-2 flex flex-wrap gap-2 text-sm text-emerald-200">
          {LEVELS.map((l) => (
            <span key={l.level} className="rounded-full bg-emerald-950/60 px-2 py-1">
              {l.emoji} {l.name}
            </span>
          ))}
        </div>
      </section>

      <div className="mt-6 flex justify-center gap-4 text-sm">
        <Link href="/" className="rounded-xl bg-amber-400 px-5 py-2.5 font-bold text-emerald-950">
          ⚜️ Começar
        </Link>
        <Link href="/ranking" className="px-3 py-2.5 text-emerald-300 underline">
          🏆 Ranking
        </Link>
      </div>
    </main>
  );
}
