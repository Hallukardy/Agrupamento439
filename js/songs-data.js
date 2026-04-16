/* ============================================================
   AGRUPAMENTO 439 — SONGS DATA
   Initial database for the Cancioneiro migration.
   ============================================================ */

const INITIAL_SONGS = [
  {
    id: 's1',
    title: 'Abriu-se a manhã',
    subtitle: 'Música e Letra',
    lyrics: `Abriu-se a manhã e eu Te encontrei.
Tua chama brilhou e o seu fogo entrou em mim.
Mesmo se distantes, para nós o longe é perto,
o nosso horizonte é um céu unido ao mar.
Amar é a partida de um sonho sem chegada,
Voar nas asas do vento e subir ao infinito.
Não há fronteiras que separem
Nossa amizade em sermos um só.
Só o Amor faz renascer
a vida em nós, a vida em nós.`,
    chords: '',
    videoUrl: ''
  },
  {
    id: 's2',
    title: 'Despertou de um sonho',
    subtitle: 'Música e Letra',
    lyrics: `Despertou de um sonho… um homem viu…
E fez nascer em cada olhar a semente da nova alegria.
Dando a mão a quem precisa, sempre certos da divisa,
caminhando monte acima renovando a vida.
Olhar o mundo como ele o vê
queremos ser a imagem de B.P..
O topo está mais perto, dentro de nós,
vamos levar ao mundo a sua voz;
a sua voz, a razão de viver, o seu viver para construir,
deixando o mundo sempre um pouco melhor,
sempre alerta para servir.`,
    chords: `Sol Dó Sol
Dó Sol Si- Dó Lá- Ré
Sol Dó Sol Dó
Sol Si- Dó Lá- Ré
Sol Ré
Sol Ré
Dó Ré
Dó Ré
Si- Mi- Si- Mi-
Lá- Ré
Lá- Ré`,
    videoUrl: ''
  },
  {
    id: 's3',
    title: 'Escuta CNE',
    subtitle: 'Música e Letra',
    lyrics: `Há quem me chame maluco
Eu não sei bem porque é
Deve ser pelo meu aspecto
Ou pela cor do meu boné.
Quando vou acampar
Levo só o necessário
Desde a máquina de lavar
Ao alpista pró canário.

Refrão:
Não importa o que dizem
Não importa o que pensam
Porque eu sou, porque eu sou
Escuta do CNE.

P’ra se viver no campo
É preciso ser esperto
Nunca entrar numa tenda
Sem que o fecho esteja aberto
Há ainda uma regra
Que não deve ser violada
Quando o chefe te chamar
Bate logo em retirada.`,
    chords: `Mi Lá Si
Mi Lá Si
Mi Lá Si
Mi Lá Si
Lá Si
Lá Si
Lá Si
Mi`,
    videoUrl: ''
  },
  {
    id: 's4',
    title: 'Falar com Deus',
    subtitle: 'Música e Letra',
    lyrics: `Na oração encontro calma
Na oração encontro paz
Orar a Deus faz bem à alma
Falar com Deus me satisfaz
Falar com Deus, que privilégio
Abrir a alma ao Criador
Sentir que os céus estão abertos
E ouvir a voz do Salvador

Grande é o nosso Deus
E as obras que Ele faz
O Seu amor não tem limites
Em Seu perdão encontro paz
Falar com Deus é o que preciso
Pois Ele é fonte de poder
Só Nele a vida faz sentido
Pois me dá forças pra viver`,
    chords: '',
    videoUrl: ''
  },
  {
    id: 's5',
    title: 'Eu por ti',
    subtitle: 'Música e Letra',
    lyrics: `Eu por ti acertaria o meu passo
ao teu caminhar
Eu por ti o teu problema
arcaria sobre mim
E abraçaria o horizonte
que trazes dentro do teu olhar.
Eu por ti, buscar-te-ia no mar da tua solidão
Eu por ti, te encontraria no grito dos teus porquês
Não pensando às minhas decisões
E aos meus critérios se falas Tu.

Eu por ti, palpitaria pelos teus desejos,
Eu por ti, daria voz às tuas mil razões,
Eu por ti, Eu por ti
Perder-me-ia no teu pranto,
cantaria o teu próprio canto
Que esta força em mim,
deixaria a ti primeiro, colher a flor do meu jardim

Eu por ti, faria ecoar no meu peito a voz da tua dor
Eu por ti, suportaria a tua fragilidade,
E ancorar-te-ia à minha mão,
se fosses arrastado na maré
Eu por ti, faria minha a angústia que vive em ti
Eu por ti, entregaria os meus trunfos à tua mão.
Por ti sentiria a saudade,
pelo fragor da terra que deixaste
Eu por ti, Eu por ti
Seria o eco do teu canto, na apatia e na alegria.
Que esta força em mim
deixaria a ti primeiro, colher a flor do meu jardim`,
    chords: `Si- Sol Lá
Si- Sol Lá
Mi Ré Mi Lá
Ré Mi
Fá#- Ré Mi
Fá#- Ré Mi
Lá- Fá Sol Dó
Lá- Sol Fá
Sol Dó
Lá- Sol Fá
Mi- Lá- Sol Fá Sol Lá-`,
    videoUrl: ''
  },
  {
    id: 's6',
    title: 'Flor da Fragrância',
    subtitle: 'Música e Letra',
    lyrics: `Somos a flor da fragrância
Que se difunde à distância
Pulsamos dentro do peito
Um coração que anda feito
Aos heroicos sacrifícios
De vencer paixões e vícios
E à mais renhida peleja
Pela Pátria e pela Igreja
Nos combates da virtude
Conquistamos a saúde
E ganhamos cada dia
O doce pão da alegria
Queremos a alma no olhar
Limpidamente a brilhar
Encantadora a sorrir
Bela aurora do porvir`,
    chords: '',
    videoUrl: ''
  },
  {
    id: 's7',
    title: 'Foi um Dia em Brownsea',
    subtitle: 'Música e Letra',
    lyrics: `Foi um dia em Brownsea que tudo aconteceu
Criado por um homem de fé, o escutismo apareceu.
Baden-Powell seu nome o nosso querido B.P.
Juntou os jovens que andavam no mundo sem saberem porquê

(Refrão)
Amarelo, verde, Vermelho ou Azul
Não importa o lenço que se usar
Para fazer deste mundo um lugar bom para amar
Por isso, irmão escuteiro
Lobito, Chefe ou Explorador/Caminheiro
Dá aqueles que te rodeiam alegria e amor.

Por vezes não é nada fácil os outros ajudar
Mas é nos momentos difíceis que não deves desanimar
E com fé e coragem conseguirás chegar ao fim
E a tua B.A. desse dia cumprirás assim.

Orgulha-te da farda que usas como ela, não há igual
Ela é o melhor testemunho do teu altivo ideal
Lembra a tua promessa na renunciaste ao mal
E prometeste ficar sempre alerta por Portugal!`,
    chords: '',
    videoUrl: ''
  },
  {
    id: 's8',
    title: 'Hino do C.N.E',
    subtitle: 'Música e Letra',
    lyrics: `Nós somos os escuteiros
Desta Pátria sem rival
E fomos nós os primeiros
A levantar Portugal

Avante escuteiros
Em frente a cantar
Marchemos ligeiros
E sem vacilar

A Pátria confia
No escuta leal
É deus quem nos guia
ALERTA!!!
Viva Portugal`,
    chords: '',
    videoUrl: ''
  },
  {
    id: 's9',
    title: 'Hino dos Exploradores',
    subtitle: 'Música e Letra',
    lyrics: `Somos escuteiros, (bis)
Gostamos do campo, (bis)
de fazer raids, (bis)
e acampar. (bis)
Somos exploradores, (bis)
Queremos crescer, (bis)
De verde ao peito, (bis)
Para vencer. (bis)
Vivemos aventuras dos nossos heróis,
E seguimos as pistas deixadas por BP

Refrão:
Segunda, segunda, somos a segunda secção (bis)

Logo amanhece, (bis)
Mochilas às costas, (bis)
Novos desafios, (bis)
Iremos viver. (bis)
Mais tarde escurece, (bis)
Vamos acampar, (bis)
Montar a tenda, (bis)
E descansar. (bis)
E à noitinha todos nos reunimos,
E à fogueira, para rir e cantar.`,
    chords: '',
    videoUrl: ''
  },
  {
    id: 's10',
    title: 'Hino do Lobito',
    subtitle: 'Música e Letra',
    lyrics: `São Francisco de Assis
Ensina cada lobito :
Como há-de ser feliz. (Bis)
Praticou a boa ação,
Sempre fiel, cada dia;
tinha um bom coração,
Sempre cheio de alegria.
Foi puro e obediente,
Deu exemplo de bondade;
Viveu sempre contente,
Espalhou a felicidade.`,
    chords: '',
    videoUrl: ''
  },
  {
    id: 's11',
    title: 'Hino dos Pioneiros',
    subtitle: 'Música e Letra',
    lyrics: `O nosso azul, cor do céu e do mar,
Dá-nos mais força, para lá chegar.
Chegar é ser feliz, sentir-te perto de mim
Poder cantar e rir, dizer-te sempre que sim.

Somos pioneiros, e sempre os primeiros,
Queremos viver, sempre a crescer.
Pega na mochila, na tua viola,
Vamos em equipa, todos acampar.

Refrão:
Vamos acampar, para serra e para o mar,
E à fogueira, as cantigas ao luar.
Seguimos a pista, de mãos dadas,
E, em conjunto, rumo ao fim.
Somos pioneiros, construtores do Mundo,
Sentimos força, p´ra criar e lutar.
Protege o verde, que nos deixa viver,
Estar sempre Alerta para Servir.`,
    chords: `Mi Si7 Dó#m Sol#m
Lá Mi Lá Si7
Mi Si7 Dó#m Sol#
Lá Mi Si7 Mi
Fá#m Si7 Mi Dó#m
Fá#m Si7
Fá#m Si7 Mi Dó#m
Fá#m Si7`,
    videoUrl: ''
  },
  {
    id: 's12',
    title: 'Impele a Tua Própria Canoa',
    subtitle: 'BP é quem nos diz',
    lyrics: `Não deixes cair teus olhos,
Nem te deixes enganar.
Olha de frente os escolhos,
Olha, podes encalhar.
É urgente estar atento,
Ver para onde corre a maré.
Ver donde sopra o vento,
Não vás tu perder o pé.

BP é quem nos diz Oh, Oh,
impele a tua própria canoa
Se queres mesmo ser feliz.
Não te deixes ir à toa,
Impele a tua própria canoa,
Impele a tua própria canoa.

A vida não é deserto,
Não queiras ficar no cais.
BP é rumo certo,
Decide tu aonde vais,
Não queiras ficar no cais.`,
    chords: `Ré Lá Sol Mi-
Ré Lá Mi- Sol Lá Ré
Ré Sol Lá
Ré Lá Ré
Sol Lá
Sol Si-
Ré Lá
Sol Lá Ré`,
    videoUrl: ''
  },
  {
    id: 's13',
    title: 'Pedacinho de Deus',
    subtitle: 'Música e Letra',
    lyrics: `Se sentes dentro de ti a vontade de amar
Em gestos que criem fontes, a audácia de sonhar
Mais longínquos horizontes e o apelo a escalar
Cada vez mais altos montes
Cada vez mais altos montes
Então...

Tens em ti um pedacinho de Deus
Tens rumos certos no coração
Desperta o sonho: tens em ti os céus
Liberta a vida da palma da mão
Faz desses rumos os caminhos teus
De Jesus recebeste esta missão

Se sentes dentro de ti sempre a sede de gritar
o nome da liberdade, a coragem de falar
a palavra da verdade e a servir participar
na construção da cidade, então…
Se sentes dentro de ti o silêncio inspirar
a paz ao teu coração chamando-te a enfrentar
a vida com decisão e teimas acreditar
na esperança de um mundo bom, então…`,
    chords: `Ré Fá#- Mi- Lá
Ré Fá#- Mi- Fá#-
Sol Fá#- Sol Fá#-
Sol Fá#- Mi- Lá
Ré Sol Dó Ré Sol
Ré Sol Dó Ré
Si- Sol Lá Sol Ré`,
    videoUrl: ''
  },
  {
    id: 's14',
    title: 'Que Levas na Mochila Tu',
    subtitle: 'Música e Letra',
    lyrics: `Lá fora a vida acontece
Tu preso num medo vazio
Embora a tua alma estremeça
Ansiando aquele desafio
Vives agarrado ao banal
Sem coragem de ir embora
Mas como vais ser feliz
Sabendo o que espera lá fora?

Então faz a mochila e segue caminho
No fundo tu sabes que não estás sozinho
Para cima, mais alto, é a direção
E não há melhor bússola que o coração

Tens o mundo à tua espera
E uma sede de infinito
Solta a tua voz mais sincera
Faz ouvir o teu grito!
És tu quem traça o teu destino
Não deixes a folha em branco
Agarra os lápis e pinta
Preenche cada recanto`,
    chords: `D A E F#m
A E F#m D
B F#m G#m E`,
    videoUrl: ''
  },
  {
    id: 's15',
    title: 'Renasce em mim',
    subtitle: 'Música e Letra',
    lyrics: `Se um dia eu ficasse sem Ti,
olharia as estrelas do céu
p’ra lembrar que viveste por mim,
e para sempre guardar-Te, para sempre lembrar-Te
na marca de um gesto meu.

Renasce em mim, mostra como ama alguém
que precisa de mim
p’ra mostrar o melhor que Deus tem.

O que sinto não posso explicar, é difícil saber e dizer…
O que eu tenho, não posso negar que é aquilo que eu quero,
é a Ti que eu desejo, e não vou abandonar.

Reviver o que vivi, renascer conTigo,
conquistar o Teu espaço astral,
pois quem ama não teme o bem e o mal.`,
    chords: `Dó Sol Ré
Lá- Sol Dó Sol
Lá- Dó
Sol Dó Sol Dó Ré
Mi- Dó Sol Dó Ré
Dó Ré Mi- Dó Ré- Mi-
Dó Ré
Lá- Sol Dó Ré`,
    videoUrl: ''
  },
  {
    id: 's16',
    title: 'Rumos (Homem Novo)',
    subtitle: 'Rumos do Homem Novo',
    lyrics: `Na vara que se abre em dois caminhos
aceitamos proposta de opção
sabendo que nunca vamos, sozinhos
quando é por Cristo, a decisão.

Mochila às costas, com o pão e a palavra
levamos tenda prontos para partir
guia-nos um fogo, que não se apaga
que acende no lenço, a cor do servir.

Ser Caminheiro nos rumos do Homem Novo
ser construtor, de um mundo novo
caminhando no amor ser Homem Novo.

Pelo projecto pessoal da vida sonhamos cada dia o amanhã
e que queremos de esperança decidida e partilhar na carta de clã.
Nossos rumos prosseguem aventuras
de encontros do Homem com Deus, na história
a exigir a coragem de rupturas de que a cruz no mundo, gritar memórias.

Nas palavras de montanha, a verdade
a chamar por coerência e compromisso
o evangelho feito comunidade vivido em atitude de serviço.
De B.P. vem o apelo a navegar caminhos de triunfo, a felicidade
em Jesus Cristo a meta a alcançar o Homem Novo chamado à eternidade.`,
    chords: `Dó9 Sim7 Lám7
Dó9 Sim7 Mim Lám7 Dó9 Ré
Sol Fá Dó Ré
Dó9 Sol Lá# Fá`,
    videoUrl: ''
  },
  {
    id: 's17',
    title: 'Minha Promessa',
    subtitle: 'Música e Letra',
    lyrics: `Minha promessa atende, meu Deus, Deus meu
E sobre mim estende o manto Teu
Eu te amo e quero amar cada vez mais
Não deixes de escutar, Senhor, meus ais.

Juro seguir Teus passos como Cristão
E depôr em Teus braços meu coração
Defende-me do mal, Jesus meu rei
E em prol de Portugal batalharei
Minh’alma toda cega de fé e de amor
Hoje e sempre se entrega a Vós Senhor`,
    chords: `Dó Lá- Sol Dó Sol Sol7 Dó
Fá Dó Ré- Dó Fá Dó Ré- Sol Sol7 Dó`,
    videoUrl: ''
  },
  {
    id: 's18',
    title: 'Somos ilhas',
    subtitle: 'Música e Letra',
    lyrics: `Se te sentes só no mundo e pensas que não tens um amigo
Se te sentes uma ilha toda rodeada de mar
Vem junta-te a nós

Somos ilhas como tu
Só que o mar que nos rodeia é feito de escutas sempre a cantar
Somos ilhas, mas estamos juntos sempre juntos no ideal de BP
Não há mar que nos separe
Não há guerra que nos pare
É este mar de jovens cantando que nos dá força p’ra prosseguir

Há continentes inteiros que estão separados
São as guerras só quem não quer é que não vê
Somos ilhas mas estamos juntos
E do mundo queremos fazer uma ilha gigante e unida pelo ideal de BP`,
    chords: '',
    videoUrl: ''
  },
  {
    id: 's19',
    title: 'Somos Um',
    subtitle: 'Hino do Agrupamento',
    lyrics: `Ao passar a vida, eu sei que nem tudo vai ser como sonhei.
Ter caminho p’ra fazer e um plano, sem saber ser “Mais alguém”.

E vais ver, vais sentir, Não precisas desistir
Quando a vida te pára e diz “Não!”
Pois Eu estou junto a ti, Dou-te a Força que há em mim,
Tu és mais do que um só – somos Um!

Somos Um, somos Um, somos Um... (Eu e tu somos um)

Posso ser igual a mim, ou terei de desistir de ser assim?
Confiar no coração, ou no plano que Deus Tem para mim?
Mesmo os que aqui não estão De ti esperam, com razão,
Teu rumo tu estás a traçar.
Seres alguém, seres feliz, Porque “Alguém” assim o quis,
Seres um “mais” para ti: somos um!

Somos um, eu e tu, Como a terra e o céu, Unidos pelo mesmo sol.
E de ti vais colher O orgulho de crescer
E sorrires quando vires que somos um!`,
    chords: `Sol Si- Mi- Ré Dó Sol
Sol Lá- Fá Dó Sol Dó Ré Sol Ré Sol
Sol Dó Ré`,
    videoUrl: ''
  },
  {
    id: 's20',
    title: 'Tempo novo, Homens novos',
    subtitle: 'Música e Letra',
    lyrics: `Desde sempre sopra uma brisa, Forte envolvência que nos quer guiar,
Sábia voz que nos toca o coração. Sabemos hoje onde nos pode levar.
O mundo avança com a nossa vontade. Se uma criança sonhar ser grande:
Nós queremos realizar esse sonho! Será um tempo novo… Novo!

Seremos realizadores de sonhos, (seremos realizadores de sonhos)
Homens Novos, num Tempo Novo. (num Tempo Novo, e Amanhã)
Seremos realizadores de sonhos (…um Tempo Novo…)
Tempo Novo (…Homens Novos!) Homens Novos!

Ao chegar ao alto da montanha, desafia o eco gritando: Felicidade!
E ela virá de volta uma e outra vez de cada vez que encontres a dificuldade.
Queremos aceitar o nosso desafio! Caminheiro é saber crescer por dentro,
Despertar do sonho, realizar a vida, e avançar, consciente, em cada encruzilhada.

E espalharemos esta mensagem: Há sempre uma brisa que sopra.
Ela traz a Voz sábia de Deus E irá tocar-vos o Coração.`,
    chords: `Ré Dó#- Si- Lá
Mi Ré Lá Mi Ré Lá Fá#-
Dó#- Ré Si- Mi`,
    videoUrl: ''
  },
  {
    id: 's21',
    title: 'Um Escuteiro Diferente',
    subtitle: 'Hino do ACAREG 2016',
    lyrics: `Vem! Vem! Vem! Dá o passo em frente
Dá o teu melhor e sê um ESCUTEIRO DIFERENTE!

Tudo começou com a melhor das vontades
Saber ver, ouvir, falar sempre a verdade. Qual é?
A tua vontade de seguir nesta caçada?
Depois vem a lei, vem o ser generoso
Descobres que vida é já mais do que um jogo. Qual é?
A tua vontade de embarcar nesta grande aventura?

Hey! Hey! Hey! Este é o jogo da vida
O teu querer é a tua medida
Um modo de ser, forma de viver
Porque a promessa não é só prometer

Vem! Vem! Vem! Dá o passo em frente
Dá o teu melhor e sê um ESCUTEIRO DIFERENTE!`,
    chords: `Ré Lá Sol Lá Ré
Ré Lá Sim Sol
Lá Sol Lá`,
    videoUrl: ''
  },
  {
    id: 's22',
    title: 'Um sorriso num olhar',
    subtitle: 'Música e Letra',
    lyrics: `Abri a caixa do tempo E relembrei como foi
Esvaziei o pensamento E num sonho viajei
Corre, salta, dança, voa Vem andar sobre o luar
Ama, agradece num sorriso Quem te olha a chorar (bis)
Ergue o teu olhar O Mundo vai-te abraçar (bis)`,
    chords: `Sol Ré9(/Fá#) Dó9`,
    videoUrl: ''
  },
  {
    id: 's23',
    title: 'Hino dos Caminheiros',
    subtitle: 'Clã nº 107 – São Nuno',
    lyrics: `(Letra a adicionar via Admin)`,
    chords: '',
    videoUrl: ''
  }
];
