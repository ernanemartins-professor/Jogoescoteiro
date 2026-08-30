// Terceira expansão — completa o banco para ~1000 perguntas de qualidade,
// com foco em decifração de códigos (Morse/César/números) e reforço temático.
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
function mc(t: string, q: string, correct: string, distractors: string[], difficulty: Difficulty): RawQuestion {
  const opts = [correct, ...pick(distractors, 3, [correct])];
  return { territory: t, q, options: opts, answer: 0, difficulty, explain: undefined };
}

const E: RawQuestion[] = [];

const morse: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
  H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.",
  O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-",
  V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
};
const toMorse = (w: string) => w.split("").map((c) => morse[c]).join(" ");
const caesar = (s: string, shift: number) =>
  s.toUpperCase().split("").map((ch) => {
    const c = ch.charCodeAt(0);
    if (c >= 65 && c <= 90) return String.fromCharCode(((c - 65 + shift + 26) % 26) + 65);
    return ch;
  }).join("");

// -------- CÓDIGOS: mais palavras escoteiras em Morse e César --------
(() => {
  const T = "codigos";
  const words = [
    "ALERTA", "PATRULHA", "ACAMPAR", "PIONEIRIA", "CORDA", "NORTE", "SUL", "LESTE",
    "OESTE", "MAPA", "TRILHA", "FOGO", "AGUA", "ABRIGO", "SINAL", "LEAO", "PANTERA",
    "ARARA", "CRUZEIRO", "HONRA", "LEALDADE", "SERVICO", "RESPEITO", "AVENTURA",
    "EXPEDICAO", "MISSAO", "RESGATE", "BUSSOLA", "AZIMUTE", "TENDA",
  ];
  const distract = words.slice();
  for (const w of words) {
    E.push(mc(T, `Decifre a mensagem em Morse: "${toMorse(w)}"`, w, distract, "dificil"));
  }
  for (const shift of [3, 5, 7]) {
    for (const w of words) {
      E.push(mc(T, `Cifra de César (+${shift}): decifre "${caesar(w, shift)}".`, w, distract, "dificil"));
    }
  }
  // código numérico A=1..Z=26
  const numCode = (w: string) => w.split("").map((c) => c.charCodeAt(0) - 64).join("-");
  const numWords = ["SOS", "PAZ", "SOL", "MAR", "RIO", "LEI", "FE", "LUZ"];
  for (const w of numWords) {
    E.push(mc(T, `No código numérico (A=1, B=2, ...), "${numCode(w)}" significa:`, w, numWords, "dificil"));
  }
  // conceitos de comunicação
  const conc: [string, string, string[], Difficulty][] = [
    ["Uma pausa longa em Morse separa:", "As letras/palavras", ["Nada", "Os pontos", "Os apitos"], "media"],
    ["O apito pode transmitir Morse usando:", "Sons curtos (ponto) e longos (traço)", ["Só sons longos", "Cores", "Luzes coloridas"], "media"],
    ["A lanterna pode transmitir Morse à noite com:", "Lampejos curtos e longos", ["Luz contínua", "Nada", "Cores"], "media"],
    ["A semáfora usa a posição de duas bandeiras para representar:", "Letras", ["Números apenas", "Cores", "Sons"], "dificil"],
    ["Para mandar SOS com apito, usa-se:", "3 curtos, 3 longos, 3 curtos", ["3 longos só", "1 curto", "silêncio"], "media"],
    ["O 'câmbio e desligo' no rádio significa:", "Fim da conversa", ["Comece a falar", "Repita", "Aguarde"], "media"],
  ];
  for (const [q, c, d, diff] of conc) E.push(mc(T, q, c, d, diff));
})();

// -------- reforços temáticos leves para equilibrar --------
(() => {
  // ACAMPAMENTO
  const acamp: [string, string, string[], Difficulty][] = [
    ["Para escolher o local da barraca à noite, use:", "Uma lanterna para avaliar o terreno", ["O escuro total", "Adivinhação", "Cheiro"], "facil"],
    ["Ao acampar no frio, o chão retira calor, então use:", "Isolante térmico embaixo", ["Nada", "Só a barraca", "Água"], "media"],
    ["Guardar a comida suspensa ou fechada evita:", "Atrair insetos e animais", ["Que estrague menos", "Nada", "Que fique quente"], "media"],
    ["A ordem de montagem geralmente começa por:", "Escolher e limpar o local", ["Cozinhar", "Dormir", "Fazer fogo"], "facil"],
    ["Um acampamento seguro tem sempre:", "Plano de emergência e adultos responsáveis", ["Só diversão", "Nenhuma regra", "Muito barulho"], "media"],
    ["Higiene no acampamento inclui:", "Lavar as mãos antes de comer", ["Não lavar nada", "Comer com as mãos sujas", "Beber água de poça"], "facil"],
    ["A conservação do material depende de:", "Cuidado, limpeza e armazenamento correto", ["Descuido", "Deixar no chão molhado", "Jogar longe"], "media"],
    ["Antes de dormir, o material solto deve ser:", "Guardado para não molhar/perder", ["Deixado fora", "Espalhado", "Jogado no fogo"], "facil"],
  ];
  for (const [q, c, d, diff] of acamp) E.push(mc("acampamento", q, c, d, diff));

  // FOGO
  const fogo: [string, string, string[], Difficulty][] = [
    ["A distância segura do fogo para a barraca deve ser:", "Suficiente para faíscas não alcançá-la", ["Zero, coladas", "Dentro da barraca", "Não importa"], "media"],
    ["Se o fogo começar a se espalhar, o correto é:", "Apagar imediatamente e pedir ajuda", ["Assistir", "Filmar", "Aumentar"], "media"],
    ["Lenha ideal para o fogo é:", "Seca e de tamanhos variados", ["Verde e úmida", "Só folhas", "Molhada"], "facil"],
    ["Ao cozinhar em campo, a água deve ser:", "Potável ou fervida/tratada", ["De qualquer poça", "Com barro", "Do lixo"], "media"],
    ["Após a refeição em campo, a louça deve ser:", "Lavada longe de nascentes", ["Deixada suja", "Jogada no rio", "Enterrada"], "media"],
    ["Segurança com fogo exige:", "Atenção constante", ["Descuido", "Distração", "Pressa"], "facil"],
  ];
  for (const [q, c, d, diff] of fogo) E.push(mc("fogo", q, c, d, diff));

  // CAMPO
  const campo: [string, string, string[], Difficulty][] = [
    ["Uma bússola improvisada pode ser feita com:", "Uma agulha imantada boiando na água", ["Uma pedra", "Uma folha", "Nada"], "dificil"],
    ["Ao caminhar em grupo, o ritmo deve ser:", "O do mais lento, para ninguém ficar para trás", ["O do mais rápido", "Correndo", "Cada um por si"], "media"],
    ["Se anoitecer na trilha sem chegar ao destino, o ideal é:", "Buscar abrigo seguro e sinalizar", ["Continuar correndo no escuro", "Sair da trilha", "Dormir no rio"], "media"],
    ["Para achar água em campo, procure:", "Vegetação mais verde e terrenos baixos", ["Pedras secas", "Areia", "Topo de morro seco"], "dificil"],
    ["Marcar o caminho ajuda principalmente a:", "Voltar em segurança", ["Se perder", "Poluir", "Nada"], "facil"],
    ["A observação do céu ajuda a prever:", "Mudanças no tempo", ["A hora do almoço", "A distância exata", "Nada"], "media"],
  ];
  for (const [q, c, d, diff] of campo) E.push(mc("campo", q, c, d, diff));

  // SOCORROS
  const soc: [string, string, string[], Difficulty][] = [
    ["A prevenção de acidentes começa com:", "Atenção e uso de equipamentos adequados", ["Pressa", "Descuido", "Distração"], "facil"],
    ["Diante de qualquer emergência, mantenha:", "A calma para pensar e agir", ["O pânico", "O silêncio total", "A pressa cega"], "facil"],
    ["Uma queimadura com bolhas NÃO deve ser:", "Estourada", ["Resfriada", "Coberta", "Avaliada"], "media"],
    ["Beber bastante água ajuda a prevenir:", "Desidratação e insolação", ["Torções", "Cortes", "Fraturas"], "media"],
    ["Se um colega se corta com o canivete, primeiro:", "Estanque o sangramento com pano limpo", ["Passe terra", "Deixe sangrar", "Ignore"], "media"],
    ["Uma torção deve ser tratada com repouso e:", "Gelo, compressão e elevação", ["Corrida", "Calor forte", "Massagem intensa"], "media"],
  ];
  for (const [q, c, d, diff] of soc) E.push(mc("socorros", q, c, d, diff));

  // NÓS
  const nos = ["Nó direito", "Nó de escota", "Nó de correr", "Volta do fiel", "Volta da ribeira", "Lais de guia", "Nó de pescador"];
  const nosScen: [string, string, Difficulty][] = [
    ["Fazer uma alça que não corre, para segurar com segurança.", "Lais de guia", "media"],
    ["Emendar rapidamente duas cordas do mesmo tipo.", "Nó direito", "facil"],
    ["Prender a corda ao início de uma amarra em uma vara.", "Volta do fiel", "media"],
    ["Criar um laço que fecha ao ser puxado.", "Nó de correr", "media"],
    ["Unir uma corda grossa com uma bem mais fina.", "Nó de escota", "dificil"],
    ["Prender firmemente a corda a um mosquetão/argola.", "Volta da ribeira", "dificil"],
  ];
  for (const [s, a, d] of nosScen) E.push(mc("nos", `Qual nó usar? ${s}`, a, nos, d));

  // NATUREZA
  const nat: [string, string, string[], Difficulty][] = [
    ["Um dos maiores perigos das sacolas plásticas no ambiente é:", "Demoram muito para se decompor", ["Somem rápido", "Viram adubo", "Alimentam plantas"], "media"],
    ["A melhor forma de conhecer a fauna sem prejudicá-la é:", "Observar em silêncio à distância", ["Capturar", "Alimentar", "Perseguir"], "facil"],
    ["A água limpa dos rios depende de:", "Preservar matas e não poluir", ["Jogar lixo", "Desmatar", "Poluir"], "media"],
    ["Reduzir o consumo de descartáveis é uma prática:", "Sustentável", ["Poluidora", "Inútil", "Cara sempre"], "facil"],
    ["Ao final de uma atividade na natureza, o ideal é o local ficar:", "Limpo e sem vestígios", ["Cheio de lixo", "Com fogueira acesa", "Danificado"], "facil"],
    ["Insetos como as minhocas ajudam:", "A fertilidade do solo", ["A poluição", "A seca", "Nada"], "media"],
  ];
  for (const [q, c, d, diff] of nat) E.push(mc("natureza", q, c, d, diff));

  // HISTÓRIA
  const hist: [string, string, string[], Difficulty][] = [
    ["O primeiro acampamento de Brownsea durou cerca de:", "Duas semanas", ["Um ano", "Um dia", "Seis meses"], "dificil"],
    ["O escotismo nasceu para:", "Educar jovens pela ação e pela natureza", ["Formar exércitos", "Vender livros", "Competir"], "media"],
    ["Uma marca do método escoteiro é a:", "Vida em pequenos grupos (patrulhas)", ["Aula expositiva", "Prova final", "Isolamento"], "media"],
    ["O escotismo se define como movimento:", "Educativo e voluntário", ["Obrigatório", "Político", "Comercial"], "facil"],
    ["A promessa e a lei são a base:", "Dos valores escoteiros", ["Das provas", "Do uniforme", "Do lanche"], "media"],
    ["O escotismo aceita jovens de:", "Todas as crenças e origens", ["Uma só religião", "Um só país", "Uma só cor"], "media"],
  ];
  for (const [q, c, d, diff] of hist) E.push(mc("historia", q, c, d, diff));

  // VALORES
  const val: [string, string, string[], Difficulty][] = [
    ["Você viu um colega colando em uma prova de conhecimento. O certo é:", "Conversar e incentivar a honestidade", ["Colar também", "Ajudar a colar", "Rir"], "media"],
    ["Cumprir horários e combinados demonstra:", "Responsabilidade", ["Descaso", "Preguiça", "Sorte"], "facil"],
    ["Ajudar sem esperar recompensa é:", "Espírito de serviço", ["Interesse", "Vaidade", "Egoísmo"], "facil"],
    ["Ao errar, pedir desculpas sinceras mostra:", "Humildade e honra", ["Fraqueza", "Fraude", "Nada"], "media"],
    ["Diante das diferenças, o escoteiro age com:", "Respeito e tolerância", ["Preconceito", "Zombaria", "Exclusão"], "facil"],
    ["Preservar a natureza faz parte de:", "Ser um bom cidadão do planeta", ["Ganhar prêmio", "Uma obrigação chata", "Nada"], "media"],
  ];
  for (const [q, c, d, diff] of val) E.push(mc("valores", q, c, d, diff));

  // ORIENTAÇÃO
  const all = ["Norte", "Sul", "Leste", "Oeste", "Nordeste", "Noroeste", "Sudeste", "Sudoeste"];
  const ori: [string, string, string[], Difficulty][] = [
    ["Indo para o Nordeste e virando 90° à direita, você vai para o:", "Sudeste", all, "dificil"],
    ["Indo para o Sudoeste e virando 90° à esquerda, você vai para o:", "Sudeste", all, "dificil"],
    ["O ponto oposto ao Nordeste é o:", "Sudoeste", all, "media"],
    ["O ponto oposto ao Noroeste é o:", "Sudeste", all, "media"],
    ["Se o Sol nasce à sua direita, você está voltado para o:", "Norte", all, "dificil"],
    ["Se o Sol se põe à sua esquerda, você está voltado para o:", "Norte", all, "dificil"],
    ["Uma bússola aponta a agulha para o Norte por causa do:", "Campo magnético da Terra", ["Sol", "Vento", "Peso"], "media"],
    ["A escala 1:50.000 significa que 1 cm no mapa equivale a:", "50.000 cm no real (500 m)", ["50 cm", "5 km sempre", "1 m"], "dificil"],
  ];
  for (const [q, c, d, diff] of ori) E.push(mc("orientacao", q, c, d, diff));
})();

export const EXTRA3_QUESTIONS: RawQuestion[] = E;
