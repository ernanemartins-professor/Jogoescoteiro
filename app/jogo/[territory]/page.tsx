"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Hud from "@/components/Hud";
import { territoryById } from "@/lib/gameData";
import { usePlayer } from "@/lib/usePlayer";

interface ServedQuestion {
  id: string;
  q: string;
  options: string[];
  answer: number;
  difficulty: "facil" | "media" | "dificil";
  explain?: string;
  points: number;
}

const TIME_LIMIT = 20; // segundos por pergunta
const LETTERS = ["A", "B", "C", "D"];

export default function GamePage() {
  const params = useParams<{ territory: string }>();
  const router = useRouter();
  const { player, loaded, refresh } = usePlayer();
  const territory = territoryById(params.territory);

  const [questions, setQuestions] = useState<ServedQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [time, setTime] = useState(TIME_LIMIT);
  const [finished, setFinished] = useState(false);
  const [newMedals, setNewMedals] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (loaded && !player) router.replace("/");
  }, [loaded, player, router]);

  useEffect(() => {
    if (!territory) return;
    fetch(`/api/questions?territory=${params.territory}&count=10`)
      .then((r) => r.json())
      .then((d) => setQuestions(d.questions ?? []))
      .catch(() => {});
  }, [params.territory, territory]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const handleAnswer = useCallback(
    (choice: number | null) => {
      if (locked) return;
      setLocked(true);
      stopTimer();
      setSelected(choice);
      const q = questions[idx];
      if (!q) return;
      const isCorrect = choice === q.answer;
      if (isCorrect) {
        // bônus de velocidade + sequência
        const speedBonus = Math.round((time / TIME_LIMIT) * 10);
        const newStreak = streak + 1;
        const streakBonus = newStreak >= 3 ? Math.min(newStreak, 10) : 0;
        const gained = q.points + speedBonus + streakBonus;
        setScore((s) => s + gained);
        setCorrectCount((c) => c + 1);
        setStreak(newStreak);
        setBestStreak((b) => Math.max(b, newStreak));
      } else {
        setStreak(0);
      }
    },
    [locked, questions, idx, time, streak, stopTimer],
  );

  // timer
  useEffect(() => {
    if (finished || locked || questions.length === 0) return;
    setTime(TIME_LIMIT);
    timerRef.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleAnswer(null); // tempo esgotado = errou
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, questions.length, finished]);

  const next = useCallback(async () => {
    if (idx + 1 < questions.length) {
      setIdx((i) => i + 1);
      setSelected(null);
      setLocked(false);
    } else {
      setFinished(true);
      stopTimer();
      // salvar pontuação
      if (player) {
        setSaving(true);
        try {
          const res = await fetch("/api/score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              playerId: player.id,
              points: score,
              territory: params.territory,
              correct: correctCount,
              total: questions.length,
              streak: bestStreak,
              kind: "quiz",
            }),
          });
          const data = await res.json();
          setNewMedals(data.newMedals ?? []);
          await refresh(player.id);
        } catch {
          /* ignore */
        }
        setSaving(false);
      }
    }
  }, [idx, questions.length, player, score, correctCount, bestStreak, params.territory, refresh, stopTimer]);

  if (!territory) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-center">
          <p className="text-emerald-300">Território não encontrado.</p>
          <Link href="/mapa" className="mt-2 inline-block text-amber-300 underline">
            Voltar ao mapa
          </Link>
        </div>
      </div>
    );
  }

  if (!loaded || !player) {
    return <div className="grid min-h-screen place-items-center text-emerald-300">Carregando…</div>;
  }

  if (questions.length === 0) {
    return (
      <main className="mx-auto max-w-2xl">
        <Hud player={player} />
        <p className="mt-10 text-center text-emerald-300">Preparando desafios…</p>
      </main>
    );
  }

  // Tela final
  if (finished) {
    const pct = Math.round((correctCount / questions.length) * 100);
    const completed = pct >= 70;
    return (
      <main className="mx-auto max-w-2xl">
        <Hud player={player} />
        <div className="animate-pop card mt-8 mx-4 rounded-3xl p-6 text-center">
          <div className="text-6xl">{completed ? "🏅" : "💪"}</div>
          <h1 className="mt-2 text-2xl font-black text-amber-300">
            {territory.emoji} {territory.name}
          </h1>
          <p className="mt-1 text-emerald-300">
            {completed ? "Território conquistado!" : "Bom esforço! Tente de novo para conquistar."}
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Stat label="Acertos" value={`${correctCount}/${questions.length}`} />
            <Stat label="Aproveitamento" value={`${pct}%`} />
            <Stat label="Pontos" value={`+${score}`} highlight />
          </div>
          {bestStreak >= 3 && (
            <p className="mt-3 text-sm text-amber-300">🔥 Melhor sequência: {bestStreak} acertos</p>
          )}
          {newMedals.length > 0 && (
            <div className="animate-pop mt-4 rounded-xl bg-amber-400/15 p-3">
              <p className="text-sm font-bold text-amber-300">🎉 Nova(s) medalha(s)!</p>
              <p className="text-xs text-emerald-200">Confira em Medalhas.</p>
            </div>
          )}
          {saving && <p className="mt-3 text-xs text-emerald-400">Salvando pontuação…</p>}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 rounded-xl border border-emerald-500/50 px-4 py-3 font-bold text-emerald-100 hover:bg-emerald-500/10"
            >
              🔄 Jogar de novo
            </button>
            <Link
              href="/mapa"
              className="flex-1 rounded-xl bg-amber-400 px-4 py-3 text-center font-bold text-emerald-950 hover:bg-amber-300"
            >
              🗺️ Voltar ao mapa
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const q = questions[idx];
  const diffColor =
    q.difficulty === "facil" ? "#34d399" : q.difficulty === "media" ? "#fbbf24" : "#f87171";
  const diffLabel =
    q.difficulty === "facil" ? "Fácil" : q.difficulty === "media" ? "Média" : "Difícil";

  return (
    <main className="mx-auto max-w-2xl">
      <Hud player={player} />
      <div className="px-4">
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-bold text-emerald-300">
            {territory.emoji} {territory.name}
          </span>
          <span className="text-emerald-400">
            {idx + 1}/{questions.length}
          </span>
        </div>

        {/* progress */}
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-emerald-950">
          <div
            className="h-full bg-amber-400 transition-all"
            style={{ width: `${((idx) / questions.length) * 100}%` }}
          />
        </div>

        {/* timer */}
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xl">⏱️</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-emerald-950">
            <div
              className={`h-full rounded-full transition-all ${time <= 5 ? "bg-red-500" : "bg-emerald-400"}`}
              style={{ width: `${(time / TIME_LIMIT) * 100}%` }}
            />
          </div>
          <span className={`w-8 text-right font-bold ${time <= 5 ? "text-red-400" : "text-emerald-300"}`}>
            {time}s
          </span>
        </div>

        <div className="card animate-pop mt-4 rounded-2xl p-5">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
              style={{ background: `${diffColor}22`, color: diffColor }}
            >
              {diffLabel} · +{q.points}
            </span>
            {streak >= 3 && (
              <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                🔥 {streak} seguidas
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold leading-snug text-emerald-50">{q.q}</h2>

          <div className="mt-4 grid gap-2.5">
            {q.options.map((opt, i) => {
              const isAnswer = i === q.answer;
              const isSelected = i === selected;
              let cls = "border-emerald-600/40 bg-emerald-950/40 hover:border-emerald-400";
              if (locked) {
                if (isAnswer) cls = "border-emerald-400 bg-emerald-500/25";
                else if (isSelected) cls = "border-red-400 bg-red-500/20";
                else cls = "border-emerald-800/40 bg-emerald-950/30 opacity-60";
              }
              return (
                <button
                  key={i}
                  disabled={locked}
                  onClick={() => handleAnswer(i)}
                  className={`flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition ${cls}`}
                >
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-900 text-sm font-bold text-amber-300"
                  >
                    {LETTERS[i]}
                  </span>
                  <span className="flex-1 text-sm text-emerald-50">{opt}</span>
                  {locked && isAnswer && <span>✅</span>}
                  {locked && isSelected && !isAnswer && <span>❌</span>}
                </button>
              );
            })}
          </div>

          {locked && q.explain && (
            <p className="mt-3 rounded-lg bg-emerald-900/50 px-3 py-2 text-xs text-emerald-200">
              💡 {q.explain}
            </p>
          )}

          {locked && (
            <button
              onClick={next}
              className="mt-4 w-full rounded-xl bg-amber-400 px-4 py-3 font-black text-emerald-950 transition hover:bg-amber-300"
            >
              {idx + 1 < questions.length ? "Próxima ▶" : "Ver resultado 🏁"}
            </button>
          )}
        </div>

        <div className="mt-3 text-center text-sm text-emerald-400">
          Pontos nesta rodada: <b className="text-amber-300">{score}</b>
        </div>
        <Link href="/mapa" className="mt-4 block text-center text-xs text-emerald-500 underline">
          Sair para o mapa
        </Link>
      </div>
    </main>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl bg-emerald-950/60 p-3">
      <div className={`text-xl font-black ${highlight ? "text-amber-300" : "text-emerald-100"}`}>
        {value}
      </div>
      <div className="text-[10px] uppercase text-emerald-400">{label}</div>
    </div>
  );
}
