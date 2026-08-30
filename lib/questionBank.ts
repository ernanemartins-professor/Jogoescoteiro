// Banco de perguntas de A GRANDE EXPEDIÇÃO
// Cada pergunta define a alternativa correta pelo índice "answer".
// A alternância da alternativa correta é garantida na hora de servir
// (ver shuffleQuestion), embaralhando as opções de cada pergunta.

export type Difficulty = "facil" | "media" | "dificil";

export interface RawQuestion {
  territory: string;
  q: string;
  options: string[];
  answer: number; // índice da opção correta em options
  difficulty: Difficulty;
  explain?: string;
}

export interface ServedQuestion {
  id: string;
  territory: string;
  q: string;
  options: string[];
  answer: number;
  difficulty: Difficulty;
  explain?: string;
  points: number;
}

export const DIFFICULTY_POINTS: Record<Difficulty, number> = {
  facil: 10,
  media: 20,
  dificil: 30,
};

// ---------- utilidades de geração ----------

function pick<T>(arr: T[], n: number, exclude: T[] = []): T[] {
  const pool = arr.filter((x) => !exclude.includes(x));
  const res: T[] = [];
  const copy = [...pool];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    res.push(copy.splice(idx, 1)[0]);
  }
  return res;
}

// Cria uma pergunta de múltipla escolha a partir de uma resposta correta
// e um conjunto de distratores plausíveis.
function mc(
  territory: string,
  q: string,
  correct: string,
  distractors: string[],
  difficulty: Difficulty,
  explain?: string,
): RawQuestion {
  const opts = [correct, ...pick(distractors, 3, [correct])];
  return { territory, q, options: opts, answer: 0, difficulty, explain };
}

const QUESTIONS: RawQuestion[] = [];

// =========================================================
// 01 — ORIENTAÇÃO
// =========================================================
(() => {
  const T = "orientacao";
  const cardeais = ["Norte", "Sul", "Leste", "Oeste"];
  const colaterais = ["Nordeste", "Noroeste", "Sudeste", "Sudoeste"];
  const all = [...cardeais, ...colaterais];

  // Rotação a partir de uma direção
  const dirOrder = [
    "Norte",
    "Nordeste",
    "Leste",
    "Sudeste",
    "Sul",
    "Sudoeste",
    "Oeste",
    "Noroeste",
  ];
  const rotBase = [
    { from: "Norte", right90: "Leste" },
    { from: "Leste", right90: "Sul" },
    { from: "Sul", right90: "Oeste" },
    { from: "Oeste", right90: "Norte" },
  ];
  for (const r of rotBase) {
    QUESTIONS.push(
      mc(
        T,
        `Você está voltado para o ${r.from} e gira 90° para a direita. Para qual direção estará olhando?`,
        r.right90,
        all,
        "facil",
        "Girar 90° à direita segue a ordem N→L→S→O.",
      ),
    );
  }
  // Rotação para a esquerda
  const rotLeft = [
    { from: "Norte", left90: "Oeste" },
    { from: "Oeste", left90: "Sul" },
    { from: "Sul", left90: "Leste" },
    { from: "Leste", left90: "Norte" },
  ];
  for (const r of rotLeft) {
    QUESTIONS.push(
      mc(
        T,
        `Você está voltado para o ${r.from} e gira 90° para a esquerda. Para onde olha agora?`,
        r.left90,
        all,
        "media",
      ),
    );
  }
  // Meia-volta 180°
  for (const c of cardeais) {
    const opp: Record<string, string> = {
      Norte: "Sul",
      Sul: "Norte",
      Leste: "Oeste",
      Oeste: "Leste",
    };
    QUESTIONS.push(
      mc(
        T,
        `De frente para o ${c}, você dá meia-volta (180°). Para onde está olhando?`,
        opp[c],
        all,
        "facil",
      ),
    );
  }
  // Colaterais entre cardeais
  const colDef = [
    { a: "Norte", b: "Leste", r: "Nordeste" },
    { a: "Norte", b: "Oeste", r: "Noroeste" },
    { a: "Sul", b: "Leste", r: "Sudeste" },
    { a: "Sul", b: "Oeste", r: "Sudoeste" },
  ];
  for (const c of colDef) {
    QUESTIONS.push(
      mc(
        T,
        `Qual ponto colateral fica entre o ${c.a} e o ${c.b}?`,
        c.r,
        colaterais,
        "media",
      ),
    );
  }
  // Azimute
  const azimutes = [
    { az: "0° (ou 360°)", d: "Norte" },
    { az: "90°", d: "Leste" },
    { az: "180°", d: "Sul" },
    { az: "270°", d: "Oeste" },
    { az: "45°", d: "Nordeste" },
    { az: "135°", d: "Sudeste" },
    { az: "225°", d: "Sudoeste" },
    { az: "315°", d: "Noroeste" },
  ];
  for (const a of azimutes) {
    QUESTIONS.push(
      mc(
        T,
        `Um azimute de ${a.az} aponta para qual direção?`,
        a.d,
        all,
        "media",
        "Azimute é o ângulo medido a partir do Norte, no sentido horário.",
      ),
    );
  }
  // Bússola / conceitos
  const conc: [string, string, string[], Difficulty][] = [
    [
      "A agulha imantada de uma bússola aponta sempre para qual direção?",
      "Norte magnético",
      ["Sul magnético", "Leste", "Para o Sol"],
      "facil",
    ],
    [
      "Ao meio-dia, no hemisfério sul, sua sombra aponta aproximadamente para qual direção?",
      "Sul",
      ["Norte", "Leste", "Oeste"],
      "media",
    ],
    [
      "O Sol nasce aproximadamente em qual direção?",
      "Leste",
      ["Oeste", "Norte", "Sul"],
      "facil",
    ],
    [
      "O Sol se põe aproximadamente em qual direção?",
      "Oeste",
      ["Leste", "Norte", "Sul"],
      "facil",
    ],
    [
      "Que constelação ajuda a encontrar o Sul no hemisfério sul?",
      "Cruzeiro do Sul",
      ["Ursa Maior", "Órion", "Escorpião"],
      "media",
    ],
    [
      "Em um mapa, para onde geralmente aponta o topo da folha?",
      "Norte",
      ["Sul", "Leste", "Oeste"],
      "facil",
    ],
    [
      "O que a escala de um mapa indica?",
      "A relação entre a distância no mapa e a real",
      [
        "A altitude do terreno",
        "A direção do Norte",
        "A quantidade de trilhas",
      ],
      "media",
    ],
    [
      "As linhas que unem pontos de mesma altitude em um mapa são chamadas de:",
      "Curvas de nível",
      ["Meridianos", "Paralelos", "Azimutes"],
      "dificil",
    ],
    [
      "As coordenadas geográficas são formadas por:",
      "Latitude e longitude",
      ["Norte e Sul", "Azimute e escala", "Altitude e relevo"],
      "media",
    ],
    [
      "A linha do Equador tem qual latitude?",
      "0°",
      ["90°", "180°", "45°"],
      "media",
    ],
    [
      "Uma bússola serve principalmente para:",
      "Determinar direções",
      ["Medir a temperatura", "Medir distâncias", "Ver a hora"],
      "facil",
    ],
    [
      "Para 'orientar' um mapa corretamente devemos:",
      "Alinhar o Norte do mapa com o Norte real",
      [
        "Dobrá-lo ao meio",
        "Colocá-lo de cabeça para baixo",
        "Cobrir a legenda",
      ],
      "media",
    ],
    [
      "Numa trilha marcada, seguir os sinais serve para:",
      "Não se perder e chegar ao destino",
      [
        "Marcar território",
        "Deixar lixo pelo caminho",
        "Confundir outras patrulhas",
      ],
      "facil",
    ],
    [
      "Quantos graus tem uma volta completa (rosa dos ventos)?",
      "360°",
      ["180°", "90°", "270°"],
      "facil",
    ],
    [
      "O que é 'declinação magnética'?",
      "A diferença entre o Norte magnético e o Norte verdadeiro",
      [
        "A inclinação do mapa",
        "O ângulo do Sol",
        "A força do vento",
      ],
      "dificil",
    ],
  ];
  for (const [q, c, d, diff] of conc) QUESTIONS.push(mc(T, q, c, d, diff));
})();

// =========================================================
// 02 — ACAMPAMENTO
// =========================================================
(() => {
  const T = "acampamento";
  const items: [string, string, string[], Difficulty][] = [
    [
      "Ao escolher o local do acampamento, o terreno ideal é:",
      "Plano, seco e com boa drenagem",
      ["No fundo de um vale úmido", "Sobre formigueiros", "Em rocha lisa e inclinada"],
      "facil",
    ],
    [
      "Por que evitar montar a barraca em depressões do terreno?",
      "Pode acumular água da chuva",
      ["Fica mais quente", "Atrai pássaros", "Melhora o sinal do celular"],
      "media",
    ],
    [
      "A parte de baixo da barraca que protege do chão úmido chama-se:",
      "Soalho (piso impermeável)",
      ["Sobreteto", "Espeque", "Vento"],
      "media",
    ],
    [
      "O 'sobreteto' da barraca serve para:",
      "Proteger da chuva e do sol",
      ["Servir de travesseiro", "Marcar a patrulha", "Amarrar a comida"],
      "facil",
    ],
    [
      "As estacas (espeques) da barraca servem para:",
      "Fixar a barraca ao solo",
      ["Cozinhar", "Sinalizar trilhas", "Cavar buracos"],
      "facil",
    ],
    [
      "Onde o lixo deve ficar no acampamento?",
      "Ensacado e recolhido para ser levado embora",
      ["Enterrado em qualquer lugar", "Jogado no rio", "Queimado dentro da barraca"],
      "media",
    ],
    [
      "A área destinada à cozinha do acampamento deve ficar:",
      "Organizada, limpa e afastada do banheiro",
      ["Dentro das barracas", "Perto do lixo", "Em terreno inclinado e molhado"],
      "media",
    ],
    [
      "Antes de armar a barraca é recomendável:",
      "Limpar o local de pedras e galhos",
      ["Molhar o chão", "Cavar um buraco fundo", "Cortar todas as árvores"],
      "facil",
    ],
    [
      "Ao desmontar o acampamento, a regra é:",
      "Deixar o local como estava, sem vestígios",
      ["Deixar restos para outros usarem", "Enterrar o plástico", "Deixar a fogueira acesa"],
      "media",
    ],
    [
      "Um item essencial de higiene pessoal no acampamento é:",
      "Sabonete e escova de dentes",
      ["Videogame", "Ventilador", "Espelho grande"],
      "facil",
    ],
    [
      "Para conservar alimentos no acampamento, é indicado:",
      "Mantê-los em recipientes fechados e à sombra",
      ["Deixá-los ao sol", "Espalhá-los pelo chão", "Guardá-los perto do fogo"],
      "media",
    ],
    [
      "A barraca deve ser montada de preferência com a entrada:",
      "Protegida do vento e da chuva",
      ["Voltada para o lixo", "Contra o vento forte", "Debaixo de galho seco"],
      "media",
    ],
    [
      "Por que não montar a barraca embaixo de árvores com galhos secos?",
      "Galhos podem cair e causar acidentes",
      ["Falta de sombra", "Atrai borboletas", "O chão é sempre firme"],
      "media",
    ],
    [
      "Um 'estai' (corda esticada da barraca) deve estar:",
      "Bem esticado e ancorado no espeque",
      ["Frouxo no chão", "Enrolado na barraca", "Cortado ao meio"],
      "dificil",
    ],
    [
      "No acampamento, a água para beber deve ser:",
      "Potável ou devidamente tratada",
      ["Retirada direto de qualquer poça", "Da chuva sem tratar", "Do lago com barro"],
      "media",
    ],
    [
      "Manter a mochila e o material organizados na barraca ajuda a:",
      "Encontrar as coisas rápido e manter tudo seco",
      ["Deixar mais bagunçado", "Aumentar o peso", "Atrair insetos"],
      "facil",
    ],
    [
      "Um bom acampamento escoteiro preza principalmente por:",
      "Segurança, organização e respeito à natureza",
      ["Barulho e desordem", "Muitas fogueiras", "Deixar lixo"],
      "facil",
    ],
    [
      "Ao acampar em local com risco de chuva, é prudente:",
      "Cavar pequenas valetas ao redor apenas se permitido, e escolher terreno alto",
      ["Montar no ponto mais baixo", "Deixar o material fora", "Ignorar a previsão"],
      "dificil",
    ],
  ];
  for (const [q, c, d, diff] of items) QUESTIONS.push(mc(T, q, c, d, diff));
})();

// =========================================================
// 03 — FOGO E COZINHA
// =========================================================
(() => {
  const T = "fogo";
  const items: [string, string, string[], Difficulty][] = [
    [
      "Você vai preparar uma refeição em atividade. O melhor local para o fogo é:",
      "Área limpa, longe de folhas secas e barracas",
      ["Embaixo de uma árvore com folhas secas", "Dentro da barraca", "Sobre grama alta"],
      "facil",
    ],
    [
      "Antes de acender o fogo é fundamental ter por perto:",
      "Água ou areia para apagar se necessário",
      ["Mais gasolina", "Folhas secas amontoadas", "Nada, é seguro"],
      "media",
    ],
    [
      "O material fino e seco que ajuda a iniciar o fogo é chamado de:",
      "Isca / material combustível fino",
      ["Toras grossas", "Pedras", "Areia úmida"],
      "media",
    ],
    [
      "Para acender o fogo, a ordem correta dos materiais é:",
      "Isca fina, depois gravetos, depois lenha grossa",
      ["Lenha grossa primeiro", "Só toras grandes", "Só folhas verdes"],
      "media",
    ],
    [
      "Ao terminar de usar o fogo, você deve:",
      "Apagá-lo completamente até esfriar as cinzas",
      ["Deixar apagar sozinho", "Cobrir com folhas secas", "Deixar aceso ao sair"],
      "facil",
    ],
    [
      "Lenha verde (recém-cortada) é ruim para o fogo porque:",
      "Está úmida e produz muita fumaça",
      ["Queima rápido demais", "Não existe", "É boa, na verdade"],
      "media",
    ],
    [
      "Um fogareiro a gás deve ser usado:",
      "Em local ventilado e sobre superfície firme",
      ["Dentro da barraca fechada", "Perto de inflamáveis", "Segurando com a mão acesa"],
      "media",
    ],
    [
      "Cozinha mateira é:",
      "Cozinhar usando técnicas de campo, com fogo e materiais naturais",
      ["Cozinhar em micro-ondas", "Comer só enlatados", "Cozinhar em casa"],
      "media",
    ],
    [
      "Para prevenir incêndios florestais no acampamento:",
      "Nunca deixar o fogo sem vigilância",
      ["Fazer fogueiras enormes", "Acender em dia de vento forte", "Usar muito combustível"],
      "facil",
    ],
    [
      "O que fazer com as sobras de comida no acampamento?",
      "Acondicionar e levar embora, sem atrair animais",
      ["Jogar no mato", "Deixar perto da barraca", "Enterrar plástico junto"],
      "media",
    ],
    [
      "Um extintor natural sempre disponível para pequenas chamas é:",
      "Água ou terra/areia",
      ["Álcool", "Óleo", "Papel"],
      "facil",
    ],
    [
      "Ao cozinhar, para evitar queimaduras, deve-se:",
      "Usar luva/pano e panelas com cabo firme",
      ["Segurar a panela quente com a mão", "Deixar crianças mexendo no fogo", "Aproximar o rosto da chama"],
      "media",
    ],
    [
      "O tipo de fogo em formato de pirâmide/cone é bom para:",
      "Acender rápido e dar bastante chama",
      ["Cozinhar por horas sem chama", "Somente sinalização", "Aquecer água fria eternamente"],
      "dificil",
    ],
    [
      "Responsabilidade ambiental com o fogo significa:",
      "Reduzir impacto e não deixar marcas no solo",
      ["Queimar tudo que encontrar", "Cortar árvores vivas", "Fazer muitas fogueiras"],
      "facil",
    ],
    [
      "Nunca se deve usar para acender fogo:",
      "Líquidos inflamáveis jogados sobre chamas",
      ["Fósforos", "Isqueiro", "Gravetos secos"],
      "media",
    ],
    [
      "Guardar alimentos longe do chão e fechados evita:",
      "Contaminação e visita de animais/insetos",
      ["Que fiquem gelados", "Que sequem", "Nada"],
      "media",
    ],
  ];
  for (const [q, c, d, diff] of items) QUESTIONS.push(mc(T, q, c, d, diff));
})();

// =========================================================
// 04 — CÓDIGOS E COMUNICAÇÃO
// =========================================================
(() => {
  const T = "codigos";
  const morse: Record<string, string> = {
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",
  };
  const letters = Object.keys(morse);
  // Letra em Morse
  for (const L of letters) {
    QUESTIONS.push(
      mc(
        T,
        `Em Código Morse, o que significa "${morse[L]}"?`,
        L,
        letters,
        L.length ? "media" : "media",
        "Cada letra tem uma combinação única de pontos e traços.",
      ),
    );
  }
  // Palavras conhecidas em Morse
  const words: [string, string][] = [
    ["... --- ...", "SOS"],
    [".- -- --- .-.", "AMOR"],
    ["... .. --", "SIM"],
    ["-. .- ---", "NAO"],
    [".--. .- --..", "PAZ"],
  ];
  const wordDistract = ["SOS", "AMOR", "SIM", "NAO", "PAZ", "LUZ", "SOL", "MAR"];
  for (const [code, w] of words) {
    QUESTIONS.push(
      mc(
        T,
        `Mensagem em Morse recebida: "${code}". O que ela significa?`,
        w,
        wordDistract,
        "dificil",
      ),
    );
  }
  // Cifra de César (deslocamento +3)
  const caesar = (s: string, shift: number) =>
    s
      .toUpperCase()
      .split("")
      .map((ch) => {
        const c = ch.charCodeAt(0);
        if (c >= 65 && c <= 90) return String.fromCharCode(((c - 65 + shift + 26) % 26) + 65);
        return ch;
      })
      .join("");
  const caesarWords = ["ESCOTA", "TRILHA", "MAPA", "FOGO", "NORTE", "BUSSOLA", "PATRULHA"];
  for (const w of caesarWords) {
    const enc = caesar(w, 3);
    QUESTIONS.push(
      mc(
        T,
        `Na Cifra de César com deslocamento +3, a palavra cifrada "${enc}" corresponde a:`,
        w,
        caesarWords,
        "dificil",
        "Na Cifra de César cada letra é substituída por outra deslocada um número fixo de posições.",
      ),
    );
  }
  // Conceitos de comunicação
  const conc: [string, string, string[], Difficulty][] = [
    [
      "O Código Morse é formado por:",
      "Pontos e traços",
      ["Números apenas", "Cores", "Figuras"],
      "facil",
    ],
    [
      "A sinalização por bandeiras à distância chama-se:",
      "Semáfora",
      ["Morse", "Braille", "Libras"],
      "media",
    ],
    [
      "Na comunicação por rádio, dizer 'câmbio' significa:",
      "Terminei de falar, pode responder",
      ["Estou com problema", "Repita tudo", "Desligue o rádio"],
      "media",
    ],
    [
      "Em Morse, o sinal internacional de socorro (SOS) é:",
      "... --- ...",
      ["--- ... ---", ".-.-.-", "... ... ..."],
      "facil",
    ],
    [
      "Códigos de pista servem para:",
      "Deixar mensagens e indicações no caminho",
      ["Cozinhar", "Medir a temperatura", "Amarrar barracas"],
      "media",
    ],
    [
      "Uma 'mensagem secreta' cifrada tem como objetivo:",
      "Esconder a informação de quem não conhece a chave",
      ["Ser lida por todos", "Ser apagada", "Confundir a própria patrulha"],
      "facil",
    ],
    [
      "Na comunicação por rádio, 'positivo' quer dizer:",
      "Sim / afirmativo",
      ["Não", "Talvez", "Aguarde"],
      "facil",
    ],
    [
      "Um alfabeto que substitui letras por números é um exemplo de:",
      "Código numérico",
      ["Semáfora", "Braille", "Bússola"],
      "media",
    ],
  ];
  for (const [q, c, d, diff] of conc) QUESTIONS.push(mc(T, q, c, d, diff));
})();

// =========================================================
// 05 — NATUREZA E MEIO AMBIENTE
// =========================================================
(() => {
  const T = "natureza";
  const pegadas: [string, string, string[]][] = [
    ["Que animal tem patas com garras e deixa pegada de felino grande?", "Onça-pintada", ["Capivara", "Tamanduá", "Arara"]],
    ["Pegadas com casco em duas partes costumam ser de:", "Veado ou porco-do-mato", ["Onça", "Cobra", "Coruja"]],
    ["A capivara, maior roedor do mundo, vive perto de:", "Rios e lagoas", ["Desertos", "Neve", "Cavernas secas"]],
  ];
  for (const [q, c, d] of pegadas) QUESTIONS.push(mc(T, q, c, d, "media"));

  const conc: [string, string, string[], Difficulty][] = [
    [
      "'Não deixe rastro' (Leave No Trace / Mínimo Impacto) significa:",
      "Reduzir ao máximo os impactos no ambiente",
      ["Deixar marcas para outros seguirem", "Cortar árvores", "Fazer trilhas novas por todo lado"],
      "facil",
    ],
    [
      "Reciclar contribui para:",
      "Reduzir lixo e reaproveitar materiais",
      ["Aumentar a poluição", "Gastar mais água", "Desmatar florestas"],
      "facil",
    ],
    [
      "A biodiversidade é:",
      "A variedade de seres vivos em um ambiente",
      ["A quantidade de água de um rio", "O tamanho da floresta", "O número de trilhas"],
      "media",
    ],
    [
      "Ao encontrar um animal silvestre na trilha, o correto é:",
      "Observar à distância, sem alimentar nem tocar",
      ["Dar comida", "Pegar no colo", "Persegui-lo"],
      "media",
    ],
    [
      "Economizar água no acampamento é uma prática de:",
      "Sustentabilidade",
      ["Desperdício", "Poluição", "Imprudência"],
      "facil",
    ],
    [
      "As matas ciliares são importantes porque:",
      "Protegem as margens e a água dos rios",
      ["Poluem os rios", "Secam as nascentes", "Atraem lixo"],
      "dificil",
    ],
    [
      "Fauna se refere a:",
      "O conjunto dos animais de uma região",
      ["O conjunto das plantas", "O tipo de solo", "As pedras do local"],
      "facil",
    ],
    [
      "Flora se refere a:",
      "O conjunto das plantas de uma região",
      ["O conjunto dos animais", "O clima", "Os rios"],
      "facil",
    ],
    [
      "Uma atitude sustentável com a mochila é:",
      "Levar garrafa reutilizável em vez de descartáveis",
      ["Levar muitos copos plásticos", "Jogar embalagens no mato", "Comprar tudo descartável"],
      "media",
    ],
    [
      "Queimadas descontroladas causam principalmente:",
      "Destruição de habitats e poluição do ar",
      ["Mais biodiversidade", "Rios mais limpos", "Solo mais fértil sempre"],
      "media",
    ],
    [
      "O que fazer com o lixo produzido em uma trilha?",
      "Trazê-lo de volta para descartar corretamente",
      ["Enterrar plástico", "Deixar na trilha", "Jogar no rio"],
      "facil",
    ],
    [
      "As abelhas são importantes principalmente porque:",
      "Polinizam as plantas",
      ["Sujam o ambiente", "Destroem flores", "Não têm função"],
      "media",
    ],
    [
      "Preservar nascentes é importante porque:",
      "Delas nasce a água dos rios",
      ["Elas atraem lixo", "Não têm utilidade", "São perigosas"],
      "media",
    ],
    [
      "A regra dos 3 R's da sustentabilidade é:",
      "Reduzir, Reutilizar e Reciclar",
      ["Rasgar, Rir e Repetir", "Regar, Rodar e Rumar", "Reclamar, Reunir e Rir"],
      "facil",
    ],
    [
      "Espécies ameaçadas de extinção devem ser:",
      "Protegidas e preservadas",
      ["Capturadas", "Ignoradas", "Vendidas"],
      "facil",
    ],
  ];
  for (const [q, c, d, diff] of conc) QUESTIONS.push(mc(T, q, c, d, diff));
})();

// =========================================================
// 06 — PRIMEIROS SOCORROS
// =========================================================
(() => {
  const T = "socorros";
  const items: [string, string, string[], Difficulty][] = [
    [
      "Um escoteiro caiu na trilha, está consciente e sente muita dor na perna. A primeira atitude é:",
      "Manter a calma, não movê-lo bruscamente e avaliar a situação",
      ["Puxar a perna para 'ajeitar'", "Fazê-lo correr", "Ignorar e seguir"],
      "media",
    ],
    [
      "O número de emergência para o SAMU (ambulância) no Brasil é:",
      "192",
      ["190", "199", "911"],
      "facil",
    ],
    [
      "O número de emergência do Corpo de Bombeiros no Brasil é:",
      "193",
      ["192", "190", "197"],
      "facil",
    ],
    [
      "Diante de um acidente, a PRIMEIRA coisa a fazer é:",
      "Garantir a segurança do local (sua e da vítima)",
      ["Correr até a vítima sem olhar", "Gritar sem parar", "Tirar fotos"],
      "media",
    ],
    [
      "Em um pequeno corte que sangra, deve-se:",
      "Lavar, comprimir com pano limpo e cobrir",
      ["Passar terra", "Deixar sangrar bastante", "Esfregar folhas"],
      "media",
    ],
    [
      "Em uma queimadura leve, o correto é:",
      "Resfriar com água corrente por alguns minutos",
      ["Passar pasta de dente", "Estourar as bolhas", "Passar manteiga"],
      "media",
    ],
    [
      "Sinais de desidratação incluem:",
      "Sede intensa, boca seca e tontura",
      ["Muita fome", "Pele muito molhada", "Vontade de correr"],
      "media",
    ],
    [
      "Para evitar insolação em dia quente, deve-se:",
      "Beber água, usar boné e buscar sombra",
      ["Ficar ao sol o dia todo", "Não beber água", "Usar roupa preta e pesada"],
      "facil",
    ],
    [
      "Uma torção no tornozelo deve ser tratada inicialmente com:",
      "Repouso, gelo, compressão e elevação",
      ["Continuar correndo", "Aquecer bastante", "Massagear com força"],
      "dificil",
    ],
    [
      "Hipotermia é quando o corpo:",
      "Perde calor e fica com temperatura muito baixa",
      ["Fica muito quente", "Fica com fome", "Fica com sede"],
      "media",
    ],
    [
      "Ao ligar para a emergência, é importante informar:",
      "O local exato e o que aconteceu",
      ["Seu prato favorito", "A cor da barraca", "Nada, só desligar"],
      "media",
    ],
    [
      "Um kit de primeiros socorros básico deve conter:",
      "Curativos, gaze, antisséptico e luvas",
      ["Doces", "Brinquedos", "Ferramentas pesadas"],
      "facil",
    ],
    [
      "Se alguém desmaia mas está respirando, deve-se:",
      "Deitá-lo de lado e chamar ajuda",
      ["Jogar água gelada e sacudir", "Dar comida", "Levantá-lo bruscamente"],
      "dificil",
    ],
    [
      "Prevenir acidentes na trilha inclui:",
      "Usar calçado adequado e observar o caminho",
      ["Correr sem olhar", "Andar de sandália em pedras", "Ir sozinho sem avisar"],
      "facil",
    ],
    [
      "Diante de uma picada de inseto com dor leve, deve-se:",
      "Lavar o local e aplicar compressa fria",
      ["Coçar bastante", "Furar com agulha suja", "Apertar com força"],
      "media",
    ],
    [
      "Em caso de sangramento intenso, a medida imediata é:",
      "Pressionar firmemente o ferimento com pano limpo",
      ["Deixar exposto", "Lavar com refrigerante", "Cobrir com terra"],
      "media",
    ],
  ];
  for (const [q, c, d, diff] of items) QUESTIONS.push(mc(T, q, c, d, diff));
})();

// =========================================================
// 07 — NÓS E PIONEIRIA
// =========================================================
(() => {
  const T = "nos";
  const items: [string, string, string[], Difficulty][] = [
    [
      "Você precisa formar uma alça fixa que NÃO aperta o objeto. Qual nó usar?",
      "Lais de guia",
      ["Nó direito", "Volta do fiel", "Nó de correr"],
      "media",
    ],
    [
      "Para unir duas cordas de MESMA espessura, o nó indicado é o:",
      "Nó direito",
      ["Nó de escota", "Lais de guia", "Volta do fiel"],
      "media",
    ],
    [
      "Para unir duas cordas de espessuras DIFERENTES usa-se o:",
      "Nó de escota",
      ["Nó direito", "Volta do fiel", "Pescador"],
      "dificil",
    ],
    [
      "O nó que forma uma laçada que corre e aperta é o:",
      "Nó de correr",
      ["Lais de guia", "Nó direito", "Volta da ribeira"],
      "media",
    ],
    [
      "Para prender rapidamente uma corda a um poste ou mastro usa-se a:",
      "Volta do fiel",
      ["Lais de guia", "Nó direito", "Nó de escota"],
      "media",
    ],
    [
      "O nó usado para começar e terminar amarras firmes é a:",
      "Volta do fiel",
      ["Nó de correr", "Nó direito", "Pescador"],
      "dificil",
    ],
    [
      "Para unir duas linhas finas (como de pesca) firmemente usa-se o:",
      "Nó de pescador",
      ["Nó de correr", "Lais de guia", "Volta do fiel"],
      "dificil",
    ],
    [
      "Amarras servem para:",
      "Unir varas e construir estruturas (pioneiria)",
      ["Cozinhar", "Sinalizar trilhas", "Filtrar água"],
      "facil",
    ],
    [
      "Pioneiria é a técnica de:",
      "Construir estruturas com varas e cordas",
      ["Acender fogo", "Ler mapas", "Cozinhar em campo"],
      "media",
    ],
    [
      "A amarra que une duas varas em cruz (perpendiculares) é a:",
      "Amarra quadrada",
      ["Amarra diagonal", "Amarra paralela", "Volta do fiel"],
      "dificil",
    ],
    [
      "Antes de usar uma corda em pioneiria devemos verificar se ela está:",
      "Em bom estado, sem partes gastas",
      ["Molhada e podre", "Cortada ao meio", "Cheia de nós desnecessários"],
      "media",
    ],
    [
      "O lais de guia é muito usado em resgate porque:",
      "Faz uma alça segura que não aperta a pessoa",
      ["Aperta bem forte", "Desfaz-se sozinho", "Não segura peso"],
      "dificil",
    ],
    [
      "Para não perder as pontas da corda (evitar desfiar) fazemos:",
      "Um arremate/falcaça na ponta",
      ["Um nó de correr", "Um lais de guia", "Nada"],
      "media",
    ],
    [
      "Um bom nó escoteiro deve ser:",
      "Fácil de fazer, seguro e fácil de desfazer",
      ["Impossível de desfazer", "Frouxo sempre", "Feito de qualquer jeito"],
      "facil",
    ],
    [
      "A 'volta da ribeira' é usada principalmente para:",
      "Amarrar uma corda a uma argola ou objeto",
      ["Unir duas cordas iguais", "Fazer uma alça fixa", "Cozinhar"],
      "dificil",
    ],
  ];
  for (const [q, c, d, diff] of items) QUESTIONS.push(mc(T, q, c, d, diff));
})();

// =========================================================
// 08 — HISTÓRIA E CULTURA ESCOTEIRA
// =========================================================
(() => {
  const T = "historia";
  const items: [string, string, string[], Difficulty][] = [
    [
      "Quem é o fundador do Movimento Escoteiro?",
      "Robert Baden-Powell",
      ["Robert Kennedy", "Alexander Graham Bell", "Baden Powell Junior"],
      "facil",
    ],
    [
      "Em que ilha aconteceu o primeiro acampamento escoteiro, em 1907?",
      "Ilha de Brownsea",
      ["Ilha de Páscoa", "Ilha de Marajó", "Ilha da Madeira"],
      "media",
    ],
    [
      "O livro escrito por Baden-Powell que difundiu o escotismo chama-se:",
      "Escotismo para Rapazes (Scouting for Boys)",
      ["O Livro da Selva", "A Ilha do Tesouro", "Robinson Crusoé"],
      "media",
    ],
    [
      "Baden-Powell é carinhosamente chamado de:",
      "B-P",
      ["B-B", "P-P", "R-P"],
      "facil",
    ],
    [
      "Em que ano ocorreu o primeiro acampamento escoteiro em Brownsea?",
      "1907",
      ["1957", "1917", "2000"],
      "media",
    ],
    [
      "O símbolo mundial do escotismo é:",
      "A flor-de-lis",
      ["Uma estrela azul", "Um leão dourado", "Uma cruz vermelha"],
      "facil",
    ],
    [
      "O escotismo tem como uma de suas bases:",
      "O aprender fazendo e a vida ao ar livre",
      ["Ficar só em salas", "Competir sempre", "Evitar a natureza"],
      "media",
    ],
    [
      "O escotismo é um movimento:",
      "Educativo, voluntário e para jovens",
      ["Militar obrigatório", "Apenas esportivo", "Somente escolar"],
      "media",
    ],
    [
      "A saudação escoteira é feita com:",
      "Três dedos levantados",
      ["A mão fechada", "Cinco dedos", "Dois dedos"],
      "facil",
    ],
    [
      "Os três dedos da saudação escoteira representam:",
      "Os três pontos da Promessa Escoteira",
      ["Três patrulhas", "Três acampamentos", "Três nós"],
      "media",
    ],
    [
      "A União dos Escoteiros do Brasil é conhecida pela sigla:",
      "UEB",
      ["ONU", "OMS", "UEP"],
      "media",
    ],
    [
      "O lema dos escoteiros (ramo escoteiro) é:",
      "Sempre Alerta",
      ["Sempre Forte", "Sempre Rápido", "Sempre Vencer"],
      "facil",
    ],
    [
      "O grupo menor de escoteiros que trabalham juntos chama-se:",
      "Patrulha",
      ["Tropa", "Turma", "Time"],
      "facil",
    ],
    [
      "Baden-Powell tinha experiência militar como:",
      "Oficial do exército britânico",
      ["Pescador", "Astronauta", "Cozinheiro"],
      "media",
    ],
    [
      "O escotismo se espalhou pelo mundo por ser:",
      "Aberto a jovens de diferentes culturas e países",
      ["Só para um país", "Secreto", "Muito caro"],
      "media",
    ],
    [
      "A Organização Mundial do Movimento Escoteiro é conhecida como:",
      "OMME (WOSM)",
      ["FIFA", "OTAN", "NASA"],
      "dificil",
    ],
  ];
  for (const [q, c, d, diff] of items) QUESTIONS.push(mc(T, q, c, d, diff));
})();

// =========================================================
// 09 — LEI, PROMESSA E VALORES
// =========================================================
(() => {
  const T = "valores";
  const items: [string, string, string[], Difficulty][] = [
    [
      "Você encontra um objeto perdido e ninguém viu. A atitude escoteira é:",
      "Procurar o dono ou entregar aos responsáveis",
      ["Ficar com ele", "Esconder", "Jogar fora"],
      "facil",
    ],
    [
      "Um pilar da Lei Escoteira é que o escoteiro é:",
      "Digno de confiança",
      ["Preguiçoso", "Egoísta", "Mentiroso"],
      "facil",
    ],
    [
      "Ajudar o próximo, mesmo sem receber nada em troca, é um ato de:",
      "Serviço",
      ["Vaidade", "Interesse", "Descaso"],
      "facil",
    ],
    [
      "Ser leal significa:",
      "Ser fiel e verdadeiro com todos",
      ["Trair amigos", "Mentir quando convém", "Só pensar em si"],
      "facil",
    ],
    [
      "Um colega de outra patrulha precisa de ajuda. Você deve:",
      "Ajudá-lo, pois todos são irmãos escoteiros",
      ["Ignorar por ser de outra patrulha", "Rir dele", "Atrapalhar"],
      "media",
    ],
    [
      "O escoteiro protege a natureza porque:",
      "Respeita e cuida do meio ambiente",
      ["Não se importa", "Só quer pontos", "Quer poluir"],
      "facil",
    ],
    [
      "Você prometeu ajudar em uma tarefa mas apareceu algo divertido. O certo é:",
      "Cumprir o combinado, pois honrou sua palavra",
      ["Faltar sem avisar", "Fingir que esqueceu", "Deixar para os outros"],
      "media",
    ],
    [
      "Disciplina no escotismo significa principalmente:",
      "Respeitar regras e cumprir responsabilidades",
      ["Fazer bagunça", "Desobedecer", "Faltar sempre"],
      "media",
    ],
    [
      "Um escoteiro vê um colega sendo excluído. A atitude correta é:",
      "Acolher e incluir o colega",
      ["Rir junto", "Fingir que não viu", "Excluir também"],
      "media",
    ],
    [
      "Cidadania para o escoteiro é:",
      "Contribuir para uma sociedade melhor",
      ["Só cuidar de si", "Ignorar a comunidade", "Desrespeitar leis"],
      "media",
    ],
    [
      "A Promessa Escoteira é um compromisso feito:",
      "Livremente, sobre a própria honra",
      ["Por obrigação militar", "Sem sentido", "Só para ganhar medalha"],
      "media",
    ],
    [
      "Fraternidade escoteira significa:",
      "Tratar os outros como irmãos",
      ["Competir sempre", "Brigar", "Ficar isolado"],
      "facil",
    ],
    [
      "Se você comete um erro em atividade, o certo é:",
      "Assumir a responsabilidade e tentar corrigir",
      ["Culpar outro", "Esconder", "Mentir"],
      "media",
    ],
    [
      "Respeito, no espírito escoteiro, inclui:",
      "Valorizar as diferenças das pessoas",
      ["Zombar de quem é diferente", "Excluir", "Impor sua vontade"],
      "facil",
    ],
    [
      "A boa ação diária é uma tradição que estimula:",
      "Fazer o bem todos os dias",
      ["Fazer o bem só de vez em quando", "Nunca ajudar", "Ajudar só por recompensa"],
      "facil",
    ],
    [
      "Otimismo escoteiro significa enfrentar dificuldades:",
      "Com bom ânimo e vontade de superar",
      ["Reclamando sempre", "Desistindo logo", "Culpando os outros"],
      "media",
    ],
  ];
  for (const [q, c, d, diff] of items) QUESTIONS.push(mc(T, q, c, d, diff));
})();

// =========================================================
// 10 — TÉCNICAS DE CAMPO
// =========================================================
(() => {
  const T = "campo";
  const sinais: [string, string, string[]][] = [
    ["Numa trilha, uma seta apontando para frente significa:", "Siga nesta direção", ["Caminho errado", "Perigo", "Retorne"]],
    ["Um 'X' grande num sinal de pista significa:", "Caminho errado / não siga", ["Siga em frente", "Água potável", "Acampamento"]],
    ["Um sinal de alerta na trilha (triângulo) indica:", "Atenção / perigo à frente", ["Fim da trilha", "Comida", "Descanso"]],
    ["Uma seta curva/voltada para trás significa:", "Retorne / caminho de volta", ["Siga em frente", "Vire à esquerda para sempre", "Acampe aqui"]],
  ];
  for (const [q, c, d] of sinais) QUESTIONS.push(mc(T, q, c, d, "media"));

  const items: [string, string, string[], Difficulty][] = [
    [
      "Rastreamento é a técnica de:",
      "Observar e interpretar pistas deixadas por seres vivos",
      ["Cozinhar em campo", "Acender fogo", "Ler o relógio"],
      "media",
    ],
    [
      "Ao construir um abrigo de emergência, o mais importante é:",
      "Proteger-se do frio, chuva e vento",
      ["Que seja bonito", "Que seja enorme", "Que tenha decoração"],
      "media",
    ],
    [
      "Para obter água segura em campo é recomendável:",
      "Ferver ou tratar a água antes de beber",
      ["Beber de qualquer poça", "Beber água com barro", "Não beber nada"],
      "media",
    ],
    [
      "A observação atenta na trilha ajuda a:",
      "Notar sinais, mudanças e possíveis riscos",
      ["Andar mais rápido sem olhar", "Perder o caminho", "Ignorar tudo"],
      "facil",
    ],
    [
      "Deixar sinais de pista para a patrulha serve para:",
      "Orientar quem vem atrás",
      ["Confundir", "Sujar a trilha", "Marcar território de forma agressiva"],
      "media",
    ],
    [
      "Em uma situação de sobrevivência, a ordem de prioridade costuma ser:",
      "Abrigo, água, fogo e sinalização",
      ["Comida gourmet primeiro", "Dormir o dia todo", "Nadar"],
      "dificil",
    ],
    [
      "Ao se perder na mata, a recomendação geral é:",
      "Parar, manter a calma e sinalizar sua posição",
      ["Correr sem rumo", "Gritar até cansar e continuar andando", "Entrar mais na mata"],
      "media",
    ],
    [
      "Técnicas mateiras são conhecimentos ligados a:",
      "Viver e se virar no ambiente natural",
      ["Jogar videogame", "Cozinhar em restaurante", "Andar de metrô"],
      "media",
    ],
    [
      "Para não se desidratar em uma longa caminhada, deve-se:",
      "Beber água regularmente",
      ["Beber só no fim do dia", "Não levar água", "Beber refrigerante gelado apenas"],
      "facil",
    ],
    [
      "Um bom rastreador presta atenção principalmente em:",
      "Pegadas, galhos quebrados e restos deixados",
      ["Apenas no céu", "No som do celular", "Em nada"],
      "media",
    ],
    [
      "Marcar o próprio caminho com sinais permite:",
      "Voltar pelo mesmo trajeto com segurança",
      ["Perder-se de vez", "Andar em círculos", "Nada"],
      "media",
    ],
    [
      "Ao montar um abrigo, escolher o local considera:",
      "Terreno seco, protegido e seguro",
      ["Debaixo de pedra solta", "Em barranco instável", "No leito de um rio"],
      "dificil",
    ],
  ];
  for (const [q, c, d, diff] of items) QUESTIONS.push(mc(T, q, c, d, diff));
})();

import { EXTRA_QUESTIONS } from "./questionBankExtra";
import { EXTRA2_QUESTIONS } from "./questionBankExtra2";
import { EXTRA3_QUESTIONS } from "./questionBankExtra3";
import { EXTRA4_QUESTIONS } from "./questionBankExtra4";

export const RAW_QUESTIONS: RawQuestion[] = [
  ...QUESTIONS,
  ...EXTRA_QUESTIONS,
  ...EXTRA2_QUESTIONS,
  ...EXTRA3_QUESTIONS,
  ...EXTRA4_QUESTIONS,
];

// -------------------------------------------------------------------
// Servir perguntas: embaralha as opções garantindo a alternância da
// alternativa correta entre as posições (A/B/C/D).
// -------------------------------------------------------------------
export function shuffleQuestion(raw: RawQuestion, seedIndex: number): ServedQuestion {
  const correctText = raw.options[raw.answer];
  const opts = [...raw.options];
  // Fisher-Yates
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  // Força alternância pela posição de destino, distribuindo entre 0..3
  const forced = seedIndex % opts.length;
  const curr = opts.indexOf(correctText);
  if (curr !== forced) {
    [opts[curr], opts[forced]] = [opts[forced], opts[curr]];
  }
  return {
    id: `${raw.territory}-${seedIndex}`,
    territory: raw.territory,
    q: raw.q,
    options: opts,
    answer: opts.indexOf(correctText),
    difficulty: raw.difficulty,
    explain: raw.explain,
    points: DIFFICULTY_POINTS[raw.difficulty],
  };
}

export function questionsByTerritory(territory: string): RawQuestion[] {
  return RAW_QUESTIONS.filter((q) => q.territory === territory);
}

export function getServedQuestions(territory: string, count: number): ServedQuestion[] {
  const pool = [...questionsByTerritory(territory)];
  // embaralha o pool
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const chosen = pool.slice(0, Math.min(count, pool.length));
  return chosen.map((raw, idx) => shuffleQuestion(raw, idx));
}

export function totalQuestions(): number {
  return RAW_QUESTIONS.length;
}
