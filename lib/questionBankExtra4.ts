// Quarta expansão — leva o banco a mais de 1000 perguntas, reforçando
// os territórios com menos itens usando conteúdo variado e coerente.
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

// Verdadeiro/Falso temáticos (com 4 opções interpretativas) por território
type VF = [string, boolean, Difficulty];

function vfBlock(t: string, items: VF[]) {
  for (const [q, truth, diff] of items) {
    E.push(
      mc(
        t,
        `${q}`,
        truth ? "Verdadeiro" : "Falso",
        truth ? ["Falso", "Depende do dia", "Nunca"] : ["Verdadeiro", "Sempre", "Depende do dia"],
        diff,
      ),
    );
  }
}

vfBlock("acampamento", [
  ["Deve-se montar a barraca em terreno seco e plano.", true, "facil"],
  ["É seguro cozinhar dentro de uma barraca fechada.", false, "media"],
  ["O lixo do acampamento deve ser levado embora.", true, "facil"],
  ["Montar a barraca em depressão evita alagamento.", false, "media"],
  ["O isolante térmico ajuda a dormir mais aquecido.", true, "media"],
  ["Deixar comida exposta atrai animais.", true, "facil"],
  ["A entrada da barraca deve ficar contra o vento forte.", false, "media"],
  ["Estacas bem fixadas dão firmeza à barraca.", true, "facil"],
  ["Guardar a barraca molhada evita mofo.", false, "media"],
  ["Higiene das mãos antes das refeições é importante.", true, "facil"],
  ["A cozinha deve ficar perto do sanitário de campo.", false, "media"],
  ["Escolher local com sombra ajuda em dias quentes.", true, "facil"],
]);

vfBlock("fogo", [
  ["Deve-se manter água por perto ao usar o fogo.", true, "facil"],
  ["Líquido inflamável pode ser jogado sobre chamas.", false, "media"],
  ["O fogo pode ser deixado sem vigilância.", false, "facil"],
  ["A isca deve ser fina e bem seca.", true, "media"],
  ["Lenha verde produz muita fumaça.", true, "media"],
  ["Fogareiro a gás deve ser usado em local ventilado.", true, "media"],
  ["Após usar o fogo, ele deve ser totalmente apagado.", true, "facil"],
  ["Fazer fogueira em dia de vento forte é seguro.", false, "media"],
  ["Boas brasas cozinham por mais tempo.", true, "dificil"],
  ["Faíscas nunca causam incêndios.", false, "facil"],
]);

vfBlock("campo", [
  ["Uma seta em galhos indica a direção a seguir.", true, "facil"],
  ["Um 'X' na trilha significa siga em frente.", false, "facil"],
  ["O rastreamento observa pegadas e marcas.", true, "media"],
  ["Perder-se pede parar, manter a calma e sinalizar.", true, "media"],
  ["Sair da trilha marcada preserva a vegetação.", false, "media"],
  ["O Sol e as estrelas ajudam a se orientar.", true, "media"],
  ["Beber água só no fim da caminhada evita cansaço.", false, "media"],
  ["Abrigo em leito de rio é seguro.", false, "dificil"],
  ["Sinais de pista orientam quem vem atrás.", true, "facil"],
  ["Em tempestade, abraçar árvore alta é seguro.", false, "dificil"],
]);

vfBlock("socorros", [
  ["O número do SAMU é 192.", true, "facil"],
  ["Em queimadura, passa-se manteiga.", false, "media"],
  ["Repouso, gelo, compressão e elevação ajudam em torções.", true, "dificil"],
  ["Beber água previne desidratação.", true, "facil"],
  ["Diante de acidente, garante-se a segurança primeiro.", true, "media"],
  ["Estourar bolhas de queimadura é recomendado.", false, "media"],
  ["Kit de primeiros socorros deve ter luvas e gaze.", true, "facil"],
  ["Em suspeita de fratura na coluna, deve-se mover a vítima logo.", false, "dificil"],
  ["Informar o local exato ao ligar para emergência é essencial.", true, "media"],
  ["Insolação melhora ficando ao sol.", false, "media"],
]);

vfBlock("nos", [
  ["O lais de guia faz uma alça que não aperta.", true, "media"],
  ["O nó direito une cordas de espessuras muito diferentes.", false, "media"],
  ["O nó de escota une cordas de espessuras diferentes.", true, "dificil"],
  ["A volta do fiel prende bem a corda a um poste.", true, "media"],
  ["Amarras servem para unir varas em pioneiria.", true, "facil"],
  ["Um nó frouxo é sempre mais seguro.", false, "media"],
  ["O nó de correr forma um laço que aperta.", true, "media"],
  ["O arremate evita que a ponta da corda desfie.", true, "media"],
  ["Cordas gastas são ideais para içar peso.", false, "dificil"],
  ["Praticar nós ajuda a fazê-los com rapidez.", true, "facil"],
]);

vfBlock("natureza", [
  ["'Não deixe rastro' reduz o impacto no ambiente.", true, "facil"],
  ["Alimentar animais silvestres faz bem a eles.", false, "media"],
  ["Reciclar reduz a quantidade de lixo.", true, "facil"],
  ["A Amazônia é a maior floresta tropical do mundo.", true, "facil"],
  ["Queimadas aumentam a biodiversidade.", false, "media"],
  ["As abelhas polinizam as plantas.", true, "media"],
  ["Preservar nascentes protege a água dos rios.", true, "media"],
  ["Lixo eletrônico pode ir no lixo comum.", false, "dificil"],
  ["A capivara vive perto de rios e lagoas.", true, "facil"],
  ["Economizar água é uma atitude sustentável.", true, "facil"],
]);

vfBlock("historia", [
  ["Baden-Powell fundou o Movimento Escoteiro.", true, "facil"],
  ["O primeiro acampamento escoteiro foi em Brownsea, em 1907.", true, "media"],
  ["O símbolo mundial do escotismo é a flor-de-lis.", true, "facil"],
  ["'Escotismo para Rapazes' foi escrito por B-P.", true, "media"],
  ["A saudação escoteira usa dois dedos.", false, "facil"],
  ["O escotismo é um movimento educativo e voluntário.", true, "media"],
  ["O grupo menor de escoteiros é a patrulha.", true, "facil"],
  ["O lema do ramo escoteiro é 'Sempre Alerta'.", true, "facil"],
  ["O escotismo existe em pouquíssimos países.", false, "media"],
  ["O Jamboree é um grande encontro mundial escoteiro.", true, "media"],
]);

vfBlock("valores", [
  ["Um escoteiro é digno de confiança.", true, "facil"],
  ["Ficar com objeto perdido de outro é atitude escoteira.", false, "facil"],
  ["Ajudar o próximo faz parte do espírito escoteiro.", true, "facil"],
  ["Cumprir a palavra dada demonstra honra.", true, "facil"],
  ["Zombar de quem é diferente é respeitoso.", false, "facil"],
  ["Trabalhar em patrulha ensina cooperação.", true, "media"],
  ["Assumir os próprios erros é sinal de responsabilidade.", true, "media"],
  ["Proteger a natureza é dever do escoteiro.", true, "facil"],
  ["Trapacear em jogos combina com o espírito escoteiro.", false, "media"],
  ["Servir a comunidade é um valor escoteiro.", true, "facil"],
]);

vfBlock("orientacao", [
  ["A agulha da bússola aponta para o Norte magnético.", true, "facil"],
  ["O Sol nasce aproximadamente no Leste.", true, "facil"],
  ["Uma volta completa tem 360°.", true, "facil"],
  ["O azimute de 90° aponta para o Sul.", false, "media"],
  ["O Cruzeiro do Sul ajuda a achar o Sul.", true, "media"],
  ["Curvas de nível unem pontos de mesma altitude.", true, "dificil"],
  ["Pontos cardeais e colaterais somam 8 direções.", true, "media"],
  ["O topo do mapa geralmente aponta para o Sul.", false, "facil"],
  ["A escala relaciona distância no mapa e real.", true, "media"],
  ["O ponto oposto ao Norte é o Sul.", true, "facil"],
]);

vfBlock("codigos", [
  ["SOS em Morse é ... --- ...", true, "facil"],
  ["O Morse é feito de pontos e traços.", true, "facil"],
  ["A semáfora usa bandeiras para representar letras.", true, "media"],
  ["'Câmbio' no rádio significa desligar o aparelho.", false, "media"],
  ["A cifra de César desloca as letras do alfabeto.", true, "media"],
  ["Códigos de pista deixam indicações no caminho.", true, "facil"],
  ["No rádio, 'positivo' significa não.", false, "facil"],
  ["O apito pode transmitir Morse com sons curtos e longos.", true, "media"],
  ["Mensagem cifrada esconde a informação de quem não tem a chave.", true, "facil"],
  ["A lanterna pode transmitir Morse à noite.", true, "media"],
]);

// Complemento final para ultrapassar 1000 perguntas
(() => {
  const fogo: [string, string, string[], Difficulty][] = [
    ["O melhor local para o fogo em uma atividade é:", "Área limpa e afastada de material inflamável", ["Sobre folhas secas", "Dentro da barraca", "Em grama alta"], "facil"],
    ["Ao terminar a atividade, o fogo deve ficar:", "Completamente apagado e frio", ["Ainda aceso", "Com brasas", "Coberto de folhas"], "facil"],
  ];
  for (const [q, c, d, diff] of fogo) E.push(mc("fogo", q, c, d, diff));

  const campo: [string, string, string[], Difficulty][] = [
    ["Rastrear é acompanhar pistas para:", "Encontrar ou identificar quem passou", ["Se perder", "Cozinhar", "Dormir"], "media"],
    ["Ao encontrar um sinal de retorno, você deve:", "Voltar pelo caminho indicado", ["Seguir em frente", "Acampar", "Ignorar"], "facil"],
  ];
  for (const [q, c, d, diff] of campo) E.push(mc("campo", q, c, d, diff));

  const soc: [string, string, string[], Difficulty][] = [
    ["A avaliação da situação em uma emergência serve para:", "Entender o que houve e agir com segurança", ["Perder tempo", "Assustar", "Nada"], "facil"],
    ["Chamar ajuda especializada rapidamente pode:", "Salvar vidas", ["Piorar sempre", "Atrapalhar", "Não fazer diferença"], "facil"],
  ];
  for (const [q, c, d, diff] of soc) E.push(mc("socorros", q, c, d, diff));

  const nos = ["Nó direito", "Nó de escota", "Nó de correr", "Volta do fiel", "Volta da ribeira", "Lais de guia", "Nó de pescador"];
  E.push(mc("nos", "Qual nó forma uma alça fixa segura para resgate?", "Lais de guia", nos, "media"));
  E.push(mc("nos", "Qual nó é ideal para unir duas cordas iguais rapidamente?", "Nó direito", nos, "facil"));

  const nat: [string, string, string[], Difficulty][] = [
    ["A biodiversidade representa:", "A variedade de vida em um ambiente", ["A cor do céu", "O tamanho do rio", "A quantidade de trilhas"], "media"],
    ["O mínimo impacto ensina a:", "Aproveitar a natureza sem prejudicá-la", ["Poluir", "Cortar árvores", "Deixar lixo"], "facil"],
  ];
  for (const [q, c, d, diff] of nat) E.push(mc("natureza", q, c, d, diff));

  const hist: [string, string, string[], Difficulty][] = [
    ["Baden-Powell é conhecido como:", "O fundador do escotismo", ["Um explorador espacial", "Um pintor", "Um rei"], "facil"],
    ["A patrulha é a base do:", "Sistema escoteiro de pequenos grupos", ["Sistema escolar", "Sistema militar", "Sistema de notas"], "media"],
  ];
  for (const [q, c, d, diff] of hist) E.push(mc("historia", q, c, d, diff));

  const val: [string, string, string[], Difficulty][] = [
    ["Encontrar algo perdido e devolver mostra:", "Honestidade", ["Esperteza", "Sorte", "Interesse"], "facil"],
    ["Ajudar sem esperar nada em troca é:", "Serviço ao próximo", ["Negócio", "Troca", "Favor cobrado"], "facil"],
  ];
  for (const [q, c, d, diff] of val) E.push(mc("valores", q, c, d, diff));

  const acamp: [string, string, string[], Difficulty][] = [
    ["Antes de armar a barraca, o local deve ser:", "Limpo de pedras e galhos", ["Molhado", "Cheio de buracos", "Inclinado"], "facil"],
    ["O sobreteto da barraca protege da:", "Chuva e do sol", ["Fome", "Sede", "Escuridão"], "facil"],
  ];
  for (const [q, c, d, diff] of acamp) E.push(mc("acampamento", q, c, d, diff));

  const ori: [string, string, string[], Difficulty][] = [
    ["De frente para o Sul, o Norte fica:", "Atrás de você", ["À frente", "À direita", "À esquerda"], "facil"],
    ["O azimute de 0° corresponde ao:", "Norte", ["Sul", "Leste", "Oeste"], "facil"],
  ];
  for (const [q, c, d, diff] of ori) E.push(mc("orientacao", q, c, d, diff));
})();

// Bloco final de códigos para completar 1000+ perguntas
(() => {
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
  const words = ["GUIA", "TROPA", "LOBINHO", "PIONEIRO", "SENIOR", "CHEFE", "NATUREZA", "AVENTURA", "SEGURANCA", "COOPERAR", "AMIZADE", "CORAGEM", "DEVER", "SERVIR", "ORDEM"];
  for (const w of words) {
    E.push(mc("codigos", `Decifre a mensagem em Morse: "${toMorse(w)}"`, w, words, "dificil"));
  }
  for (const w of words) {
    E.push(mc("codigos", `Cifra de César (+4): decifre "${caesar(w, 4)}".`, w, words, "dificil"));
  }
})();

export const EXTRA4_QUESTIONS: RawQuestion[] = E;
