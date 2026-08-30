"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Hud from "@/components/Hud";
import { TERRITORIES } from "@/lib/gameData";
import { usePlayer } from "@/lib/usePlayer";

export default function MapaPage() {
  const router = useRouter();
  const { player, loaded, refresh } = usePlayer();
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [medalCount, setMedalCount] = useState(0);

  useEffect(() => {
    if (loaded && !player) router.replace("/");
  }, [loaded, player, router]);

  useEffect(() => {
    if (player) {
      refresh(player.id);
      fetch(`/api/medals?playerId=${player.id}`)
        .then((r) => r.json())
        .then((d) => {
          const map: Record<string, boolean> = {};
          for (const p of d.progress ?? []) map[p.territory] = p.completed >= 1;
          setProgress(map);
          setMedalCount((d.medals ?? []).length);
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  if (!loaded || !player) {
    return <div className="grid min-h-screen place-items-center text-emerald-300">Carregando…</div>;
  }

  return (
    <main className="mx-auto max-w-3xl pb-16">
      <Hud player={player} />

      <div className="px-4">
        <h1 className="mt-5 text-center text-2xl font-black text-amber-300">
          🗺️ Mapa da Expedição
        </h1>
        <p className="mt-1 text-center text-sm text-emerald-300/80">
          Explore os 10 territórios. Complete-os com 70% de acertos para conquistar medalhas!
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TERRITORIES.map((t) => (
            <Link
              key={t.id}
              href={`/jogo/${t.id}`}
              className="card group flex items-center gap-4 rounded-2xl p-4 transition hover:scale-[1.01] hover:border-amber-400/60"
            >
              <div
                className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-3xl"
                style={{ background: `${t.color}22`, border: `1px solid ${t.color}66` }}
              >
                {t.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-500">
                    {String(t.order).padStart(2, "0")}
                  </span>
                  <h2 className="truncate font-bold text-emerald-50">{t.name}</h2>
                  {progress[t.id] && <span title="Concluído">✅</span>}
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-emerald-300/70">{t.desc}</p>
              </div>
              <span className="text-amber-400 transition group-hover:translate-x-1">▶</span>
            </Link>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            href="/missoes"
            className="card flex items-center gap-3 rounded-2xl border-amber-400/40 p-4 transition hover:scale-[1.01]"
          >
            <span className="text-3xl">🚨</span>
            <div>
              <div className="font-bold text-amber-300">Missões</div>
              <div className="text-xs text-emerald-300/70">Aventuras de decisão</div>
            </div>
          </Link>
          <Link
            href="/medalhas"
            className="card flex items-center gap-3 rounded-2xl p-4 transition hover:scale-[1.01]"
          >
            <span className="text-3xl">🏅</span>
            <div>
              <div className="font-bold text-emerald-100">Medalhas</div>
              <div className="text-xs text-emerald-300/70">{medalCount} conquistada(s)</div>
            </div>
          </Link>
          <Link
            href="/ranking"
            className="card flex items-center gap-3 rounded-2xl p-4 transition hover:scale-[1.01]"
          >
            <span className="text-3xl">🏆</span>
            <div>
              <div className="font-bold text-emerald-100">Ranking</div>
              <div className="text-xs text-emerald-300/70">Patrulhas & escoteiros</div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
