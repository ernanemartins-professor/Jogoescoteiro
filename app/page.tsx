"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PATROL_LIST } from "@/lib/gameData";
import { usePlayer } from "@/lib/usePlayer";

export default function HomePage() {
  const router = useRouter();
  const { player, loaded, update } = usePlayer();
  const [name, setName] = useState("");
  const [patrol, setPatrol] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function start() {
    setError("");
    if (!name.trim()) return setError("Digite o nome do escoteiro.");
    if (!patrol) return setError("Escolha sua patrulha.");
    setLoading(true);
    try {
      const res = await fetch("/api/player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), patrol }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao iniciar.");
        setLoading(false);
        return;
      }
      update({
        id: data.player.id,
        name: data.player.name,
        patrol: data.player.patrol,
        points: data.player.points,
        level: data.player.level,
        streak: data.player.streak,
      });
      router.push("/mapa");
    } catch {
      setError("Falha de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center px-5 py-8">
      <div className="animate-floaty mt-4 text-6xl">🏕️</div>
      <h1 className="mt-2 text-center text-4xl font-black tracking-tight text-amber-300 drop-shadow sm:text-5xl">
        A GRANDE EXPEDIÇÃO
      </h1>
      <p className="mt-2 text-center text-sm font-medium uppercase tracking-[0.2em] text-emerald-300/80">
        Conhecimento · Aventura · Desafio · Espírito Escoteiro
      </p>

      {loaded && player && (
        <div className="card mt-6 w-full rounded-2xl p-4 text-center">
          <p className="text-emerald-200">
            Bem-vindo de volta, <b className="text-amber-300">{player.name}</b>!
          </p>
          <button
            onClick={() => router.push("/mapa")}
            className="mt-3 w-full rounded-xl bg-amber-400 px-4 py-3 font-bold text-emerald-950 transition hover:bg-amber-300"
          >
            ▶ Continuar Expedição
          </button>
          <button
            onClick={() => update(null)}
            className="mt-2 text-xs text-emerald-400 underline"
          >
            Entrar como outro escoteiro
          </button>
        </div>
      )}

      {loaded && !player && (
        <div className="card mt-8 w-full rounded-2xl p-6">
          <label className="mb-2 block text-sm font-semibold text-emerald-200">
            👤 Nome do escoteiro
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: João Silva"
            maxLength={40}
            className="w-full rounded-xl border border-emerald-500/40 bg-emerald-950/60 px-4 py-3 text-emerald-50 outline-none placeholder:text-emerald-600 focus:border-amber-400"
          />

          <label className="mb-2 mt-5 block text-sm font-semibold text-emerald-200">
            🚩 Escolha sua patrulha
          </label>
          <div className="grid grid-cols-2 gap-3">
            {PATROL_LIST.map((p) => (
              <button
                key={p.key}
                onClick={() => setPatrol(p.key)}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 p-4 transition ${
                  patrol === p.key
                    ? "border-amber-400 bg-amber-400/15 scale-[1.02]"
                    : "border-emerald-600/40 bg-emerald-950/40 hover:border-emerald-400"
                }`}
                style={patrol === p.key ? { boxShadow: `0 0 24px ${p.color}55` } : undefined}
              >
                <span className="text-4xl">{p.emoji}</span>
                <span className="text-sm font-bold" style={{ color: p.color }}>
                  {p.name}
                </span>
              </button>
            ))}
          </div>

          {error && (
            <p className="animate-shake mt-4 rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            onClick={start}
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-amber-400 px-4 py-3.5 text-lg font-black text-emerald-950 transition hover:bg-amber-300 disabled:opacity-60"
          >
            {loading ? "Preparando..." : "⚜️ INICIAR EXPEDIÇÃO"}
          </button>
        </div>
      )}

      <div className="mt-6 flex gap-4 text-sm">
        <Link href="/ranking" className="text-emerald-300 underline hover:text-amber-300">
          🏆 Ranking
        </Link>
        <Link href="/instrucoes" className="text-emerald-300 underline hover:text-amber-300">
          📖 Como jogar
        </Link>
      </div>

      <p className="mt-8 text-center text-xs text-emerald-500">
        Objetivo: quem conhece mais de Escotismo? Cada ponto seu soma para a sua patrulha.
      </p>
    </main>
  );
}
