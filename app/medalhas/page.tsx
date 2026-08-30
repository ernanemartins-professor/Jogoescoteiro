"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Hud from "@/components/Hud";
import { MEDALS, LEVELS, levelForPoints } from "@/lib/gameData";
import { usePlayer } from "@/lib/usePlayer";

export default function MedalhasPage() {
  const router = useRouter();
  const { player, loaded } = usePlayer();
  const [owned, setOwned] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (loaded && !player) router.replace("/");
  }, [loaded, player, router]);

  useEffect(() => {
    if (player) {
      fetch(`/api/medals?playerId=${player.id}`)
        .then((r) => r.json())
        .then((d) => setOwned(new Set(d.medals ?? [])))
        .catch(() => {});
    }
  }, [player]);

  if (!loaded || !player) {
    return <div className="grid min-h-screen place-items-center text-emerald-300">Carregando…</div>;
  }

  const currentLevel = levelForPoints(player.points).level;

  return (
    <main className="mx-auto max-w-2xl pb-16">
      <Hud player={player} />
      <div className="px-4">
        <h1 className="mt-5 text-center text-2xl font-black text-amber-300">🏅 Medalhas</h1>
        <p className="mt-1 text-center text-sm text-emerald-300/80">
          {owned.size} de {MEDALS.length} conquistadas
        </p>

        {/* Níveis */}
        <h2 className="mt-6 mb-2 text-lg font-bold text-emerald-100">🎮 Progressão</h2>
        <div className="card rounded-2xl p-4">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {LEVELS.map((l) => {
              const reached = currentLevel >= l.level;
              return (
                <div
                  key={l.level}
                  className={`rounded-xl p-2 text-center ${
                    reached ? "bg-amber-400/15" : "bg-emerald-950/50 opacity-50"
                  }`}
                >
                  <div className="text-2xl">{l.emoji}</div>
                  <div className="text-[10px] font-bold text-emerald-100">{l.name}</div>
                  <div className="text-[9px] text-emerald-400">{l.min}+</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Medalhas */}
        <h2 className="mt-6 mb-2 text-lg font-bold text-emerald-100">🎖️ Conquistas</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MEDALS.map((m) => {
            const has = owned.has(m.code);
            return (
              <div
                key={m.code}
                className={`card flex items-center gap-3 rounded-2xl p-4 ${
                  has ? "border-amber-400/60" : "opacity-60"
                }`}
              >
                <span className={`text-4xl ${has ? "" : "grayscale"}`}>{m.emoji}</span>
                <div>
                  <div className="flex items-center gap-2 font-bold text-emerald-50">
                    {m.name}
                    {has ? <span className="text-xs text-amber-300">✓</span> : <span>🔒</span>}
                  </div>
                  <p className="text-xs text-emerald-300/70">{m.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <Link href="/mapa" className="mt-6 block text-center text-sm text-emerald-400 underline">
          ← Voltar ao mapa
        </Link>
      </div>
    </main>
  );
}
