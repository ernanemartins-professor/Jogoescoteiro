"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Hud from "@/components/Hud";
import { missionById } from "@/lib/missions";
import { usePlayer } from "@/lib/usePlayer";

export default function MissionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { player, loaded, refresh } = usePlayer();
  const mission = missionById(params.id);

  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [earned, setEarned] = useState(0);
  const [newMedals, setNewMedals] = useState<string[]>([]);

  useEffect(() => {
    if (loaded && !player) router.replace("/");
  }, [loaded, player, router]);

  if (!mission) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-center">
          <p className="text-emerald-300">Missão não encontrada.</p>
          <Link href="/missoes" className="mt-2 inline-block text-amber-300 underline">
            Voltar às missões
          </Link>
        </div>
      </div>
    );
  }

  if (!loaded || !player) {
    return <div className="grid min-h-screen place-items-center text-emerald-300">Carregando…</div>;
  }

  const current = mission.steps[step];

  function answer(i: number) {
    if (locked) return;
    setLocked(true);
    setSelected(i);
    if (current.options[i].correct) setCorrectCount((c) => c + 1);
  }

  async function next() {
    if (step + 1 < mission!.steps.length) {
      setStep((s) => s + 1);
      setSelected(null);
      setLocked(false);
    } else {
      // conclusão: pontos proporcionais aos acertos + reward base se >= metade
      const total = mission!.steps.length;
      const finalCorrect = correctCount;
      const ratio = finalCorrect / total;
      const points = Math.round(mission!.reward * ratio) + (ratio >= 0.6 ? mission!.reward : 0);
      setEarned(points);
      setFinished(true);
      if (player) {
        try {
          const res = await fetch("/api/score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              playerId: player.id,
              points,
              correct: finalCorrect,
              total,
              kind: "mission",
              medal: ratio >= 0.6 ? mission!.medal : undefined,
            }),
          });
          const data = await res.json();
          setNewMedals(data.newMedals ?? []);
          await refresh(player.id);
        } catch {
          /* ignore */
        }
      }
    }
  }

  // Intro
  if (!started) {
    return (
      <main className="mx-auto max-w-2xl">
        <Hud player={player} />
        <div className="card animate-pop mt-8 mx-4 rounded-3xl p-6 text-center">
          <div className="animate-floaty text-6xl">{mission.emoji}</div>
          <h1 className="mt-2 text-2xl font-black text-amber-300">{mission.title}</h1>
          <p className="mt-3 text-emerald-200">{mission.intro}</p>
          <p className="mt-4 text-sm text-emerald-400">
            {mission.steps.length} decisões · até +{mission.reward * 2} pontos
          </p>
          <button
            onClick={() => setStarted(true)}
            className="mt-6 w-full rounded-xl bg-amber-400 px-4 py-3.5 text-lg font-black text-emerald-950 hover:bg-amber-300"
          >
            ▶ Iniciar Missão
          </button>
          <Link href="/missoes" className="mt-3 block text-sm text-emerald-400 underline">
            ← Voltar
          </Link>
        </div>
      </main>
    );
  }

  // Final
  if (finished) {
    const total = mission.steps.length;
    const pct = Math.round((correctCount / total) * 100);
    const success = correctCount / total >= 0.6;
    return (
      <main className="mx-auto max-w-2xl">
        <Hud player={player} />
        <div className="card animate-pop mt-8 mx-4 rounded-3xl p-6 text-center">
          <div className="text-6xl">{success ? "🎖️" : "🧭"}</div>
          <h1 className="mt-2 text-2xl font-black text-amber-300">
            {success ? "Missão Cumprida!" : "Missão Encerrada"}
          </h1>
          <p className="mt-1 text-emerald-300">
            {success
              ? "Excelente trabalho, explorador!"
              : "Faltou pouco. Refaça a missão para melhorar!"}
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <MStat label="Decisões certas" value={`${correctCount}/${total}`} />
            <MStat label="Desempenho" value={`${pct}%`} />
            <MStat label="Pontos" value={`+${earned}`} highlight />
          </div>
          {newMedals.length > 0 && (
            <div className="animate-pop mt-4 rounded-xl bg-amber-400/15 p-3">
              <p className="text-sm font-bold text-amber-300">🎉 Você ganhou uma medalha!</p>
            </div>
          )}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 rounded-xl border border-emerald-500/50 px-4 py-3 font-bold text-emerald-100 hover:bg-emerald-500/10"
            >
              🔄 Refazer
            </button>
            <Link
              href="/missoes"
              className="flex-1 rounded-xl bg-amber-400 px-4 py-3 text-center font-bold text-emerald-950 hover:bg-amber-300"
            >
              Outras missões ▶
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Etapa
  return (
    <main className="mx-auto max-w-2xl">
      <Hud player={player} />
      <div className="px-4">
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-bold text-emerald-300">
            {mission.emoji} {mission.title}
          </span>
          <span className="text-emerald-400">
            {step + 1}/{mission.steps.length}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-emerald-950">
          <div
            className="h-full bg-amber-400 transition-all"
            style={{ width: `${(step / mission.steps.length) * 100}%` }}
          />
        </div>

        <div className="card animate-pop mt-4 rounded-2xl p-5">
          <p className="rounded-xl bg-emerald-900/50 p-3 text-emerald-100">{current.scene}</p>
          <h2 className="mt-3 text-lg font-bold text-amber-200">{current.prompt}</h2>

          <div className="mt-4 grid gap-2.5">
            {current.options.map((opt, i) => {
              const isSel = i === selected;
              let cls = "border-emerald-600/40 bg-emerald-950/40 hover:border-emerald-400";
              if (locked) {
                if (opt.correct) cls = "border-emerald-400 bg-emerald-500/25";
                else if (isSel) cls = "border-red-400 bg-red-500/20";
                else cls = "border-emerald-800/40 bg-emerald-950/30 opacity-60";
              }
              return (
                <button
                  key={i}
                  disabled={locked}
                  onClick={() => answer(i)}
                  className={`rounded-xl border-2 p-3.5 text-left text-sm text-emerald-50 transition ${cls}`}
                >
                  {opt.text}
                  {locked && opt.correct && " ✅"}
                  {locked && isSel && !opt.correct && " ❌"}
                </button>
              );
            })}
          </div>

          {locked && selected !== null && (
            <p className="mt-3 rounded-lg bg-emerald-900/50 px-3 py-2 text-sm text-emerald-200">
              💬 {current.options[selected].feedback}
            </p>
          )}

          {locked && (
            <button
              onClick={next}
              className="mt-4 w-full rounded-xl bg-amber-400 px-4 py-3 font-black text-emerald-950 hover:bg-amber-300"
            >
              {step + 1 < mission.steps.length ? "Continuar ▶" : "Concluir missão 🏁"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function MStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl bg-emerald-950/60 p-3">
      <div className={`text-lg font-black ${highlight ? "text-amber-300" : "text-emerald-100"}`}>
        {value}
      </div>
      <div className="text-[10px] uppercase text-emerald-400">{label}</div>
    </div>
  );
}
