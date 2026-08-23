export type PatrolKey = "pantera" | "arara" | "cruzeiro" | "leao";

export const PATROLS: Record<
  PatrolKey,
  { name: string; emoji: string; color: string; gradient: string }
> = {
  pantera: {
    name: "Pantera",
    emoji: "🐆",
    color: "#f59e0b",
    gradient: "from-amber-500 to-yellow-700",
  },
  arara: {
    name: "Arara Azul",
    emoji: "🦜",
    color: "#3b82f6",
    gradient: "from-blue-500 to-indigo-700",
  },
  cruzeiro: {
    name: "Cruzeiro do Sul",
    emoji: "⭐",
    color: "#a855f7",
    gradient: "from-purple-500 to-fuchsia-700",
  },
  leao: {
    name: "Leão",
    emoji: "🦁",
    color: "#ef4444",
    gradient: "from-red-500 to-orange-700",
  },
};

export const PATROL_LIST = Object.entries(PATROLS).map(([key, v]) => ({
  key: key as PatrolKey,
  ...v,
}));

export interface Territory {
  id: string;
  order: number;
  name: string;
  emoji: string;
  desc: string;
  color: string;
}

export const TERRITORIES: Territory[] = [
  {
    id: "orientacao",
    order: 1,
    name: "Orientação",
    emoji: "🧭",
    desc: "Pontos cardeais, bússola, mapas, azimute e navegação.",
    color: "#0ea5e9",
  },
  {
    id: "acampamento",
    order: 2,
    name: "Acampamento",
    emoji: "🏕️",
    desc: "Montagem de barraca, higiene, equipamentos e segurança.",
    color: "#16a34a",
  },
  {
    id: "fogo",
    order: 3,
    name: "Fogo e Cozinha",
    emoji: "🔥",
    desc: "Tipos de fogo, cozinha mateira e prevenção de incêndios.",
    color: "#ea580c",
  },
  {
    id: "codigos",
    order: 4,
    name: "Códigos e Comunicação",
    emoji: "🔐",
    desc: "Morse, cifra de César, semáfora e mensagens secretas.",
    color: "#7c3aed",
  },
  {
    id: "natureza",
    order: 5,
    name: "Natureza e Meio Ambiente",
    emoji: "🌲",
    desc: "Fauna, flora, sustentabilidade e mínimo impacto.",
    color: "#059669",
  },
  {
    id: "socorros",
    order: 6,
    name: "Primeiros Socorros",
    emoji: "🩹",
    desc: "Prevenção, emergências, ferimentos e situações-problema.",
    color: "#dc2626",
  },
  {
    id: "nos",
    order: 7,
    name: "Nós e Pioneiria",
    emoji: "🪢",
    desc: "Nós, amarras e construções pioneiras.",
    color: "#b45309",
  },
  {
    id: "historia",
    order: 8,
    name: "História e Cultura",
    emoji: "🏴",
    desc: "Baden-Powell, Brownsea e a história do escotismo.",
    color: "#4b5563",
  },
  {
    id: "valores",
    order: 9,
    name: "Lei, Promessa e Valores",
    emoji: "⚜️",
    desc: "Honra, lealdade, serviço e decisões escoteiras.",
    color: "#c026d3",
  },
  {
    id: "campo",
    order: 10,
    name: "Técnicas de Campo",
    emoji: "🥾",
    desc: "Trilhas, sinais de pista, rastreamento e sobrevivência.",
    color: "#65a30d",
  },
];

export function territoryById(id: string) {
  return TERRITORIES.find((t) => t.id === id);
}

export const LEVELS = [
  { level: 1, name: "Explorador", emoji: "🌱", min: 0 },
  { level: 2, name: "Aventureiro", emoji: "🧗", min: 300 },
  { level: 3, name: "Desbravador", emoji: "🌄", min: 800 },
  { level: 4, name: "Rastreador", emoji: "🐾", min: 1600 },
  { level: 5, name: "Guia", emoji: "🧭", min: 3000 },
  { level: 6, name: "Mestre Escoteiro", emoji: "⚜️", min: 5000 },
];

export function levelForPoints(points: number) {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (points >= l.min) current = l;
  }
  return current;
}

export function nextLevel(points: number) {
  return LEVELS.find((l) => l.min > points) ?? null;
}

export interface Medal {
  code: string;
  name: string;
  emoji: string;
  desc: string;
}

export const MEDALS: Medal[] = [
  {
    code: "primeira_expedicao",
    name: "Primeira Expedição",
    emoji: "🏅",
    desc: "Completou seu primeiro território.",
  },
  {
    code: "codigo_secreto",
    name: "Código Secreto",
    emoji: "🔓",
    desc: "Acertou 10 desafios de códigos.",
  },
  {
    code: "mestre_morse",
    name: "Mestre Morse",
    emoji: "📡",
    desc: "Acertou 20 desafios de comunicação.",
  },
  {
    code: "navegador",
    name: "Navegador",
    emoji: "🧭",
    desc: "Completou o território de Orientação.",
  },
  {
    code: "guardiao_natureza",
    name: "Guardião da Natureza",
    emoji: "🌿",
    desc: "Completou o território de Natureza.",
  },
  {
    code: "especialista_nos",
    name: "Especialista em Nós",
    emoji: "🪢",
    desc: "Completou o território de Nós e Pioneiria.",
  },
  {
    code: "historiador",
    name: "Historiador",
    emoji: "📜",
    desc: "Completou a História do Escotismo.",
  },
  {
    code: "socorrista",
    name: "Socorrista",
    emoji: "🚑",
    desc: "Completou os Primeiros Socorros.",
  },
  {
    code: "mochileiro",
    name: "Mochileiro",
    emoji: "🎒",
    desc: "Completou uma missão de equipamentos.",
  },
  {
    code: "sequencia_ouro",
    name: "Sequência de Ouro",
    emoji: "🔥",
    desc: "Acertou 10 perguntas seguidas.",
  },
  {
    code: "explorador_nivel",
    name: "Aventureiro",
    emoji: "🧗",
    desc: "Alcançou o Nível 2.",
  },
  {
    code: "grande_explorador",
    name: "Grande Explorador",
    emoji: "⚜️",
    desc: "Completou todos os 10 territórios.",
  },
];

export function medalByCode(code: string) {
  return MEDALS.find((m) => m.code === code);
}
