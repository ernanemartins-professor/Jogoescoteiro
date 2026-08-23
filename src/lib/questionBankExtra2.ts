// Segunda expansão — balanceia os territórios mais leves e enriquece o banco.
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
): RawQuestion {
  const opts = [correct, ...pick(distractors, 3, [correct])];
  return { territory, q, options: opts, answer: 0, difficulty, explain: undefined };
}

const E: RawQuestion[] = [];

// -------- ACAMPAMENTO (equipamentos: necessário x supérfluo) --------
(() => {
  const T = "acampamento";
  const necessarios = [
    "barraca", "saco de dormir", "isolante térmico", "lanterna", "cantil de água",
    "kit de primeiros socorros", "canivete", "muda de roupa", "capa de chuva",
    "boné/chapéu", "protetor solar", "repelente", "prato e talheres", "caneca",
    "fósforos/isqueiro", "corda", "sabonete", "escova de dentes", "agasalho",
  ];
  const superfluos = [
    "televisão", "sofá", "console de videogame", "secador de cabelo", "geladeira",
    "micro-ondas", "colchão de molas", "aquário", "ventilador grande", "abajur de mesa",
    "cama box", "guarda-roupa", "bicicleta ergométrica", "espelho grande",
  ];
  for (const n of necessarios) {
    E.push(mc(T, `Para um acampamento, o item "${n}" é:`, "Necessário e adequado", ["Desnecessário", "Proibido", "Perigoso"], "facil"));
  }
  for (const s of superfluos) {
    E.push(mc(T, `Para uma caminhada de mochila, levar "${s}" é:`, "Desnecessário/inadequado", ["Essencial", "Recomendado", "Leve e prático"], "facil"));
  }
  const conc: [string, string, string[], Difficulty][] = [
    ["Ao montar a barraca com vento forte, deve-se:", "Fixar bem todas as estacas e estais", ["Deixar solta", "Não usar estacas", "Montar rápido sem fixar"], "media"],
    ["Um saco de dormir serve para:", "Manter o corpo aquecido ao dormir", ["Guardar comida", "Filtrar água", "Fazer fogo"], "facil"],
    ["O isolante térmico é colocado:", "Entre o corpo e o chão", ["Sobre a barraca", "Dentro do cantil", "Na fogueira"], "media"],
    ["A capa de chuva na mochila serve para:", "Proteger o corpo e o material da chuva", ["Decorar", "Fazer sombra apenas", "Nada"], "facil"],
    ["Ao acampar em local com sol forte, monte a barraca:", "Preferindo sombra e boa ventilação", ["Sob sol direto o dia todo", "Em buraco fechado", "Perto do fogo"], "media"],
    ["Um erro comum ao acampar é:", "Deixar comida exposta atraindo animais", ["Guardar bem os alimentos", "Fechar o lixo", "Manter tudo limpo"], "media"],
    ["A distribuição do peso na mochila deve deixar os itens pesados:", "Próximos às costas e no centro", ["No fundo, longe das costas", "Todos no topo", "Pendurados por fora"], "dificil"],
    ["Antes de dormir no acampamento, é bom:", "Verificar se o fogo está apagado", ["Deixar o fogo aceso", "Abrir a barraca no frio", "Deixar comida fora"], "media"],
    ["Levar uma lanterna ao acampamento é importante para:", "Enxergar à noite com segurança", ["Cozinhar", "Filtrar água", "Marcar trilha de dia"], "facil"],
    ["O local para a barraca deve evitar:", "Terreno inclinado e pedregoso", ["Terreno plano", "Local seco", "Boa sombra"], "facil"],
  ];
  for (const [q, c, d, diff] of conc) E.push(mc(T, q, c, d, diff));
})();

// -------- FOGO extra --------
(() => {
  const T = "fogo";
  const conc: [string, string, string[], Difficulty][] = [
    ["A 'isca' ideal para iniciar o fogo é:", "Material fino e bem seco (palha, gravetos finos)", ["Toras molhadas", "Folhas verdes", "Pedras"], "media"],
    ["Fazer o fogo longe de barracas evita:", "Que faíscas causem acidentes", ["Que ele aqueça", "Que dê luz", "Nada"], "facil"],
    ["Em dia de vento muito forte, acender fogo é:", "Perigoso e deve ser evitado", ["Recomendado", "Mais fácil e seguro", "Obrigatório"], "media"],
    ["Deixar água por perto ao usar fogo serve para:", "Apagar rapidamente em emergência", ["Cozinhar apenas", "Beber apenas", "Nada"], "facil"],
    ["Cozinhar em fogareiro dentro da barraca fechada é:", "Muito perigoso (risco de incêndio e gases)", ["Seguro", "Recomendado", "Ideal no frio"], "media"],
    ["Uma 'cozinha mateira' costuma usar:", "Fogo e estruturas de galhos/pedras", ["Forno elétrico", "Micro-ondas", "Fogão a gás doméstico"], "media"],
    ["Para conservar alimentos sem geladeira, ajuda:", "Mantê-los à sombra e em recipientes fechados", ["Deixá-los ao sol", "Molhá-los", "Deixá-los abertos"], "media"],
    ["Apagar o fogo completamente significa:", "Cinzas frias ao toque (com cuidado)", ["Só menos chama", "Cobrir com folhas", "Deixar brasas"], "media"],
    ["Um fogo do tipo 'estrela' economiza lenha porque:", "As toras são empurradas conforme queimam", ["Usa muita lenha de uma vez", "Não queima", "Precisa de gasolina"], "dificil"],
    ["A responsabilidade ambiental pede que, após o fogo:", "O solo fique sem marcas permanentes", ["Fique uma cratera", "Reste muito carvão espalhado", "Árvores sejam cortadas"], "media"],
    ["Prevenção de incêndio inclui:", "Nunca deixar o fogo sozinho", ["Fazer fogo enorme", "Usar líquidos inflamáveis", "Acender perto de mato seco"], "facil"],
    ["Para acender o fogo em ordem correta, comece pela:", "Isca fina, depois gravetos, depois lenha", ["Lenha grossa", "Toras enormes", "Folhas verdes"], "media"],
  ];
  for (const [q, c, d, diff] of conc) E.push(mc(T, q, c, d, diff));
})();

// -------- CAMPO extra (sinais de pista) --------
(() => {
  const T = "campo";
  const sinais: [string, string, string[], Difficulty][] = [
    ["Três pedras empilhadas (uma sobre a outra) num sinal de pista costumam indicar:", "Atenção / mensagem importante", ["Fim da trilha", "Água", "Perigo mortal"], "dificil"],
    ["Uma seta feita de galhos no chão indica:", "A direção a seguir", ["Local de acampar", "Perigo", "Fim"], "facil"],
    ["Um sinal circular com um ponto no centro pode significar:", "Cheguei ao destino / volte para casa", ["Siga em frente", "Perigo", "Água"], "dificil"],
    ["Vários galhos formando um 'X' indicam:", "Não siga por aqui", ["Siga em frente", "Acampe", "Água potável"], "media"],
    ["Um sinal indicando 'água potável' na trilha ajuda a:", "Encontrar água segura", ["Achar comida", "Achar o Norte", "Marcar perigo"], "media"],
    ["Para rastrear um animal, observa-se:", "Pegadas, fezes e marcas na vegetação", ["Só o céu", "Só o som do vento", "Nada"], "media"],
    ["Ao encontrar um sinal de 'perigo' na trilha, você deve:", "Redobrar a atenção e avaliar o risco", ["Ignorar", "Correr sem olhar", "Apagar o sinal"], "facil"],
    ["A técnica de deixar 'migalhas' (sinais) serve para:", "Marcar seu caminho de volta", ["Alimentar animais", "Sujar a trilha", "Nada"], "media"],
    ["Observação é uma técnica de campo que treina:", "A atenção aos detalhes do ambiente", ["A pressa", "O descuido", "O barulho"], "facil"],
    ["Para atravessar um riacho com segurança, deve-se:", "Procurar ponto raso e firme, sem pressa", ["Pular no ponto mais fundo", "Atravessar correndo", "Ir sozinho no escuro"], "media"],
    ["Em sobrevivência, o fogo ajuda a:", "Aquecer, cozinhar e sinalizar", ["Poluir", "Assustar resgate", "Nada"], "media"],
    ["Se avistar tempestade na trilha, o correto é:", "Buscar abrigo seguro e evitar árvores isoladas", ["Ficar em campo aberto", "Abraçar uma árvore alta", "Continuar correndo"], "dificil"],
    ["Uma trilha bem seguida evita que você:", "Se perca e cause impacto na vegetação", ["Chegue ao destino", "Veja a paisagem", "Ande em grupo"], "facil"],
    ["Para estimar quanto falta de luz do dia, um método de campo é:", "Medir os dedos entre o Sol e o horizonte", ["Olhar o relógio quebrado", "Chutar", "Perguntar ao vento"], "dificil"],
  ];
  for (const [q, c, d, diff] of sinais) E.push(mc(T, q, c, d, diff));
})();

// -------- SOCORROS extra --------
(() => {
  const T = "socorros";
  const sit: [string, string, string[], Difficulty][] = [
    ["O 'C' inicial de uma avaliação de emergência lembra de checar:", "Circulação/sangramentos graves", ["A comida", "A cor da roupa", "O celular"], "dificil"],
    ["Uma vítima consciente com corte no braço deve ter o ferimento:", "Comprimido com pano limpo", ["Exposto ao sol", "Lavado com refrigerante", "Coberto de terra"], "media"],
    ["Para prevenir desidratação em trilha longa, beba água:", "Em pequenos goles com frequência", ["Só no final", "Nunca", "Só quando desmaiar"], "facil"],
    ["Se um colega diz estar tonto e com muito calor, suspeite de:", "Insolação/superaquecimento", ["Fome", "Sono", "Frio"], "media"],
    ["Ao ligar 192, mantenha a calma e:", "Informe local, número de vítimas e o ocorrido", ["Desligue rápido", "Grite sem parar", "Peça pizza"], "media"],
    ["Após uma picada de abelha com o ferrão visível, deve-se:", "Remover o ferrão raspando e lavar o local", ["Apertar como espinha", "Coçar muito", "Furar mais"], "dificil"],
    ["Um colega escorregou e torceu o pé. Primeiro passo:", "Repouso e gelo, sem forçar", ["Correr", "Massagear forte", "Pular"], "media"],
    ["Em caso de hemorragia grave que não para, você deve:", "Pressionar firme e buscar socorro urgente", ["Esperar sozinho", "Lavar e ignorar", "Deixar exposto"], "media"],
    ["Prevenção é a melhor forma de:", "Evitar acidentes antes que aconteçam", ["Curar", "Filmar", "Reclamar"], "facil"],
    ["Se alguém não responde e não respira, o ideal é:", "Chamar socorro imediatamente e pedir ajuda de um adulto/socorrista", ["Dar água", "Esperar", "Sacudir com força"], "dificil"],
    ["Manter a vítima calma e aquecida ajuda a:", "Evitar agravar o estado (choque)", ["Piorar", "Nada", "Assustar"], "media"],
    ["Luvas no kit de primeiros socorros servem para:", "Proteger de contato com sangue", ["Enfeitar", "Cozinhar", "Nada"], "media"],
  ];
  for (const [q, c, d, diff] of sit) E.push(mc(T, q, c, d, diff));
})();

// -------- NÓS extra --------
(() => {
  const T = "nos";
  const nos = ["Nó direito", "Nó de escota", "Nó de correr", "Volta do fiel", "Volta da ribeira", "Lais de guia", "Nó de pescador"];
  const usos: [string, string, Difficulty][] = [
    ["Você quer estender uma corda entre duas árvores para varal.", "Nó direito", "facil"],
    ["Você precisa fazer uma laçada de segurança para não escorregar.", "Lais de guia", "media"],
    ["Você quer prender rapidamente a corda a um poste.", "Volta do fiel", "media"],
    ["Você quer um laço que aperte ao redor de um feixe de gravetos.", "Nó de correr", "media"],
    ["Você quer emendar uma corda grossa com uma fina.", "Nó de escota", "dificil"],
    ["Você precisa amarrar a corda firmemente em um anel/argola.", "Volta da ribeira", "dificil"],
    ["Você precisa juntar duas linhas finas de forma que aguentem tração.", "Nó de pescador", "dificil"],
  ];
  for (const [scen, ans, diff] of usos) {
    E.push(mc(T, `Qual nó é o mais indicado? ${scen}`, ans, nos, diff));
  }
  const conc: [string, string, string[], Difficulty][] = [
    ["Um nó mal feito em pioneiria pode causar:", "Acidentes por afrouxamento", ["Mais segurança", "Nada", "Beleza"], "media"],
    ["O lais de guia também é conhecido como:", "O 'rei dos nós'", ["Nó fraco", "Nó inútil", "Nó de sapato"], "media"],
    ["Para construir uma barraca de pioneiria firme, é essencial:", "Boas amarras e nós corretos", ["Poucos nós frouxos", "Cola", "Fita adesiva"], "media"],
    ["Antes de içar peso com corda, deve-se:", "Conferir se os nós estão firmes", ["Confiar sem olhar", "Molhar a corda", "Cortar a corda"], "media"],
    ["Uma 'frapa' em uma amarra serve para:", "Apertar e firmar as voltas", ["Afrouxar", "Enfeitar", "Nada"], "dificil"],
    ["O arremate na ponta da corda evita que ela:", "Desfie/despenteie", ["Fique bonita", "Encolha", "Molhe"], "media"],
    ["Nós devem ser praticados até se conseguir fazê-los:", "Com rapidez e segurança, até de olhos fechados", ["Só com manual", "Uma vez só", "Nunca"], "facil"],
    ["A escolha do nó depende principalmente de:", "Para que ele será usado", ["Da cor da corda", "Do dia da semana", "Do humor"], "facil"],
  ];
  for (const [q, c, d, diff] of conc) E.push(mc(T, q, c, d, diff));
})();

// -------- NATUREZA extra --------
(() => {
  const T = "natureza";
  const conc: [string, string, string[], Difficulty][] = [
    ["A regra do mínimo impacto pede que a gente:", "Deixe o ambiente como estava", ["Deixe lixo", "Corte plantas", "Faça trilhas novas"], "facil"],
    ["Alimentar animais silvestres é errado porque:", "Muda o comportamento deles e faz mal", ["É gentil", "Ajuda sempre", "É obrigatório"], "media"],
    ["A água de rios deve ser preservada porque:", "É essencial para a vida", ["Não serve para nada", "É infinita", "Atrapalha"], "facil"],
    ["Uma nascente é:", "O local onde a água brota e forma o rio", ["O fim do rio", "Uma cachoeira artificial", "Um lago poluído"], "media"],
    ["O desmatamento causa:", "Perda de habitat e biodiversidade", ["Mais animais", "Rios mais limpos", "Nada"], "media"],
    ["Coletar plantas e animais na natureza para levar é:", "Errado, deve-se apenas observar", ["Incentivado", "Obrigatório", "Recomendado"], "media"],
    ["Sustentabilidade pensa em:", "Usar recursos sem esgotá-los para o futuro", ["Gastar tudo agora", "Poluir mais", "Ignorar o futuro"], "media"],
    ["Separar o lixo em casa ajuda:", "A reciclagem", ["A poluição", "O desperdício", "Nada"], "facil"],
    ["Ecossistema é:", "O conjunto de seres vivos e o ambiente onde vivem", ["Só as plantas", "Só a água", "Só o solo"], "dificil"],
    ["Uma pegada ecológica menor significa:", "Menor impacto no planeta", ["Mais poluição", "Mais consumo", "Mais lixo"], "dificil"],
    ["Ao ver fogo começando na mata, você deve:", "Alertar adultos/bombeiros imediatamente", ["Filmar", "Ignorar", "Alimentar o fogo"], "media"],
    ["A reciclagem do papel ajuda a:", "Poupar árvores", ["Cortar mais árvores", "Poluir rios", "Nada"], "facil"],
    ["Andar sempre pela trilha marcada protege:", "A vegetação ao redor", ["O celular", "O relógio", "Nada"], "facil"],
    ["Espécies polinizadoras importantes incluem:", "Abelhas e borboletas", ["Somente cobras", "Somente peixes", "Nenhuma"], "media"],
    ["Preservar a Mata Atlântica é urgente porque:", "Resta pouca área da original", ["É toda deserto", "Não tem vida", "É infinita"], "dificil"],
    ["O consumo consciente evita:", "Desperdício de recursos", ["Economia", "Reciclagem", "Cuidado"], "media"],
  ];
  for (const [q, c, d, diff] of conc) E.push(mc(T, q, c, d, diff));
})();

// -------- HISTÓRIA extra --------
(() => {
  const T = "historia";
  const conc: [string, string, string[], Difficulty][] = [
    ["O acampamento de Brownsea reuniu jovens de:", "Diferentes origens sociais", ["Só ricos", "Só militares", "Só adultos"], "media"],
    ["Antes do escotismo, B-P ficou conhecido pelo:", "Cerco de Mafeking", ["Descobrimento do Brasil", "Voo à Lua", "Invenção do rádio"], "dificil"],
    ["O escotismo valoriza aprender:", "Fazendo, na prática e ao ar livre", ["Só decorando", "Só em sala", "Só na TV"], "facil"],
    ["A ideia de dividir jovens em pequenos grupos deu origem ao:", "Sistema de patrulhas", ["Sistema de notas", "Sistema militar", "Sistema escolar"], "media"],
    ["O escotismo é um movimento sem fins:", "Lucrativos", ["Educativos", "Sociais", "Culturais"], "media"],
    ["A cor tradicional do lenço identifica:", "O grupo escoteiro", ["A idade", "O time de futebol", "A cidade"], "media"],
    ["Distintivos escoteiros representam:", "Conquistas e especialidades", ["Notas escolares", "Dinheiro", "Nada"], "facil"],
    ["O escotismo hoje está presente em:", "Quase todos os países do mundo", ["Só na Inglaterra", "Só no Brasil", "Em 3 países"], "media"],
    ["O uniforme escoteiro serve para:", "Identificar e unir os membros", ["Enfeitar apenas", "Nada", "Esconder-se"], "facil"],
    ["A frase 'Deixe o mundo melhor do que você o encontrou' é atribuída a:", "Baden-Powell", ["Pelé", "Einstein", "Colombo"], "media"],
    ["O ramo dos mais jovens no escotismo (crianças) chama-se:", "Lobinho", ["Sênior", "Pioneiro", "Mestre"], "dificil"],
    ["O Jamboree é:", "Um grande encontro mundial de escoteiros", ["Uma prova escrita", "Um filme", "Um nó"], "media"],
  ];
  for (const [q, c, d, diff] of conc) E.push(mc(T, q, c, d, diff));
})();

// -------- VALORES extra --------
(() => {
  const T = "valores";
  const conc: [string, string, string[], Difficulty][] = [
    ["Encontrou dinheiro caído no acampamento. Você:", "Procura o dono ou entrega ao chefe", ["Guarda para si", "Esconde", "Gasta"], "facil"],
    ["Um colega quebrou algo por acidente e teme contar. Você:", "Incentiva a ser honesto e assumir", ["Manda esconder", "Zomba", "Conta mentira"], "media"],
    ["Ser econômico e trabalhador significa:", "Cuidar do que se tem e se esforçar", ["Desperdiçar", "Ser preguiçoso", "Depender dos outros"], "media"],
    ["Perante uma injustiça com um colega, o escoteiro:", "Defende o que é certo com respeito", ["Fica calado sempre", "Ri", "Ajuda a injustiça"], "media"],
    ["A alegria escoteira aparece quando:", "Enfrentamos desafios com bom ânimo", ["Reclamamos de tudo", "Desistimos", "Culpamos os outros"], "facil"],
    ["Você recebeu uma tarefa chata mas importante. O certo é:", "Cumprir com responsabilidade", ["Empurrar para outro", "Fazer mal feito", "Fugir"], "facil"],
    ["Respeitar a natureza é dever de todo escoteiro porque:", "Ela é a casa de todos os seres vivos", ["Dá pontos", "É obrigatório por lei apenas", "Não importa"], "facil"],
    ["Trabalhar em patrulha ensina:", "Cooperação e trabalho em equipe", ["Egoísmo", "Competição desleal", "Isolamento"], "media"],
    ["Você venceu um jogo. A atitude correta com quem perdeu é:", "Respeitar e cumprimentar", ["Zombar", "Humilhar", "Ignorar"], "facil"],
    ["Cuidar de quem é mais novo na tropa é um ato de:", "Fraternidade e proteção", ["Vaidade", "Obrigação chata", "Interesse"], "media"],
    ["Cumprir a palavra dada demonstra:", "Honra e confiabilidade", ["Fraqueza", "Sorte", "Nada"], "facil"],
    ["Diante do erro de um colega, o melhor é:", "Ajudar a corrigir sem humilhar", ["Expor para todos", "Rir", "Contar fofoca"], "media"],
    ["Ser 'puro nos pensamentos, palavras e ações' fala sobre:", "Agir com sinceridade e retidão", ["Mentir", "Esconder", "Enganar"], "dificil"],
    ["Servir à comunidade significa:", "Ajudar as pessoas e o lugar onde vivemos", ["Só cuidar de si", "Cobrar por tudo", "Ignorar os outros"], "media"],
  ];
  for (const [q, c, d, diff] of conc) E.push(mc(T, q, c, d, diff));
})();

// -------- ORIENTAÇÃO extra (situações práticas) --------
(() => {
  const T = "orientacao";
  const all = ["Norte", "Sul", "Leste", "Oeste", "Nordeste", "Noroeste", "Sudeste", "Sudoeste"];
  const conc: [string, string, string[], Difficulty][] = [
    ["Ao amanhecer, você caminha em direção ao Sol. Vai para o:", "Leste", ["Oeste", "Norte", "Sul"], "facil"],
    ["Ao entardecer, caminhando em direção ao Sol, você vai para o:", "Oeste", ["Leste", "Norte", "Sul"], "facil"],
    ["Se o Norte está à sua frente, o Leste fica à sua:", "Direita", ["Esquerda", "Atrás", "Frente"], "media"],
    ["Se o Norte está à sua frente, o Oeste fica à sua:", "Esquerda", ["Direita", "Atrás", "Frente"], "media"],
    ["Uma trilha que sobe muito indica terreno com:", "Grande inclinação", ["Plano total", "Alagamento", "Deserto"], "media"],
    ["Para não errar o rumo, ao seguir um azimute você deve:", "Manter a bússola nivelada e olhar a direção", ["Balançar a bússola", "Fechar os olhos", "Correr"], "media"],
    ["A leitura de mapas exige entender:", "Escala, legenda e orientação", ["Só as cores", "Só o título", "Nada"], "media"],
    ["No hemisfério sul, o Cruzeiro do Sul indica aproximadamente o:", "Sul", ["Norte", "Leste", "Oeste"], "media"],
    ["Se você está indo para o Sudeste e vira à esquerda 90°, vai para o:", "Nordeste", all, "dificil"],
    ["Se você está indo para o Noroeste e dá meia-volta, vai para o:", "Sudeste", all, "media"],
    ["Coordenadas ajudam a:", "Localizar um ponto exato no mapa/globo", ["Medir temperatura", "Ver a hora", "Contar passos"], "media"],
    ["A rosa dos ventos tem quantos pontos principais (cardeais)?", "4", ["8", "2", "16"], "facil"],
    ["Pontos cardeais + colaterais somam:", "8 direções", ["4 direções", "6 direções", "12 direções"], "media"],
    ["Se sua sombra ao meio-dia aponta para o Sul, o Sol está ao:", "Norte", ["Sul", "Leste", "Oeste"], "dificil"],
  ];
  for (const [q, c, d, diff] of conc) E.push(mc(T, q, c, d, diff));
})();

export const EXTRA2_QUESTIONS: RawQuestion[] = E;
