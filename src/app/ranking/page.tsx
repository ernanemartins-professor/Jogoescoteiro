"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePlayer } from "@/lib/usePlayer";

interface PatrolRank {
  key: string;
  name: string;
  emoji: string;
  color: string;
  total: number;
  members: number;
}
interface IndRank {
  id: number;
  name: string;
  patrolName: string;
  patrolEmoji: string;
  points: number;
  level: number;
}

const MEDAL_POS = ["🥇", "🥈", "🥉"];

export default function RankingPage() {
  const { player } = usePlayer();
  const [patrols, setPatrols] = useState<PatrolRank[]>([]);
  const [individuals, setIndividuals] = useState<IndRank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      fetch("/api/ranking")
        .then((r) => r.json())
        .then((d) => {
          setPatrols(d.patrols ?? []);
          setIndividuals(d.individuals ?? []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };
    load();
    const t = setInterval(load, 8000); // atualização em tempo real
    return () => clearInterval(t);
  }, []);

  const maxTotal = Math.max(1, ...patrols.map((p) => p.total));

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16">
      <div className="pt-6 text-center">
        <h1 className="text-3xl font-black text-amber-300">⚜️ RANKING</h1>
        <p className="text-sm text-emerald-300/80">A Grande Expedição · atualizado ao vivo</p>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-bold text-emerald-100">🏆 Patrulhas</h2>
        {loading ? (
          <p className="text-emerald-400">Carregando…</p>
        ) : (
          <div className="grid gap-3">
            {patrols.map((p, i) => (
              <div key={p.key} className="card rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 text-center text-2xl">
                    {MEDAL_POS[i] ?? `${i + 1}º`}
                  </span>
                  <span className="text-3xl">{p.emoji}</span>
                  <div className="flex-1">
                    <div className="font-bold" style={{ color: p.color }}>
                      {p.name}
                    </div>
                    <div className="text-[11px] text-emerald-400">
                      {p.members} escoteiro(s)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-amber-300">
                      {p.total.toLocaleString("pt-BR")}
                    </div>
                    <div className="text-[10px] text-emerald-400">pontos</div>
                  </div>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-emerald-950">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(p.total / maxTotal) * 100}%`, background: p.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-emerald-100">👤 Escoteiros</h2>
        {individuals.length === 0 && !loading && (
          <p className="text-sm text-emerald-400">
            Nenhuma pontuação ainda. Seja o primeiro a jogar!
          </p>
        )}
        <div className="card overflow-hidden rounded-2xl">
          {individuals.map((ind, i) => (
            <div
              key={ind.id}
              className={`flex items-center gap-3 px-4 py-3 ${
                player && ind.id === player.id ? "bg-amber-400/10" : ""
              } ${i > 0 ? "border-t border-emerald-800/40" : ""}`}
            >
              <span className="w-7 text-center text-sm font-bold text-emerald-400">
                {MEDAL_POS[i] ?? i + 1}
              </span>
              <span className="text-lg">{ind.patrolEmoji}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-emerald-50">
                  {ind.name}
                  {player && ind.id === player.id && (
                    <span className="ml-1 text-[10px] text-amber-300">(você)</span>
                  )}
                </div>
                <div className="text-[11px] text-emerald-400">{ind.patrolName}</div>
              </div>
              <div className="text-right font-black text-amber-300">{ind.points}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 flex justify-center gap-4 text-sm">
        <Link href="/mapa" className="text-emerald-300 underline">
          🗺️ Mapa
        </Link>
        <Link href="/" className="text-emerald-300 underline">
          🏠 Início
        </Link>
      </div>
    </main>
  );
}
