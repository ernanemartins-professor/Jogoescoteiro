// Expansão programática do banco de perguntas para ampliar a variedade
// e alcançar ~1000 perguntas mantendo qualidade e coerência.
import type { RawQuestion, Difficulty } from "./questionBank";

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

const EXTRA: RawQuestion[] = [];

// ---------------- ORIENTAÇÃO ----------------
(() => {
  const T = "orientacao";
  const all = ["Norte", "Sul", "Leste", "Oeste", "Nordeste", "Noroeste", "Sudeste", "Sudoeste"];
  const dir8 = ["Norte", "Nordeste", "Leste", "Sudeste", "Sul", "Sudoeste", "Oeste", "Noroeste"];
  // rotações de 45° (todas as combinações)
  for (const from of dir8) {
    const start = dir8.indexOf(from);
    // 45 direita
    EXTRA.push(
      mc(T, `Voltado para o ${from}, gire 45° à direita. Para onde olha?`, dir8[(start + 1) % 8], all, "media"),
    );
    // 45 esquerda
    EXTRA.push(
      mc(T, `Voltado para o ${from}, gire 45° à esquerda. Para onde olha?`, dir8[(start + 7) % 8], all, "media"),
    );
    // 135 direita
    EXTRA.push(
      mc(T, `Voltado para o ${from}, gire 135° à direita. Para onde olha?`, dir8[(start + 3) % 8], all, "dificil"),
    );
  }
  // azimutes intermediários
  const az: [number, string][] = [];
  for (let a = 0; a < 360; a += 45) {
    az.push([a, dir8[(a / 45) % 8]]);
  }
  for (const [a, d] of az) {
    EXTRA.push(mc(T, `Qual direção corresponde ao azimute de ${a}°?`, d, all, "media"));
    // inverso: direção -> azimute
    EXTRA.push(
      mc(
        T,
        `Qual é o azimute aproximado da direção ${d}?`,
        `${a}°`,
        ["0°", "45°", "90°", "135°", "180°", "225°", "270°", "315°"].filter((x) => x !== `${a}°`),
        "media",
      ),
    );
  }
  // conceitos extras
  const conc: [string, string, string[], Difficulty][] = [
    ["A rosa dos ventos representa:", "As direções (pontos cardeais e colaterais)", ["A escala do mapa", "O relevo", "As trilhas"], "facil"],
    ["Meridianos são linhas que ligam:", "Polo Norte ao Polo Sul", ["Leste a Oeste", "Duas cidades", "Rios"], "dificil"],
    ["Paralelos são linhas:", "Horizontais, paralelas ao Equador", ["Verticais", "Diagonais", "Curvas de nível"], "dificil"],
    ["A legenda de um mapa serve para:", "Explicar os símbolos usados", ["Indicar o preço", "Mostrar a data", "Nada"], "facil"],
    ["Curvas de nível muito próximas indicam terreno:", "Íngreme (grande inclinação)", ["Plano", "Alagado", "Arenoso"], "dificil"],
    ["Para medir distância no mapa usamos:", "A escala", ["O azimute", "A bússola", "A legenda"], "media"],
    ["O ponto de partida de uma trilha costuma ser marcado como:", "Início/entrada da trilha", ["Fim", "Perigo", "Água"], "facil"],
    ["Se você caminha para o Norte, o Sul fica:", "Atrás de você", ["À sua frente", "À direita", "À esquerda"], "facil"],
    ["Caminhando para Leste, o Oeste fica:", "Atrás de você", ["À frente", "À direita", "À esquerda"], "facil"],
    ["A bússola deve ser mantida longe de:", "Objetos metálicos e ímãs", ["Água", "Papel", "Madeira"], "media"],
    ["Um mapa topográfico mostra principalmente:", "O relevo e as características do terreno", ["Somente ruas", "Só o clima", "Só rios"], "dificil"],
    ["Ao seguir um azimute, você caminha:", "Na direção do ângulo medido", ["Em círculos", "Sempre para o Norte", "Ao acaso"], "media"],
  ];
  for (const [q, c, d, diff] of conc) EXTRA.push(mc(T, q, c, d, diff));
})();

// ---------------- CÓDIGOS: Morse completo + fonético + números ----------------
(() => {
  const T = "codigos";
  const morse: Record<string, string> = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
    H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.",
    O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-",
    V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
  };
  const letters = Object.keys(morse);
  // inverso: letra -> código morse
  for (const L of letters) {
    EXTRA.push(
      mc(T, `Como se escreve a letra "${L}" em Código Morse?`, morse[L], Object.values(morse), "media"),
    );
  }
  // números em morse
  const numMorse: Record<string, string> = {
    "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....",
    "6": "-....", "7": "--...", "8": "---..", "9": "----.", "0": "-----",
  };
  const nums = Object.keys(numMorse);
  for (const n of nums) {
    EXTRA.push(mc(T, `Em Morse, "${numMorse[n]}" representa qual número?`, n, nums, "media"));
  }
  // alfabeto fonético internacional
  const fon: [string, string][] = [
    ["A", "Alfa"], ["B", "Bravo"], ["C", "Charlie"], ["D", "Delta"],
    ["E", "Echo"], ["F", "Foxtrot"], ["G", "Golf"], ["H", "Hotel"],
    ["I", "India"], ["J", "Juliett"], ["K", "Kilo"], ["L", "Lima"],
    ["M", "Mike"], ["N", "November"], ["O", "Oscar"], ["P", "Papa"],
    ["Q", "Quebec"], ["R", "Romeo"], ["S", "Sierra"], ["T", "Tango"],
    ["U", "Uniform"], ["V", "Victor"], ["W", "Whiskey"], ["X", "X-ray"],
    ["Y", "Yankee"], ["Z", "Zulu"],
  ];
  const fonWords = fon.map((f) => f[1]);
  for (const [L, w] of fon) {
    EXTRA.push(
      mc(T, `No alfabeto fonético internacional, a letra "${L}" é dita como:`, w, fonWords, "media"),
    );
  }
  // Cifra de César com deslocamentos variados
  const caesar = (s: string, shift: number) =>
    s.toUpperCase().split("").map((ch) => {
      const c = ch.charCodeAt(0);
      if (c >= 65 && c <= 90) return String.fromCharCode(((c - 65 + shift + 26) % 26) + 65);
      return ch;
    }).join("");
  const cwords = ["ESCOTA", "TRILHA", "MAPA", "FOGO", "NORTE", "SUL", "BUSSOLA", "PATRULHA", "PROMESSA", "LEI", "HONRA", "NATUREZA", "AGUA", "ABRIGO", "SINAL"];
  for (const shift of [1, 2, 3, 4, 5]) {
    for (const w of cwords) {
      const enc = caesar(w, shift);
      EXTRA.push(
        mc(T, `Cifra de César (deslocamento +${shift}): decifre "${enc}".`, w, cwords, "dificil"),
      );
    }
  }
  // mais palavras em morse
  const buildMorse = (w: string) => w.split("").map((c) => morse[c]).join(" ");
  const mwords = ["LUZ", "SOL", "MAR", "LEI", "RIO", "NO", "FE", "PAZ", "SIM", "NAO", "AGUA", "FOGO", "NORTE", "SUL", "MAPA", "TRILHA"];
  for (const w of mwords) {
    EXTRA.push(
      mc(T, `Decifre a mensagem em Morse: "${buildMorse(w)}"`, w, mwords, "dificil"),
    );
  }
})();

// ---------------- NATUREZA: fauna/flora brasileiras ----------------
(() => {
  const T = "natureza";
  const animalFacts: [string, string, string[], Difficulty][] = [
    ["O maior felino das Américas é a:", "Onça-pintada", ["Jaguatirica", "Suçuarana", "Lontra"], "media"],
    ["A ave símbolo da patrulha azul, ameaçada de extinção, é a:", "Arara-azul", ["Tucano", "Bem-te-vi", "Sabiá"], "facil"],
    ["O tamanduá-bandeira se alimenta principalmente de:", "Formigas e cupins", ["Frutas", "Peixes", "Folhas"], "media"],
    ["O boto-cor-de-rosa vive em:", "Rios da Amazônia", ["No mar aberto", "No deserto", "Em cavernas"], "media"],
    ["O mico-leão-dourado é um:", "Primata (macaco) brasileiro", ["Réptil", "Ave", "Peixe"], "media"],
    ["A onça caça principalmente durante:", "A noite e o amanhecer", ["Só ao meio-dia", "Nunca", "Só no inverno"], "dificil"],
    ["O animal símbolo do Pantanal, aquático e roedor, é a:", "Capivara", ["Anta", "Lontra", "Preguiça"], "facil"],
    ["A anta é o maior mamífero terrestre do Brasil e se alimenta de:", "Frutas, folhas e brotos", ["Carne", "Peixes", "Insetos"], "media"],
    ["Cobras como a jararaca são importantes porque:", "Controlam pragas como ratos", ["Não têm função", "Só atrapalham", "Poluem"], "dificil"],
    ["O tucano se destaca por:", "Seu grande bico colorido", ["Suas garras", "Suas asas gigantes", "Sua cauda longa"], "facil"],
  ];
  for (const [q, c, d, diff] of animalFacts) EXTRA.push(mc(T, q, c, d, diff));

  const bioms: [string, string, string[], Difficulty][] = [
    ["O bioma com maior floresta tropical do mundo é a:", "Amazônia", ["Caatinga", "Pampa", "Pantanal"], "facil"],
    ["O bioma da região semiárida do Nordeste é a:", "Caatinga", ["Amazônia", "Pantanal", "Mata Atlântica"], "media"],
    ["A maior área alagada do mundo, no Brasil, é o:", "Pantanal", ["Cerrado", "Pampa", "Caatinga"], "media"],
    ["O bioma de savana brasileira, com árvores retorcidas, é o:", "Cerrado", ["Amazônia", "Pantanal", "Pampa"], "media"],
    ["A Mata Atlântica é conhecida por:", "Grande biodiversidade e estar ameaçada", ["Ser um deserto", "Não ter animais", "Ser toda de neve"], "media"],
    ["Os campos do Sul do Brasil formam o bioma:", "Pampa", ["Caatinga", "Cerrado", "Amazônia"], "dificil"],
  ];
  for (const [q, c, d, diff] of bioms) EXTRA.push(mc(T, q, c, d, diff));

  const eco: [string, string, string[], Difficulty][] = [
    ["Compostagem transforma restos orgânicos em:", "Adubo", ["Plástico", "Vidro", "Metal"], "media"],
    ["Uma forma de economizar água é:", "Fechar a torneira ao escovar os dentes", ["Deixar a torneira aberta", "Tomar banhos muito longos", "Lavar calçada com mangueira"], "facil"],
    ["Materiais recicláveis comuns são:", "Papel, plástico, vidro e metal", ["Restos de comida", "Fraldas", "Pilhas comuns no lixo comum"], "facil"],
    ["O lixo eletrônico deve ser:", "Descartado em pontos de coleta específicos", ["Jogado no lixo comum", "Queimado", "Enterrado"], "dificil"],
    ["A poluição dos rios afeta:", "A água que bebemos e a vida aquática", ["Só a cor do rio", "Nada", "Apenas o céu"], "media"],
    ["Plantar árvores ajuda a:", "Melhorar o ar e abrigar animais", ["Aumentar a poluição", "Secar rios", "Nada"], "facil"],
    ["O efeito estufa em excesso causa:", "Aquecimento do planeta", ["Resfriamento eterno", "Mais chuvas sempre boas", "Nada"], "dificil"],
    ["Uma sacola retornável em vez de plásticas reduz:", "A quantidade de lixo plástico", ["O número de árvores", "A água dos rios", "Nada"], "media"],
  ];
  for (const [q, c, d, diff] of eco) EXTRA.push(mc(T, q, c, d, diff));
})();

// ---------------- NÓS: mais cenários ----------------
(() => {
  const T = "nos";
  const nos = ["Nó direito", "Nó de escota", "Nó de correr", "Volta do fiel", "Volta da ribeira", "Lais de guia", "Nó de pescador"];
  const cen: [string, string, Difficulty][] = [
    ["Preciso fazer uma alça para descer alguém com segurança (não aperta).", "Lais de guia", "media"],
    ["Preciso unir duas cordas do mesmo diâmetro rapidamente.", "Nó direito", "media"],
    ["Preciso unir uma corda grossa a uma fina.", "Nó de escota", "dificil"],
    ["Preciso de um laço que aperte ao puxar (para prender um saco).", "Nó de correr", "media"],
    ["Preciso prender a corda ao mastro para iniciar uma amarra.", "Volta do fiel", "media"],
    ["Preciso amarrar a corda firmemente a uma argola de metal.", "Volta da ribeira", "dificil"],
    ["Preciso juntar duas linhas finas que não escorreguem.", "Nó de pescador", "dificil"],
    ["Preciso de um nó que se desfaça fácil depois de içar carga leve.", "Volta do fiel", "dificil"],
    ["Preciso fazer uma laçada fixa para prender no gancho de resgate.", "Lais de guia", "media"],
    ["Preciso unir duas cordas iguais para estender um varal.", "Nó direito", "facil"],
  ];
  for (const [scen, ans, diff] of cen) {
    EXTRA.push(mc(T, `Qual nó usar? ${scen}`, ans, nos, diff));
  }
  const amarras: [string, string, string[], Difficulty][] = [
    ["A amarra usada para unir varas paralelas (aumentar o comprimento) é a:", "Amarra paralela", ["Amarra quadrada", "Amarra diagonal", "Volta do fiel"], "dificil"],
    ["A amarra que impede duas varas de se separarem quando cruzadas na diagonal é a:", "Amarra diagonal", ["Amarra quadrada", "Amarra paralela", "Nó direito"], "dificil"],
    ["Para montar uma torre ou ponte escoteira usamos principalmente:", "Amarras e pioneiria", ["Só nó direito", "Cola", "Pregos"], "media"],
    ["Uma corda usada em pioneiria deve ser guardada:", "Limpa, seca e enrolada", ["Molhada e no chão", "Cheia de nós", "Cortada"], "facil"],
    ["Antes de fazer uma amarra, é bom começar com:", "Uma volta do fiel", ["Um lais de guia", "Um nó de correr", "Nada"], "media"],
    ["Amarras firmes dependem de:", "Voltas bem apertadas e frapas", ["Voltas frouxas", "Poucas voltas", "Corda podre"], "dificil"],
  ];
  for (const [q, c, d, diff] of amarras) EXTRA.push(mc(T, q, c, d, diff));
})();

// ---------------- SOCORROS: mais situações ----------------
(() => {
  const T = "socorros";
  const sit: [string, string, string[], Difficulty][] = [
    ["Alguém está com sangramento no nariz. O correto é:", "Inclinar a cabeça levemente à frente e comprimir a narina", ["Jogar a cabeça para trás", "Deitar de barriga para cima", "Correr"], "media"],
    ["Um colega desmaia com calor extremo (insolação). Você deve:", "Levá-lo à sombra, resfriá-lo e dar água se consciente", ["Deixá-lo ao sol", "Cobri-lo com cobertor grosso", "Ignorar"], "media"],
    ["Ao encontrar uma vítima, verificar se ela responde é para:", "Avaliar o nível de consciência", ["Assustá-la", "Nada", "Fazê-la levantar"], "media"],
    ["Numa entorse (torção), NÃO se deve:", "Continuar forçando o local machucado", ["Aplicar gelo", "Repousar", "Elevar o membro"], "media"],
    ["Para uma bolha nos pés em caminhada, o ideal é:", "Proteger com curativo e evitar estourar", ["Estourar com agulha suja", "Ignorar e continuar descalço", "Esfregar"], "media"],
    ["Se uma pessoa engasga e consegue tossir, você deve:", "Incentivá-la a tossir", ["Bater com força imediatamente", "Dar água", "Deitá-la"], "dificil"],
    ["Diante de um osso possivelmente quebrado, deve-se:", "Imobilizar sem tentar 'encaixar' e buscar socorro", ["Tentar colocar no lugar", "Fazer a pessoa andar", "Massagear"], "dificil"],
    ["Sinais de hipotermia incluem:", "Tremores, pele fria e sonolência", ["Muito calor", "Muita sede apenas", "Fome"], "media"],
    ["Para prevenir a hipotermia em frio, deve-se:", "Manter-se seco e agasalhado", ["Ficar molhado", "Usar pouca roupa", "Ficar parado no vento"], "media"],
    ["A avaliação inicial de uma emergência começa por:", "Segurança da cena e chamar ajuda", ["Correr sem pensar", "Filmar", "Ir embora"], "facil"],
    ["Em queimadura, NÃO se deve:", "Passar produtos como pasta ou manteiga", ["Resfriar com água", "Cobrir com pano limpo", "Buscar ajuda"], "media"],
    ["Se você suspeita de fratura na coluna, o correto é:", "Não mover a vítima e chamar socorro", ["Sentá-la logo", "Fazê-la andar", "Levantar rápido"], "dificil"],
  ];
  for (const [q, c, d, diff] of sit) EXTRA.push(mc(T, q, c, d, diff));
})();

// ---------------- ACAMPAMENTO / FOGO / CAMPO extras ----------------
(() => {
  const items: [string, string, string, string[], Difficulty][] = [
    ["acampamento", "Ao escolher local, deve-se ficar longe de:", "Formigueiros e ninhos de marimbondos", ["Terreno plano", "Sombra", "Vista bonita"], "media"],
    ["acampamento", "A mochila deve ser arrumada com o peso:", "Distribuído e próximo às costas", ["Todo embaixo", "Todo de um lado", "Bem longe das costas"], "dificil"],
    ["acampamento", "Ao acampar, o banheiro (sanitário de campo) deve ficar:", "Longe da água e da cozinha", ["Perto do rio", "Dentro da barraca", "Na cozinha"], "media"],
    ["acampamento", "Para dormir aquecido no acampamento, é útil:", "Isolante térmico embaixo do saco de dormir", ["Dormir no chão nu", "Deixar a barraca aberta no frio", "Não usar agasalho"], "media"],
    ["acampamento", "Antes de guardar a barraca, o ideal é:", "Secá-la para evitar mofo", ["Guardar molhada", "Enrolar com terra", "Rasgar"], "media"],
    ["acampamento", "Um bom acampamento tem áreas bem definidas para:", "Barracas, cozinha, refeições e higiene", ["Só bagunça", "Uma coisa só", "Nada organizado"], "facil"],
    ["fogo", "Antes de acender fogo, verifique:", "Se não há proibição e risco de incêndio", ["A cor da lenha", "O horário do almoço", "Nada"], "media"],
    ["fogo", "Para apagar o fogo com segurança, deve-se:", "Molhar bem e mexer as cinzas até esfriar", ["Cobrir com folhas secas", "Deixar apagar sozinho", "Jogar mais lenha"], "media"],
    ["fogo", "Uma fogueira só deve ser feita em local:", "Autorizado e preparado", ["Qualquer lugar", "Dentro da mata seca", "Perto da barraca"], "facil"],
    ["fogo", "Fumaça excessiva na fogueira geralmente indica:", "Lenha úmida ou verde", ["Lenha perfeita", "Muito calor", "Nada"], "media"],
    ["fogo", "Para cozinhar por mais tempo com brasas, é melhor:", "Deixar formar boas brasas", ["Chama alta o tempo todo", "Só folhas", "Fogo apagado"], "dificil"],
    ["fogo", "Ao manusear panelas quentes, o correto é:", "Usar pegador ou pano grosso", ["Usar a mão nua", "Usar plástico", "Usar folha seca"], "facil"],
    ["campo", "Sinais de pista podem ser feitos com:", "Pedras, galhos ou marcas combinadas", ["Lixo", "Pintura em árvores vivas", "Fogo"], "media"],
    ["campo", "Ao observar pegadas frescas, você pode saber:", "Que um animal passou há pouco por ali", ["A idade da árvore", "A hora exata sempre", "Nada"], "media"],
    ["campo", "Se ficar sem bússola, você pode se orientar pelo:", "Sol e pelas estrelas", ["Barulho do vento", "Cor das folhas", "Cheiro do rio"], "media"],
    ["campo", "Um abrigo improvisado deve ter o cuidado de:", "Não ficar em local de enchente ou queda de galhos", ["Ser em barranco solto", "Ficar no leito do rio", "Ser embaixo de galho seco"], "dificil"],
    ["campo", "Para sinalizar sua posição a resgatistas, pode-se usar:", "Espelho, apito ou fogo controlado", ["Silêncio total", "Esconder-se", "Correr"], "media"],
    ["campo", "Ao seguir uma trilha marcada, a atitude correta é:", "Respeitar os sinais e não sair dela sem necessidade", ["Criar atalhos pisando na vegetação", "Apagar os sinais", "Ir sozinho sem avisar"], "media"],
  ];
  for (const [t, q, c, d, diff] of items) EXTRA.push(mc(t, q, c, d, diff));
})();

// ---------------- HISTÓRIA / VALORES extras ----------------
(() => {
  const hist: [string, string, string[], Difficulty][] = [
    ["A flor-de-lis do símbolo escoteiro lembra:", "A agulha da bússola (apontar o caminho)", ["Uma flor comum qualquer", "Um animal", "Uma estrela"], "media"],
    ["O escotismo chegou ao Brasil no início do século:", "XX (anos 1910)", ["XIX", "XVIII", "XXI"], "dificil"],
    ["A cerimônia em que o jovem assume seus compromissos chama-se:", "Promessa Escoteira", ["Formatura", "Prova final", "Aula"], "media"],
    ["Um dos objetivos do escotismo é:", "Formar bons cidadãos", ["Formar soldados", "Vencer competições", "Ganhar dinheiro"], "media"],
    ["No escotismo, aprende-se muito por meio de:", "Jogos e atividades práticas", ["Só provas escritas", "Só assistindo TV", "Só lendo em casa"], "facil"],
    ["A patrulha é liderada por um(a):", "Monitor(a) / guia de patrulha", ["Diretor", "Prefeito", "Capitão do exército"], "media"],
    ["O escotismo é oferecido a:", "Meninos e meninas", ["Só meninos", "Só adultos", "Só meninas"], "facil"],
    ["Baden-Powell nasceu no país:", "Inglaterra (Reino Unido)", ["Brasil", "Estados Unidos", "França"], "media"],
  ];
  for (const [q, c, d, diff] of hist) EXTRA.push(mc("historia", q, c, d, diff));

  const val: [string, string, string[], Difficulty][] = [
    ["Você vê alguém jogando lixo na trilha. O escoteiro:", "Recolhe e orienta com respeito", ["Faz o mesmo", "Xinga a pessoa", "Ignora"], "media"],
    ["Um colega mais novo está com medo em uma atividade. Você:", "Encoraja e ajuda com paciência", ["Zomba dele", "Ignora", "Abandona"], "facil"],
    ["Ganhou pontos de forma injusta por engano do chefe. Você:", "Avisa e corrige, pois é honesto", ["Fica quieto e aproveita", "Comemora", "Mente"], "media"],
    ["Durante um jogo, sua patrulha está perdendo. O certo é:", "Continuar com espírito esportivo e respeito", ["Trapacear", "Desistir e reclamar", "Brigar"], "media"],
    ["Você prometeu guardar o material e se cansou. Deve:", "Cumprir sua responsabilidade", ["Largar tudo", "Passar para outro escondido", "Sumir"], "facil"],
    ["Alguém de fora precisa de ajuda perto do acampamento. Você:", "Ajuda no que puder, com segurança", ["Ignora por não ser escoteiro", "Ri", "Foge"], "media"],
    ["Ser 'útil e ajuda o próximo' significa:", "Estar disposto a servir os outros", ["Só cuidar de si", "Cobrar para ajudar", "Atrapalhar"], "facil"],
    ["Você discorda de um colega. A atitude escoteira é:", "Dialogar com respeito", ["Gritar", "Ofender", "Ignorar sempre"], "facil"],
  ];
  for (const [q, c, d, diff] of val) EXTRA.push(mc("valores", q, c, d, diff));
})();

export const EXTRA_QUESTIONS: RawQuestion[] = EXTRA;
