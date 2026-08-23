// Missões narrativas — o coração da V3. Cada missão tem etapas de decisão
// que usam o conhecimento escoteiro. Pontos são somados ao concluir.

export interface MissionStep {
  scene: string;
  prompt: string;
  options: { text: string; correct: boolean; feedback: string }[];
}

export interface Mission {
  id: string;
  title: string;
  emoji: string;
  intro: string;
  reward: number; // pontos base ao concluir
  special?: boolean;
  medal?: string;
  steps: MissionStep[];
}

export const MISSIONS: Mission[] = [
  {
    id: "trilha-perdida",
    title: "A Trilha Perdida",
    emoji: "🥾",
    intro:
      "Sua patrulha perdeu contato com a base durante uma caminhada. Use tudo que aprendeu para voltar em segurança!",
    reward: 50,
    medal: "primeira_expedicao",
    steps: [
      {
        scene: "🧭 Você está voltado para o Norte. A base fica a Leste.",
        prompt: "Para chegar à base, para onde deve girar?",
        options: [
          { text: "90° para a direita", correct: true, feedback: "Correto! N → L girando à direita." },
          { text: "90° para a esquerda", correct: false, feedback: "Isso levaria ao Oeste." },
          { text: "Seguir reto para o Norte", correct: false, feedback: "A base fica a Leste." },
          { text: "Dar meia-volta", correct: false, feedback: "Isso apontaria para o Sul." },
        ],
      },
      {
        scene: "📡 Você encontra uma mensagem em Morse gravada num tronco: ... --- ...",
        prompt: "O que ela significa?",
        options: [
          { text: "SOS", correct: true, feedback: "Alguém pediu socorro por aqui!" },
          { text: "SIM", correct: false, feedback: "Não é esse o código." },
          { text: "PAZ", correct: false, feedback: "Reveja o Morse." },
          { text: "LUZ", correct: false, feedback: "Reveja o Morse." },
        ],
      },
      {
        scene: "🎒 Antes de seguir, você organiza a mochila.",
        prompt: "Qual item é indispensável nesta trilha?",
        options: [
          { text: "Cantil com água", correct: true, feedback: "Hidratação é essencial!" },
          { text: "Televisão", correct: false, feedback: "Peso inútil na mochila." },
          { text: "Console de videogame", correct: false, feedback: "Não ajuda na trilha." },
          { text: "Colchão de molas", correct: false, feedback: "Impossível de carregar." },
        ],
      },
      {
        scene: "🚧 Você vê um sinal de pista na trilha: um grande 'X'.",
        prompt: "O que ele indica?",
        options: [
          { text: "Caminho errado, não siga", correct: true, feedback: "Boa! Você evitou se perder." },
          { text: "Siga em frente", correct: false, feedback: "O 'X' indica o contrário." },
          { text: "Água potável", correct: false, feedback: "Não é esse o significado." },
          { text: "Acampamento aqui", correct: false, feedback: "Não é esse o significado." },
        ],
      },
      {
        scene: "🩹 Um colega escorrega e torce o tornozelo.",
        prompt: "Qual a primeira atitude?",
        options: [
          { text: "Repouso, gelo, compressão e elevação", correct: true, feedback: "Perfeito atendimento!" },
          { text: "Fazê-lo correr até a base", correct: false, feedback: "Isso pioraria a lesão." },
          { text: "Puxar o pé para 'ajeitar'", correct: false, feedback: "Nunca force a articulação." },
          { text: "Ignorar e seguir", correct: false, feedback: "Cuidar do colega vem primeiro." },
        ],
      },
    ],
  },
  {
    id: "resgate-noturno",
    title: "Resgate Noturno",
    emoji: "🌙",
    intro:
      "A noite chegou e um escoteiro se afastou do grupo. Você lidera o resgate com calma e técnica.",
    reward: 50,
    medal: "socorrista",
    steps: [
      {
        scene: "🔦 No escuro, você quer sinalizar sua posição.",
        prompt: "Qual a melhor forma de sinalizar?",
        options: [
          { text: "Lampejos de lanterna em Morse (SOS)", correct: true, feedback: "Sinal claro à distância!" },
          { text: "Ficar em silêncio total", correct: false, feedback: "Ninguém te encontraria." },
          { text: "Apagar todas as luzes", correct: false, feedback: "Dificultaria o resgate." },
          { text: "Correr sem rumo", correct: false, feedback: "Perigoso à noite." },
        ],
      },
      {
        scene: "⭐ Você olha o céu para se orientar.",
        prompt: "Qual constelação indica o Sul no hemisfério sul?",
        options: [
          { text: "Cruzeiro do Sul", correct: true, feedback: "Exato!" },
          { text: "Ursa Maior", correct: false, feedback: "Essa orienta no hemisfério norte." },
          { text: "Órion apenas", correct: false, feedback: "Não é a referência do Sul." },
          { text: "Nenhuma serve", correct: false, feedback: "O Cruzeiro do Sul serve!" },
        ],
      },
      {
        scene: "🔥 O grupo sente frio à espera do resgate.",
        prompt: "Onde acender um pequeno fogo com segurança?",
        options: [
          { text: "Área limpa, longe de folhas secas e barracas", correct: true, feedback: "Local seguro!" },
          { text: "Debaixo de uma árvore seca", correct: false, feedback: "Risco de incêndio." },
          { text: "Dentro da barraca", correct: false, feedback: "Muito perigoso." },
          { text: "Sobre grama alta e seca", correct: false, feedback: "Pega fogo fácil." },
        ],
      },
      {
        scene: "🥤 Um colega está com sede e tonto.",
        prompt: "O que fazer?",
        options: [
          { text: "Oferecer água em goles e descanso", correct: true, feedback: "Prevenindo a desidratação!" },
          { text: "Fazê-lo correr", correct: false, feedback: "Pioraria a situação." },
          { text: "Não dar água", correct: false, feedback: "Ele precisa se hidratar." },
          { text: "Dar apenas refrigerante", correct: false, feedback: "Água é o melhor." },
        ],
      },
    ],
  },
  {
    id: "codigo-secreto",
    title: "O Código Secreto",
    emoji: "🔐",
    intro:
      "Uma patrulha rival deixou pistas cifradas. Decifre tudo para encontrar o tesouro escoteiro!",
    reward: 60,
    medal: "codigo_secreto",
    steps: [
      {
        scene: "📜 Primeira pista em Morse: -- .- .--.",
        prompt: "O que significa?",
        options: [
          { text: "MAPA", correct: true, feedback: "Procure o mapa!" },
          { text: "FOGO", correct: false, feedback: "Reveja o Morse." },
          { text: "SOS", correct: false, feedback: "Reveja o Morse." },
          { text: "SUL", correct: false, feedback: "Reveja o Morse." },
        ],
      },
      {
        scene: "🔤 Segunda pista com Cifra de César (+3): QRUWH",
        prompt: "Qual a palavra original?",
        options: [
          { text: "NORTE", correct: true, feedback: "Vá para o Norte!" },
          { text: "SUL", correct: false, feedback: "Reveja a cifra." },
          { text: "LESTE", correct: false, feedback: "Reveja a cifra." },
          { text: "OESTE", correct: false, feedback: "Reveja a cifra." },
        ],
      },
      {
        scene: "🔢 Terceira pista em código numérico (A=1...): 1-7-21-1",
        prompt: "Que palavra é essa?",
        options: [
          { text: "AGUA", correct: true, feedback: "Siga até a fonte de água!" },
          { text: "FOGO", correct: false, feedback: "Reveja os números." },
          { text: "MAPA", correct: false, feedback: "Reveja os números." },
          { text: "TENDA", correct: false, feedback: "Reveja os números." },
        ],
      },
      {
        scene: "🚩 Pista final por sinais de pista: uma seta para frente.",
        prompt: "O que fazer?",
        options: [
          { text: "Seguir nesta direção", correct: true, feedback: "Tesouro encontrado!" },
          { text: "Voltar", correct: false, feedback: "A seta aponta para frente." },
          { text: "Parar de vez", correct: false, feedback: "A seta indica seguir." },
          { text: "Ir para o lado oposto", correct: false, feedback: "Siga a seta." },
        ],
      },
    ],
  },
  {
    id: "grande-expedicao",
    title: "A Grande Expedição",
    emoji: "⚜️",
    intro:
      "A missão especial que reúne todo o seu conhecimento. Só os melhores exploradores concluem!",
    reward: 100,
    special: true,
    medal: "grande_explorador",
    steps: [
      {
        scene: "🗺️ O acampamento-base precisa ser montado.",
        prompt: "Qual o melhor terreno?",
        options: [
          { text: "Plano, seco e com boa drenagem", correct: true, feedback: "Escolha perfeita!" },
          { text: "Fundo de vale úmido", correct: false, feedback: "Risco de alagar." },
          { text: "Sobre formigueiro", correct: false, feedback: "Nada confortável." },
          { text: "Rocha lisa inclinada", correct: false, feedback: "Instável." },
        ],
      },
      {
        scene: "🪢 É preciso montar uma alça de segurança em uma corda de resgate.",
        prompt: "Qual nó usar?",
        options: [
          { text: "Lais de guia", correct: true, feedback: "O rei dos nós!" },
          { text: "Nó de correr", correct: false, feedback: "Esse aperta." },
          { text: "Nó direito", correct: false, feedback: "Serve para unir cordas." },
          { text: "Volta do fiel", correct: false, feedback: "Serve para prender a poste." },
        ],
      },
      {
        scene: "🌲 Você encontra um animal silvestre na trilha.",
        prompt: "Qual a atitude correta?",
        options: [
          { text: "Observar à distância, sem tocar nem alimentar", correct: true, feedback: "Respeito à fauna!" },
          { text: "Dar comida", correct: false, feedback: "Faz mal ao animal." },
          { text: "Pegar no colo", correct: false, feedback: "Perigoso e errado." },
          { text: "Persegui-lo", correct: false, feedback: "Nunca faça isso." },
        ],
      },
      {
        scene: "⚜️ Você acha uma mochila perdida com dinheiro dentro. Ninguém viu.",
        prompt: "O que faz?",
        options: [
          { text: "Procuro o dono ou entrego ao chefe", correct: true, feedback: "Honra escoteira!" },
          { text: "Fico com o dinheiro", correct: false, feedback: "Contra a Lei Escoteira." },
          { text: "Escondo a mochila", correct: false, feedback: "Atitude desonesta." },
          { text: "Jogo fora", correct: false, feedback: "Errado." },
        ],
      },
      {
        scene: "🏴 Última pergunta da expedição: quem fundou o Movimento Escoteiro?",
        prompt: "Escolha o nome correto.",
        options: [
          { text: "Robert Baden-Powell", correct: true, feedback: "Você é um Mestre Escoteiro!" },
          { text: "Robert Kennedy", correct: false, feedback: "Não é ele." },
          { text: "Alexander Graham Bell", correct: false, feedback: "Não é ele." },
          { text: "Cristóvão Colombo", correct: false, feedback: "Não é ele." },
        ],
      },
    ],
  },
];

export function missionById(id: string) {
  return MISSIONS.find((m) => m.id === id);
}
