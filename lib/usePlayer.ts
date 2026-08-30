"use client";

import { useEffect, useState, useCallback } from "react";

export interface StoredPlayer {
  id: number;
  name: string;
  patrol: string;
  points: number;
  level: number;
  streak: number;
}

const KEY = "grande-expedicao-player";

export function loadPlayer(): StoredPlayer | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredPlayer) : null;
  } catch {
    return null;
  }
}

export function savePlayer(p: StoredPlayer) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function clearPlayer() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function usePlayer() {
  const [player, setPlayer] = useState<StoredPlayer | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPlayer(loadPlayer());
    setLoaded(true);
  }, []);

  const update = useCallback((p: StoredPlayer | null) => {
    if (p) savePlayer(p);
    else clearPlayer();
    setPlayer(p);
  }, []);

  // Sincroniza pontos com o servidor
  const refresh = useCallback(async (id: number) => {
    try {
      const res = await fetch(`/api/player?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.player) {
          const np: StoredPlayer = {
            id: data.player.id,
            name: data.player.name,
            patrol: data.player.patrol,
            points: data.player.points,
            level: data.player.level,
            streak: data.player.streak,
          };
          savePlayer(np);
          setPlayer(np);
        }
      }
    } catch {
      /* offline: mantém local */
    }
  }, []);

  return { player, loaded, update, refresh };
}
