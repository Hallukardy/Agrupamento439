/* ============================================================
   AGRUPAMENTO 439 — INTERNATIONALISATION (PT / EN)
   ============================================================ */

const I18N = {
  pt: {
    // Nav
    nav_inicio: 'Início',
    nav_seccoes: 'Secções',
    nav_calendario: 'Calendário',
    nav_cronologia: 'Cronologia',
    nav_caixatempo: 'Caixa do Tempo',
    nav_visitantes: 'Visitantes',
    nav_galeria: 'Galeria',

    nav_cancioneiro: 'Cancioneiro',
    nav_quiz: 'Descobre a tua Secção',
    nav_contactos: 'Contactos',
    nav_admin: 'Área Admin',

    // Hero
    hero_badge: '🏕️ 50 Anos de Escutismo em Vila do Conde',
    hero_title_1: 'Agrupamento',
    hero_title_2: '439',
    hero_subtitle: 'São João Baptista de Vila do Conde — Desde 1975, a formar jovens para a vida através da aventura, do serviço e da amizade.',
    hero_cta_join: 'Quero ser Escuteiro',
    hero_cta_learn: 'Saber Mais',
    stat_years: 'Anos',
    stat_scouts: 'Escuteiros Formados',
    stat_camps: 'Acampamentos',
    stat_nights: 'Noites ao Relento',

    // News
    news_title: 'Notícias & Avisos',
    news_subtitle: 'As últimas novidades do nosso agrupamento',
    filter_all: 'Todos',
    filter_geral: 'Geral',

    // Sections
    info_faq: 'Perguntas Frequentes',
    info_faq_desc: 'Tudo o que precisas de saber',
    info_history: 'A Nossa História',
    info_history_desc: 'Um legado de aventura',
    info_unique: 'Porque somos únicos',
    info_unique_desc: 'O segredo do método',
    info_mission: 'Missão e Visão',
    info_mission_desc: 'Construir um mundo melhor',
    sections_title: 'As Nossas Secções',
    sections_subtitle: 'Quatro faixas etárias, quatro grandes aventuras. Descobre a tua.',
    lobitos_name: 'Lobitos',
    lobitos_age: '6 aos 10 anos',
    lobitos_desc: 'A Alcateia nº 164 – S. Francisco de Assis é o primeiro passo no escutismo. Aqui os mais novos aprendem, brincam e crescem através do imaginário do Livro da Selva de Rudyard Kipling, desenvolvendo valores como a amizade, a partilha e o respeito pela natureza.',
    lobitos_cta: 'Quero inscrever-me!',
    lobitos_learn_more: 'Saber mais no CNE',
    lobitos_info_1: 'O grupo de Lobitos designa-se por Alcateia, onde todos os Lobitos, dos 6 aos 10 anos de idade, aprendem a trabalhar em bando, a ajudar os outros e a crescer juntos;',
    lobitos_info_2: 'Dentro da Alcateia, os Lobitos dividem-se em pequenos grupos de 4 a 7 elementos, denominados Bandos;',
    lobitos_info_3: 'Os Bandos distinguem-se por cores: Branco, Cinzento, Preto, Castanho e Ruivo, representando as diferentes cores do pelo dos lobos ao longo da vida;',
    lobitos_info_4: 'O local das reuniões dos Lobitos chama-se Covil;',
    lobitos_info_5: 'O patrono da I Secção é S. Francisco de Assis, que era amigo dos animais e da natureza. Ele é um exemplo de bondade e respeito, valores que os Lobitos também aprendem a seguir;',
    lobitos_info_6: 'A cor da Secção é o Amarelo, que representa a cor do sol dourado;',
    lobitos_info_7: 'A grande atividade dos Lobitos é a Caçada, que é desenvolvida aplicando o Método de Projeto;',
    lobitos_info_8: 'Os Lobitos vivem as suas atividades dentro e fora do Covil, onde o Jogo de Pista é a atividade típica da secção;',
    lobitos_info_9: 'A Alcateia deve ser orientada por uma Equipa de Animação, liderada pelo Àquelá, sendo que os restantes animadores adotam o nome de outras personagens do Livro da Selva;',
    lobitos_info_10: 'A divisa dos Lobitos é “Da melhor vontade”, pois todos os dias podemos melhorar um bocadinho – seja a ajudar, a brincar ou a aprender algo novo;',
    lobitos_info_11: 'Ao entrar na Alcateia, os novos elementos são denominados por Pata-Tenras;',
    lobitos_info_12: 'Os Lobitos vivem a história do Livro da Selva, tendo como exemplo Máugli;',
    lobitos_info_13: 'Os Lobitos seguem a Lei da Alcateia: “O Lobito escuta Àquelá. O Lobito não se escuta a si próprio.”',
    exploradores_name: 'Exploradores',
    exploradores_age: '10 aos 14 anos',
    exploradores_desc: 'O Grupo Explorador nº 164 – São João Baptista é a secção da aventura. As patrulhas exploram, constroem, acampam e percorrem os Caminhos de Santiago. É a idade das grandes expedições e das primeiras responsabilidades.',
    exploradores_cta: 'Quero inscrever-me!',
    exploradores_learn_more: 'Saber mais no CNE',
    exploradores_info_1: 'A Expedição é composta pelos Exploradores. Crianças entre os 10 e os 14 anos;',
    exploradores_info_2: 'Organizam-se em Patrulhas com 4 a 8 elementos, de acordo com as suas particularidades, afinidades e características;',
    exploradores_info_3: 'Cada Patrulha tem o nome de um Animal (Totem), representado na sua bandeirola;',
    exploradores_info_4: 'O local de reunião da Expedição denomina-se Base. Nestes espaços, é aconselhável que exista um canto específico para cada grupo;',
    exploradores_info_5: 'O Patrono Nacional da secção é São Tiago Maior. Cada Expedição pode ter um patrono próprio associado;',
    exploradores_info_6: 'A cor da IIª Secção é o Verde, presente no lenço, que é debruado a branco, simbolizando a Esperança e a Natureza;',
    exploradores_info_7: 'A atividade típica da Expedição denomina-se Aventura e é desenvolvida segundo o Método de Projeto;',
    exploradores_info_8: 'A Equipa de Animação é responsável pela aplicação do Método Escutista, composta por um Chefe de Unidade e Adjuntos;',
    exploradores_info_9: 'O Conselho de Guias, com os responsáveis das Patrulhas e o Chefe de Unidade, é o órgão consultivo da secção;',
    exploradores_info_10: 'O Conselho de Expedição é onde se tomam as decisões mais importantes da unidade com todos os elementos.',
    pioneiros_name: 'Pioneiros',
    pioneiros_age: '14 aos 18 anos',
    pioneiros_desc: 'O Grupo Pioneiro nº 164 – Nª Srª da Guia é o lugar do empreendedorismo. Os jovens assumem projetos, servem a comunidade e constroem o seu caminho pessoal. Aceita o desafio!',
    pioneiros_cta: 'Quero inscrever-me!',
    pioneiros_learn_more: 'Saber mais no CNE',
    pioneiros_info_1: 'Denomina-se por Comunidade a Unidade formada por Pioneiros (14 aos 18 anos);',
    pioneiros_info_2: 'Divididos em pequenos grupos de 4 a 8 elementos, chamados Equipas;',
    pioneiros_info_3: 'Equipas com o nome de Santos, pioneiros, heróis nacionais ou personalidades;',
    pioneiros_info_4: 'O local de reunião das Equipas designa-se por Abrigo;',
    pioneiros_info_5: 'O Patrono da III Secção é São Pedro, pioneiro no reconhecimento de Jesus;',
    pioneiros_info_6: 'A cor da Secção é o Azul, simbolizando o ideal "Sempre Mais Longe";',
    pioneiros_info_7: 'A atividade típica chama-se Empreendimento (Método de Projeto);',
    pioneiros_info_8: 'Competição Inter-equipas para promover o respeito e o espírito de corpo;',
    pioneiros_info_9: 'Comunidade orientada por uma Equipa de Animação liderada pelo Chefe de Unidade;',
    pioneiros_info_10: 'Conselho de Comunidade é o órgão deliberativo para escolher o projeto;',
    pioneiros_info_11: 'O Conselho de Guias é o "motor da unidade", gerido pelos Guias e Chefia.',
    caminheiros_name: 'Caminheiros',
    caminheiros_age: '18 aos 22 anos',
    caminheiros_desc: 'O Clã nº 107 – São Nuno de Santa Maria é o objetivo do Homem Novo. Os caminheiros vivem em serviço à comunidade e ajudam as secções mais novas. São os futuros líderes do agrupamento.',
    caminheiros_cta: 'Quero inscrever-me!',
    caminheiros_learn_more: 'Saber mais no CNE',
    caminheiros_info_1: 'O grupo de Caminheiros denomina-se Clã (jovens dos 18 aos 22 anos);',
    caminheiros_info_2: 'Organizam-se em pequenos grupos de 4 a 8 elementos, chamados Tribos;',
    caminheiros_info_3: 'Cada Tribo escolhe um Patrono (Santo, Benemérito ou Herói) como inspiração;',
    caminheiros_info_4: 'O local das reuniões chama-se Albergue;',
    caminheiros_info_5: 'São Paulo é o patrono dos Caminheiros, símbolo de serviço;',
    caminheiros_info_6: 'A cor da secção é o Vermelho, simbolizando Vida e Amor;',
    caminheiros_info_7: 'A grande atividade dos Caminheiros é a Caminhada;',
    caminheiros_info_8: 'O lenço dos Caminheiros é Vermelho debruado a Branco;',
    caminheiros_info_9: 'A divisa da secção é “Servir”, rumo ao ideal do Homem Novo;',
    caminheiros_info_10: 'No Conselho de Guias preparam as grandes atividades do Clã;',
    caminheiros_info_11: 'No Conselho de Clã todos os elementos tomam as decisões mais importantes.',
    hymn_cta: 'Ouve o nosso hino 🎵',
    learn_more_cne: 'Saber mais no CNE',

    // Calendar
    calendar_title: 'Calendário de Atividades',
    calendar_subtitle: 'Os próximos eventos do Agrupamento 439',
    countdown_label: 'Próximo Evento',
    add_gcal: '📅 Adicionar ao Google Calendar',
    days: 'Dias',
    hours: 'Horas',
    minutes: 'Min',
    seconds: 'Seg',

    // Timeline
    timeline_title: 'A Nossa História',
    timeline_subtitle: '50 anos de aventura, serviço e amizade',

    // Caixa do Tempo
    caixatempo_title: 'Caixa do Tempo',
    caixatempo_subtitle: 'Recortes de notícias e memórias de outros tempos',

    // Gallery
    gallery_title: 'Galeria',
    gallery_subtitle: 'Momentos que ficam para sempre',

    // Cancioneiro
    cancioneiro_title: 'Cancioneiro',
    cancioneiro_subtitle: 'Os hinos e canções do nosso agrupamento',

    // Quiz
    quiz_title: 'Quiz Escutista',
    quiz_subtitle: 'Testa os teus conhecimentos sobre o movimento escutista!',
    quiz_desc: 'Responde a algumas perguntas e descobre o quanto sabes!',
    quiz_start: 'Começar Quiz',
    quiz_next: 'Próxima',
    quiz_result: 'O teu resultado',
    quiz_restart: 'Recomeçar',
    quiz_q1: 'Quem fundou o CNE (Corpo Nacional de Escutas)?',
    quiz_q1_a: 'Baden-Powell',
    quiz_q1_b: 'D. Manuel Vieira de Matos e Dr. Avelino Gonçalves',
    quiz_q1_c: 'Nuno Álvares Pereira',
    quiz_q1_d: 'Papa João Paulo II',
    quiz_q2: 'Em que ano foi fundado o CNE?',
    quiz_q2_a: '1907',
    quiz_q2_b: '1910',
    quiz_q2_c: '1923',
    quiz_q2_d: '1975',
    quiz_q3: 'Qual é o lema global do escutismo?',
    quiz_q3_a: 'Sempre Alerta',
    quiz_q3_b: 'Servir',
    quiz_q3_c: 'Boa Caça',
    quiz_q3_d: 'Mais Além',

    // Contact
    contact_title: 'Contactos',
    contact_subtitle: 'Estamos à tua espera! Vem visitar-nos.',
    contact_email: 'Email Geral',
    contact_secretaria: 'Secretaria',
    contact_tesouraria: 'Tesouraria',
    contact_address: 'Morada',
    contact_schedule: 'Horários',
    contact_schedule_detail: 'Sábados 15h - 18h (Set. a Jul.)',
    contact_form_name: 'Nome',
    contact_form_email: 'Email',
    contact_form_message: 'Mensagem',
    contact_form_send: 'Enviar Mensagem',

    // Newsletter
    newsletter_title: 'Fica a par de tudo!',
    newsletter_desc: 'Subscreve a nossa newsletter e recebe as novidades diretamente.',
    newsletter_placeholder: 'O teu email...',
    newsletter_btn: 'Subscrever',

    // Footer
    footer_desc: 'Agrupamento 439 – São João Baptista de Vila do Conde. A formar jovens para a vida desde 1975, através da aventura, serviço e amizade.',
    footer_links: 'Links Rápidos',
    footer_external: 'Links Externos',
    footer_legal: 'Legal',
    footer_cne: 'CNE - Escutismo',
    footer_parish: 'Paróquia',
    footer_municipality: 'CM Vila do Conde',
    footer_nucleus: 'Núcleo Cego do Maio',
    footer_privacy: 'Privacidade',
    footer_rights: '© 2025 Agrupamento 439. Todos os direitos reservados.',
    footer_made: 'Feito com ❤️ por escuteiros do 439',
  },

  en: {
    nav_inicio: 'Home',
    nav_seccoes: 'Sections',
    nav_calendario: 'Calendar',
    nav_cronologia: 'History',
    nav_caixatempo: 'Time Capsule',
    nav_visitantes: 'Visitors',
    nav_galeria: 'Gallery',

    nav_cancioneiro: 'Songbook',
    nav_quiz: 'Find Your Section',
    nav_contactos: 'Contact',
    nav_admin: 'Admin Area',

    hero_badge: '🏕️ 50 Years of Scouting in Vila do Conde',
    hero_title_1: 'Group',
    hero_title_2: '439',
    hero_subtitle: 'São João Baptista de Vila do Conde — Since 1975, shaping young people through adventure, service and friendship.',
    hero_cta_join: 'Become a Scout',
    hero_cta_learn: 'Learn More',
    stat_years: 'Years',
    stat_scouts: 'Scouts Trained',
    stat_camps: 'Camps',
    stat_nights: 'Nights Under Stars',

    news_title: 'News & Notices',
    news_subtitle: 'The latest from our scouting group',
    filter_all: 'All',
    filter_geral: 'General',

    // Sections
    info_faq: 'Frequently Asked Questions',
    info_faq_desc: 'Everything you need to know',
    info_history: 'Our History',
    info_history_desc: 'A legacy of adventure',
    info_unique: 'Why we are unique',
    info_unique_desc: 'The secret of the method',
    info_mission: 'Mission and Vision',
    info_mission_desc: 'Building a better world',
    sections_title: 'Our Sections',
    sections_subtitle: 'Four age groups, four great adventures. Find yours.',
    lobitos_name: 'Cub Scouts',
    lobitos_age: '6 to 10 years',
    lobitos_desc: 'Pack nº 164 – St. Francis of Assisi is the first step in scouting. Here the youngest learn, play and grow through the Jungle Book universe, developing values like friendship, sharing and respect for nature.',
    lobitos_cta: 'I want to join!',
    lobitos_learn_more: 'Learn more at CNE',
    lobitos_info_1: 'The group of Cub Scouts is called a Pack, where all Cubs, aged 6 to 10, learn to work in a six, help others, and grow together;',
    lobitos_info_2: 'Within the Pack, Cubs are divided into small groups of 4 to 7 members, called Sixes;',
    lobitos_info_3: 'Sixes are distinguished by colors: White, Grey, Black, Brown, and Ginger, representing the different fur colors of wolves throughout their lives;',
    lobitos_info_4: 'The Cub Scout meeting place is called the Den;',
    lobitos_info_5: 'The patron of the Cub section is St. Francis of Assisi, who was a friend to animals and nature. He is an example of kindness and respect, values that Cubs also learn to follow;',
    lobitos_info_6: 'The Section color is Yellow, representing the golden sun;',
    lobitos_info_7: 'The main activity for Cubs is the Hunt, which is developed using the Project Method;',
    lobitos_info_8: 'Cubs live their activities inside and outside the Den, where the Trail Game is the typical activity of the section;',
    lobitos_info_9: 'The Pack is guided by an Animation Team, led by Akela, while other animators adopt the names of other characters from The Jungle Book;',
    lobitos_info_10: 'The Cub Scout motto is "Doing my best", as every day we can improve a little bit – whether by helping, playing, or learning something new;',
    lobitos_info_11: 'Upon entering the Pack, new members are called Tenderfoots;',
    lobitos_info_12: 'Cubs live the story of The Jungle Book, following the example of Mowgli;',
    lobitos_info_13: 'Cubs follow the Pack Law: "The Cub Scout listens to Akela. The Cub Scout does not listen to himself."',
    exploradores_name: 'Scouts',
    exploradores_age: '10 to 14 years',
    exploradores_desc: 'Scout Group nº 164 – São João Baptista is the section of adventure. Patrols explore, build, camp and walk the Camino de Santiago. It\'s the age of great expeditions and first responsibilities.',
    exploradores_cta: 'I want to join!',
    exploradores_learn_more: 'Learn more at CNE',
    exploradores_info_1: 'The Expedition consists of the Explorers. Children between 10 and 14 years old;',
    exploradores_info_2: 'They are organized into Patrols with 4 to 8 members, according to their particularities and characteristics;',
    exploradores_info_3: 'Each Patrol is named after an Animal (Totem), represented on their banner;',
    exploradores_info_4: 'The Expedition meeting place is called the Base. It is advisable to have a specific corner for each group;',
    exploradores_info_5: 'The National Patron of the section is Saint James the Greater;',
    exploradores_info_6: 'The color of the II Section is Green, present on the white-bordered scarf, symbolizing Hope and Nature;',
    exploradores_info_7: 'The typical activity of the Expedition is called Adventure and is developed according to the Project Method;',
    exploradores_info_8: 'The Animation Team is responsible for applying the Scout Method, composed of a Unit Leader and Assistants;',
    exploradores_info_9: 'The Court of Honor, composed of Patrol Leaders and the Unit Leader, is the consultative body;',
    exploradores_info_10: 'The Unit Council is where important decisions are made, with all Explorers and the Animation Team.',
    pioneiros_name: 'Ventures',
    pioneiros_age: '14 to 18 years',
    pioneiros_desc: 'Venture Group nº 164 – Our Lady of Guidance is where entrepreneurship lives. Young people lead projects, serve the community and build their personal path. Accept the challenge!',
    pioneiros_cta: 'I want to join!',
    pioneiros_learn_more: 'Learn more at CNE',
    pioneiros_info_1: 'The Unit is called Community, formed by Ventures (14 to 18 years old);',
    pioneiros_info_2: 'Divided into small groups of 4 to 8 members, called Teams;',
    pioneiros_info_3: 'Teams named after Saints, pioneers, national heroes, or personalities;',
    pioneiros_info_4: 'The Teams meeting place is called the Shelter;',
    pioneiros_info_5: 'The Patron of the III Section is Saint Peter, pioneer in recognizing Jesus;',
    pioneiros_info_6: 'The color of the Section is Blue, symbolizing the "Always Further" ideal;',
    pioneiros_info_7: 'The typical activity is called Venture (Project Method);',
    pioneiros_info_8: 'Inter-team competition to promote respect and team spirit;',
    pioneiros_info_9: 'The Community is guided by an Animation Team led by the Unit Leader;',
    pioneiros_info_10: 'The Community Council is the deliberative body that chooses the project;',
    pioneiros_info_11: 'The Court of Honor is the "engine of the unit", managed by Leaders.',
    caminheiros_name: 'Rovers',
    caminheiros_age: '18 to 22 years',
    caminheiros_desc: 'Clan nº 107 – Saint Nuno is the objective of the New Man. Rovers live in service to the community and help the younger sections. They are the group\'s future leaders.',
    caminheiros_cta: 'I want to join!',
    caminheiros_learn_more: 'Learn more at CNE',
    caminheiros_info_1: 'The Rover group is called a Clan (young adults aged 18 to 22);',
    caminheiros_info_2: 'Organized into small groups of 4 to 8 members, called Tribes;',
    caminheiros_info_3: 'Each Tribe chooses a Patron (Saint, Benefactor, or Hero) as inspiration;',
    caminheiros_info_4: 'The meeting place is called the Hostel;',
    caminheiros_info_5: 'Saint Paul is the patron of Rovers, a symbol of mission and service;',
    caminheiros_info_6: 'The Section color is Red, symbolizing Life and Love;',
    caminheiros_info_7: 'The main activity for Rovers is the Hike (Caminhada);',
    caminheiros_info_8: 'The Rover scarf is Red with a White border;',
    caminheiros_info_9: 'The motto of the section is "To Serve", towards the ideal of the New Man;',
    caminheiros_info_10: 'In the Court of Honor, they prepare the main Clan activities;',
    caminheiros_info_11: 'In the Clan Council, all members make the most important decisions.',
    hymn_cta: 'Listen to our hymn 🎵',
    learn_more_cne: 'Learn more at CNE',

    calendar_title: 'Activity Calendar',
    calendar_subtitle: 'Upcoming events for Group 439',
    countdown_label: 'Next Event',
    add_gcal: '📅 Add to Google Calendar',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Min',
    seconds: 'Sec',

    timeline_title: 'Our History',
    timeline_subtitle: '50 years of adventure, service and friendship',

    // Caixa do Tempo
    caixatempo_title: 'Time Capsule',
    caixatempo_subtitle: 'News clippings and memories from old times',

    gallery_title: 'Gallery',
    gallery_subtitle: 'Moments that last forever',

    cancioneiro_title: 'Songbook',
    cancioneiro_subtitle: 'The hymns and songs of our group',

    quiz_title: 'Scout Quiz',
    quiz_subtitle: 'Test your knowledge about the scouting movement!',
    quiz_desc: 'Answer a few questions and find out how much you know!',
    quiz_start: 'Start Quiz',
    quiz_next: 'Next',
    quiz_result: 'Your result',
    quiz_restart: 'Restart',
    quiz_q1: 'Who founded the CNE (National Corps of Scouts)?',
    quiz_q1_a: 'Baden-Powell',
    quiz_q1_b: 'D. Manuel Vieira de Matos and Dr. Avelino Gonçalves',
    quiz_q1_c: 'Nuno Álvares Pereira',
    quiz_q1_d: 'Pope John Paul II',
    quiz_q2: 'In what year was the CNE founded?',
    quiz_q2_a: '1907',
    quiz_q2_b: '1910',
    quiz_q2_c: '1923',
    quiz_q2_d: '1975',
    quiz_q3: 'What is the global motto of scouting?',
    quiz_q3_a: 'Always Ready',
    quiz_q3_b: 'To Serve',
    quiz_q3_c: 'Good Hunting',
    quiz_q3_d: 'Further Beyond',

    contact_title: 'Contact',
    contact_subtitle: 'We are waiting for you! Come visit us.',
    contact_email: 'General Email',
    contact_secretaria: 'Secretary',
    contact_tesouraria: 'Treasury',
    contact_address: 'Address',
    contact_schedule: 'Schedule',
    contact_schedule_detail: 'Saturdays 3pm - 6pm (Sep. to Jul.)',
    contact_form_name: 'Name',
    contact_form_email: 'Email',
    contact_form_message: 'Message',
    contact_form_send: 'Send Message',

    newsletter_title: 'Stay updated!',
    newsletter_desc: 'Subscribe to our newsletter and get the news directly.',
    newsletter_placeholder: 'Your email...',
    newsletter_btn: 'Subscribe',

    footer_desc: 'Group 439 – São João Baptista de Vila do Conde. Shaping young people since 1975, through adventure, service and friendship.',
    footer_links: 'Quick Links',
    footer_external: 'External Links',
    footer_legal: 'Legal',
    footer_cne: 'CNE - Scouting',
    footer_parish: 'Parish',
    footer_municipality: 'Vila do Conde Council',
    footer_nucleus: 'Cego do Maio Nucleus',
    footer_privacy: 'Privacy',
    footer_rights: '© 2025 Group 439. All rights reserved.',
    footer_made: 'Made with ❤️ by scouts of 439',
  }
};

let currentLang = localStorage.getItem('agr439-lang') || 'pt';

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || (I18N.pt[key]) || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('agr439-lang', lang);
  document.documentElement.lang = lang;
  translatePage();
}

function toggleLang() {
  setLang(currentLang === 'pt' ? 'en' : 'pt');
}

function translatePage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = t(key);
    } else {
      el.textContent = t(key);
    }
  });

  // Update lang toggle button text
  const langBtn = document.getElementById('langToggle');
  if (langBtn) {
    langBtn.textContent = currentLang === 'pt' ? 'EN' : 'PT';
  }
}
