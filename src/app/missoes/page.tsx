"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Hud from "@/components/Hud";
import { MISSIONS } from "@/lib/missions";
import { usePlayer } from "@/lib/usePlayer";

export default function MissoesPage() {
  const router = useRouter();
  const { player, loaded } = usePlayer();

  useEffect(() => {
    if (loaded && !player) router.replace("/");
  }, [loaded, player, router]);

  if (!loaded || !player) {
    return <div className="grid min-h-screen place-items-center text-emerald-300">Carregando…</div>;
  }

  return (
    <main className="mx-auto max-w-2xl pb-16">
      <Hud player={player} />
      <div className="px-4">
        <h1 className="mt-5 text-center text-2xl font-black text-amber-300">🚨 Missões</h1>
        <p className="mt-1 text-center text-sm text-emerald-300/80">
          Aventuras narrativas onde cada decisão vale pontos. Use tudo que você aprendeu!
        </p>

        <div className="mt-5 grid gap-3">
          {MISSIONS.map((m) => (
            <Link
              key={m.id}
              href={`/missoes/${m.id}`}
              className={`card flex items-center gap-4 rounded-2xl p-4 transition hover:scale-[1.01] ${
                m.special ? "border-amber-400/60" : ""
              }`}
            >
              <span className="text-4xl">{m.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-emerald-50">{m.title}</h2>
                  {m.special && (
                    <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                      ESPECIAL
                    </span>
                  )}
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-emerald-300/70">{m.intro}</p>
              </div>
              <div className="text-right">
                <div className="font-black text-amber-300">+{m.reward}</div>
                <div className="text-[10px] text-emerald-400">pontos</div>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/mapa" className="mt-6 block text-center text-sm text-emerald-400 underline">
          ← Voltar ao mapa
        </Link>
      </div>
    </main>
  );
}
