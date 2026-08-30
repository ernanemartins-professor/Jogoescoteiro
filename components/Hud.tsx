"use client";

import Link from "next/link";
import { PATROLS, levelForPoints, nextLevel, type PatrolKey } from "@/lib/gameData";
import type { StoredPlayer } from "@/lib/usePlayer";

export default function Hud({ player }: { player: StoredPlayer }) {
  const patrol = PATROLS[player.patrol as PatrolKey];
  const lvl = levelForPoints(player.points);
  const nxt = nextLevel(player.points);
  const prevMin = lvl.min;
  const nextMin = nxt?.min ?? player.points;
  const pct = nxt
    ? Math.min(100, Math.round(((player.points - prevMin) / (nextMin - prevMin)) * 100))
    : 100;

  return (
    <div className="card sticky top-0 z-20 flex items-center gap-3 rounded-b-2xl px-4 py-3">
      <Link href="/mapa" className="text-2xl" title="Mapa">
        {patrol?.emoji ?? "🏕️"}
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-bold text-amber-300">{player.name}</span>
          <span className="text-xs text-emerald-400">· {patrol?.name}</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-emerald-950">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-300 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-0.5 flex justify-between text-[10px] text-emerald-400">
          <span>
            {lvl.emoji} {lvl.name}
          </span>
          <span>{nxt ? `${player.points}/${nextMin}` : "Máximo!"}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-black leading-none text-amber-300">{player.points}</div>
        <div className="text-[10px] text-emerald-400">pontos</div>
      </div>
    </div>
  );
}
