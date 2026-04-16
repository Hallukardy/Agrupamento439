/* ============================================================
   AGRUPAMENTO 439 — MAIN JS
   Navbar, dark/light, scroll, quiz, countdown, gallery, etc.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSectionTheme();
  initNavbar();
  initParticles();
  initHeroStats();
  initCounterAnimation();
  initSectionTabs();
  initCountdown();
  initGalleryLightbox();
  initQuiz();
  initNewsletterForm();
  initContactForm();
  renderDynamicNews();
  renderDynamicEvents();
  initSongbook();
  initVisits();
  renderCaixaTempo();
  initRecruitmentContent();
  initTimeline();
  initScrollReveal();
  translatePage();
});



/* ---------- THEME ---------- */
function initTheme() {
  const saved = localStorage.getItem('agr439-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('agr439-theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

/* ---------- SECTION THEME ---------- */
function initSectionTheme() {
  const saved = localStorage.getItem('agr439-section-theme') || 'lobitos';
  setSectionTheme(saved, false);
}

function setSectionTheme(theme, save = true) {
  document.documentElement.setAttribute('data-section-theme', theme);
  if (save) localStorage.setItem('agr439-section-theme', theme);
  
  // Update section tabs if they exist
  const tabs = document.querySelectorAll('.section-tab');
  tabs.forEach(tab => {
    tab.classList.toggle('active', tab.getAttribute('data-section') === theme);
  });
  
  // Update panels
  const panels = document.querySelectorAll('.section-panel');
  panels.forEach(panel => {
    panel.classList.toggle('active', panel.id === `panel-${theme}`);
  });
}

/* ---------- NAVBAR ---------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlight
    updateActiveNavLink();
  });

  // Hamburger toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navLinks?.classList.remove('open');
    });
  });
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('.section[id]');
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${id}`) {
          a.classList.add('active');
        }
      });
    }
  });
}

/* ---------- PARTICLES ---------- */
function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (4 + Math.random() * 4) + 's';
    particle.style.width = (2 + Math.random() * 3) + 'px';
    particle.style.height = particle.style.width;
    container.appendChild(particle);
  }
}

/* ---------- HERO & STATS DYNAMIC LOADING ---------- */
function initHeroStats() {
  const data = JSON.parse(localStorage.getItem('agr439-admin-hero-stats'));
  if (!data) return;

  // Update hero icon
  const logo = document.querySelector('.hero-logo');
  if (logo && data.icon) {
    logo.src = data.icon;
  }

  // Update Title
  const title1 = document.querySelector('[data-i18n="hero_title_1"]');
  const title2 = document.querySelector('[data-i18n="hero_title_2"]');
  if (title1 && data.title1) {
    title1.textContent = data.title1;
    title1.removeAttribute('data-i18n');
  }
  if (title2 && data.title2) {
    title2.textContent = data.title2;
    title2.removeAttribute('data-i18n');
  }

  // Update Subtitle
  const subtitle = document.querySelector('.hero-subtitle');
  if (subtitle && data.subtitle) {
    subtitle.textContent = data.subtitle;
    subtitle.removeAttribute('data-i18n');
  }

  // Update Statistics
  const statContainers = document.querySelectorAll('.stat-item');
  if (statContainers.length >= 4) {
    const statsData = [
      { val: data.years },
      { val: data.scouts },
      { val: data.camps },
      { val: data.nights }
    ];

    statContainers.forEach((item, index) => {
      const numEl = item.querySelector('.stat-number');
      if (numEl && statsData[index]) {
        numEl.setAttribute('data-target', statsData[index].val);
      }
    });
  }
}

/* ---------- COUNTER ANIMATION ---------- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = prefix + current.toLocaleString('pt-PT') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* ---------- SECTION TABS ---------- */
function initSectionTabs() {
  const tabs = document.querySelectorAll('.section-tab');
  const panels = document.querySelectorAll('.section-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-section');
      setSectionTheme(target);
    });
  });
}

/* ---------- EVENT COUNTDOWN ---------- */
function initCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;

  const targetDate = el.getAttribute('data-date');
  if (!targetDate) return;

  const target = new Date(targetDate).getTime();

  function update() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      el.innerHTML = '<div class="countdown-block"><div class="digit">🎉</div><div class="label">Evento Hoje!</div></div>';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    el.innerHTML = `
      <div class="countdown-block"><div class="digit">${d}</div><div class="label" data-i18n="days">${t('days')}</div></div>
      <div class="countdown-block"><div class="digit">${h}</div><div class="label" data-i18n="hours">${t('hours')}</div></div>
      <div class="countdown-block"><div class="digit">${m}</div><div class="label" data-i18n="minutes">${t('minutes')}</div></div>
      <div class="countdown-block"><div class="digit">${s}</div><div class="label" data-i18n="seconds">${t('seconds')}</div></div>
    `;

    requestAnimationFrame(update);
  }

  update();
  setInterval(update, 1000);
}

/* ---------- EVENT ACTIONS & SHARING ---------- */
function addToGoogleCalendar(title, date, location, details) {
  const startDate = new Date(date).toISOString().replace(/-|:|\.\d+/g, '');
  const endDate = new Date(new Date(date).getTime() + 3 * 3600000).toISOString().replace(/-|:|\.\d+/g, '');

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

  window.open(url, '_blank');
}

async function shareEvent(title, text) {
  const shareData = {
    title: `Agrupamento 439 - ${title}`,
    text: text,
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      alert(currentLang === 'pt' ? '📋 Link copiado para a área de transferência!' : '📋 Link copied to clipboard!');
    }
  } catch (err) {
    console.error('Share failed:', err);
  }
}


/* ---------- LIGHTBOX ---------- */
function initGalleryLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  // Delegate lightbox close events
  document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

function openLightbox(src, alt = 'Imagem Agrupamento 439') {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}


/* ---------- QUIZ ---------- */
const quizQuestions = [
  { key: 'q1', options: ['a', 'b', 'c', 'd'], correct: 'b' },
  { key: 'q2', options: ['a', 'b', 'c', 'd'], correct: 'c' },
  { key: 'q3', options: ['a', 'b', 'c', 'd'], correct: 'a' },
];

let quizCurrentQ = 0;
let quizScore = 0;

function initQuiz() {
  const startBtn = document.getElementById('quiz-start-btn');
  if (!startBtn) return;

  startBtn.addEventListener('click', () => {
    quizCurrentQ = 0;
    quizScore = 0;
    showQuizQuestion();
  });
}

function showQuizQuestion() {
  const container = document.getElementById('quiz-body');
  if (!container) return;

  if (quizCurrentQ >= quizQuestions.length) {
    showQuizResult();
    return;
  }

  const q = quizQuestions[quizCurrentQ];

  container.innerHTML = `
    <div class="quiz-progress">
      ${quizQuestions.map((_, i) => `<div class="quiz-progress-dot ${i <= quizCurrentQ ? 'active' : ''}"></div>`).join('')}
    </div>
    <div class="quiz-question" data-i18n="quiz_${q.key}">${t(`quiz_${q.key}`)}</div>
    <div class="quiz-options">
      ${q.options.map(opt => `
        <button class="quiz-option" onclick="selectQuizOption('${opt}', '${q.correct}')">
          <span data-i18n="quiz_${q.key}_${opt}">${t(`quiz_${q.key}_${opt}`)}</span>
        </button>
      `).join('')}
    </div>
  `;
}

function selectQuizOption(opt, correct) {
  if (opt === correct) {
    quizScore++;
  }
  quizCurrentQ++;
  showQuizQuestion();
}

function showQuizResult() {
  const container = document.getElementById('quiz-body');
  if (!container) return;

  let emoji = '🌟';
  let message = 'Muito bem!';
  if (quizScore === 0) { emoji = '📚'; message = 'Tens de estudar mais!'; }
  else if (quizScore === quizQuestions.length) { emoji = '🏆'; message = 'Escuteiro Especialista!'; }

  container.innerHTML = `
    <div class="quiz-result">
      <div class="quiz-result-icon">${emoji}</div>
      <h3>${t('quiz_result')}</h3>
      <p style="font-size:1.5rem; font-weight:700; color: var(--c-primary); margin: 1rem 0;">
        ${quizScore} / ${quizQuestions.length}
      </p>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
        ${message}
      </p>
      <button class="btn btn-outline" onclick="initQuiz(); document.getElementById('quiz-start-btn').click();">
        ${t('quiz_restart')}
      </button>
    </div>
  `;
}

/* ---------- NEWS FILTER ---------- */
function filterNews(tag) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  document.querySelectorAll('.news-card').forEach(card => {
    if (tag === 'all' || card.getAttribute('data-tag') === tag) {
      card.style.display = '';
      card.style.animation = 'fadeInUp 0.4s ease';
    } else {
      card.style.display = 'none';
    }
  });
}

/* ---------- NEWSLETTER ---------- */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input').value;

    // Save to localStorage (demo)
    const subs = JSON.parse(localStorage.getItem('agr439-newsletter') || '[]');
    subs.push({ email, date: new Date().toISOString() });
    localStorage.setItem('agr439-newsletter', JSON.stringify(subs));

    form.querySelector('input').value = '';
    alert(currentLang === 'pt' ? '✅ Subscrito com sucesso!' : '✅ Successfully subscribed!');
  });
}

/* ---------- CONTACT FORM ---------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      name: form.querySelector('#contact-name').value,
      email: form.querySelector('#contact-email').value,
      message: form.querySelector('#contact-message').value,
      date: new Date().toISOString(),
    };

    const msgs = JSON.parse(localStorage.getItem('agr439-messages') || '[]');
    msgs.push(data);
    localStorage.setItem('agr439-messages', JSON.stringify(msgs));

    form.reset();
    alert(currentLang === 'pt' ? '✅ Mensagem enviada com sucesso!' : '✅ Message sent successfully!');
  });
}

/* ---------- SCROLL REVEAL ---------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ---------- SMOOTH SCROLL ---------- */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

/* ---------- DYNAMIC RENDERING ---------- */
function renderDynamicNews() {
  const grid = document.getElementById('newsGrid');
  if (!grid) return;

  const news = JSON.parse(localStorage.getItem('agr439-admin-news') || '[]').filter(n => n.published);
  
  if (news.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 2rem; color: var(--text-muted);">Sem notícias publicadas no momento.</div>';
    return;
  }

  // Sort by date descending
  news.sort((a, b) => new Date(b.date) - new Date(a.date));

  grid.innerHTML = news.map(n => `
    <div class="news-card reveal visible" data-tag="${n.tag}">
      ${n.imageUrl ? `<img src="${n.imageUrl}" class="news-card-img" alt="${escapeHtml(n.title)}" onclick="openLightbox(this.src)">` : ''}
      <div class="news-card-body">
        <span class="news-card-tag tag-${n.tag}">${n.tag}</span>
        <h3>${escapeHtml(n.title)}</h3>
        <p>${escapeHtml(n.content).replace(/\n/g, '<br>')}</p>
        <div class="news-card-date">📅 ${new Date(n.date).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}</div>
      </div>
    </div>
  `).join('');

}

function renderDynamicEvents() {
  const grid = document.getElementById('calendarGrid');
  if (!grid) return;

  const events = JSON.parse(localStorage.getItem('agr439-admin-events') || '[]');
  const gallery = JSON.parse(localStorage.getItem('agr439-admin-gallery') || '[]');
  
  if (events.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 2rem; color: var(--text-muted);">Ainda não há eventos previstos.</div>';
    return;
  }

  // Sort by date ascending
  events.sort((a, b) => new Date(a.date) - new Date(b.date));

  grid.innerHTML = events.map(e => {
    const eventDate = new Date(e.date);
    const dateStr = eventDate.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }) + ' | ' + eventDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

    const eventPhotos = e.galleryIds ? e.galleryIds.map(id => gallery.find(g => g.id === id)).filter(Boolean) : [];
    
    let imageHtml = '';
    if (eventPhotos.length === 1) {
      imageHtml = `<img src="${eventPhotos[0].url}" alt="${escapeHtml(e.title)}" class="event-image" onclick="openLightbox(this.src)">`;
    } else if (eventPhotos.length > 1) {
      imageHtml = `<div class="event-swimlane">` + eventPhotos.map(p => `
        <img src="${p.url}" alt="${escapeHtml(e.title)}" onclick="openLightbox(this.src)">
      `).join('') + `</div>`;
    } else {
      imageHtml = `<img src="https://placehold.co/800x400/1b2b4d/F39C12?text=Evento+439" alt="Evento Placeholder" class="event-image">`;
    }

    return `
      <div class="event-card reveal visible">
        ${imageHtml}
        <div class="event-info">
          <div class="event-date">📅 ${dateStr}</div>
          <h3>${escapeHtml(e.title)}</h3>
          <p>${escapeHtml(e.description).replace(/\n/g, '<br>')}</p>
          <div class="event-actions">
            <button class="gcal-btn" onclick="addToGoogleCalendar('${escapeHtmlQuotes(e.title)}','${e.date}','${escapeHtmlQuotes(e.location)}','${escapeHtmlQuotes(e.description)}')">📅 Calendário</button>
            <button class="share-btn" onclick="shareEvent('${escapeHtmlQuotes(e.title)}', 'Vem connosco!')">🔗 Partilhar</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* ---------- RECRUITMENT CONTENT ---------- */
function initRecruitmentContent() {
  const data = JSON.parse(localStorage.getItem('agr439-admin-recruitment') || '{}');
  
  if (data.flyerUrl) {
    const flyer = document.getElementById('recruitment-flyer-img');
    if (flyer) flyer.src = data.flyerUrl;
  }
  
  if (data.headerUrl) {
    const header = document.getElementById('recruitment-header-img');
    if (header) header.src = data.headerUrl;
  }
  
  if (data.pdfImageUrl) {
    const pdfImg = document.getElementById('recruitment-pdf-img');
    if (pdfImg) pdfImg.src = data.pdfImageUrl;
  }
  
  if (data.pdfLink) {
    const pdfLink = document.getElementById('recruitment-pdf-link');
    if (pdfLink) pdfLink.href = data.pdfLink;
  }
}


function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag]));
}

function escapeHtmlQuotes(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

/* ---------- CANCIONEIRO DINÂMICO ---------- */
function initSongbook() {
  // Sync INITIAL_SONGS to localStorage if empty
  const stored = localStorage.getItem('agr439-admin-songs');
  if (!stored || JSON.parse(stored).length === 0) {
    localStorage.setItem('agr439-admin-songs', JSON.stringify(INITIAL_SONGS));
  }
  
  renderSongsList();
}

function renderSongsList() {
  const grid = document.getElementById('songsGrid');
  if (!grid) return;

  const songs = JSON.parse(localStorage.getItem('agr439-admin-songs') || '[]');
  
  if (songs.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--text-muted);">Cancioneiro em atualização...</p>';
    return;
  }

  // Sort alphabetically
  songs.sort((a, b) => a.title.localeCompare(b.title));

  grid.innerHTML = songs.map(s => `
    <button class="song-link" onclick="openSongModal('${s.id}')">
      <span class="icon">🎵</span>
      <span class="title">${escapeHtml(s.title)}</span>
    </button>
  `).join('');
}

function openSongModal(id) {
  const songs = JSON.parse(localStorage.getItem('agr439-admin-songs') || '[]');
  const song = songs.find(s => s.id === id);
  if (!song) return;

  const modal = document.getElementById('song-modal');
  const titleEl = document.getElementById('song-modal-title');
  const subtitleEl = document.getElementById('song-modal-subtitle');
  const lyricsEl = document.getElementById('song-modal-lyrics');
  const videoPlaceholder = document.getElementById('song-modal-video-placeholder');
  const noVideoMsg = document.getElementById('song-no-video');

  titleEl.textContent = song.title;
  subtitleEl.textContent = song.subtitle || '';
  
  // Combine lyrics and chords for display
  let content = song.lyrics;
  if (song.chords) {
    content += '\n\n---\n\nCIFRAS SUGERIDAS:\n' + song.chords;
  }
  lyricsEl.textContent = content;

  // Video handling
  if (song.videoUrl && song.videoUrl.trim() !== '') {
    const embedUrl = getYoutubeEmbedUrl(song.videoUrl);
    if (embedUrl) {
      videoPlaceholder.style.display = 'block';
      let iframeStyle = '';
      if (song.audioOnly) {
         videoPlaceholder.style.paddingBottom = '0';
         videoPlaceholder.style.height = '60px'; // Altura apenas para ver os controlos play/pause
         videoPlaceholder.innerHTML = `<iframe src="${embedUrl}?controls=1" style="border:0; width:100%; height:60px;" allow="autoplay; encrypted-media"></iframe>`;
      } else {
         videoPlaceholder.style.paddingBottom = '56.25%';
         videoPlaceholder.style.height = '0';
         videoPlaceholder.innerHTML = `<iframe src="${embedUrl}" allowfullscreen></iframe>`;
      }
      noVideoMsg.style.display = 'none';
    } else {
      videoPlaceholder.style.display = 'none';
      noVideoMsg.style.display = 'block';
    }
  } else {
    videoPlaceholder.style.display = 'none';
    noVideoMsg.style.display = 'block';
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSongModal() {
  const modal = document.getElementById('song-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // Stop video and reset styles
    const videoPlaceholder = document.getElementById('song-modal-video-placeholder');
    if (videoPlaceholder) {
      videoPlaceholder.innerHTML = '';
      videoPlaceholder.style.height = '';
      videoPlaceholder.style.paddingBottom = '';
    }
  }
}

function getYoutubeEmbedUrl(url) {
  if (!url) return null;
  let videoId = '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    videoId = match[2];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return null;
}

/* ---------- VISITANTES ---------- */
function initVisits() {
  const stored = localStorage.getItem('agr439-admin-visits');
  if (!stored || JSON.parse(stored).length === 0) {
    if (typeof INITIAL_VISITS !== 'undefined') {
      localStorage.setItem('agr439-admin-visits', JSON.stringify(INITIAL_VISITS));
    }
  }
  renderVisitsList();
}

function renderVisitsList() {
  const grid = document.getElementById('visitsGrid');
  if (!grid) return;

  const visits = JSON.parse(localStorage.getItem('agr439-admin-visits') || '[]');
  
  if (visits.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--text-muted);">A carregar recordações...</p>';
    return;
  }

  // Card horizontal compacto
  grid.innerHTML = visits.map(v => `
    <div class="visit-card-compact reveal" onclick="openVisitLightbox('${v.imageUrl}', '${escapeHtml(v.title)}')">
      <div class="vcc-image">
        <img src="${v.imageUrl}" alt="${escapeHtml(v.title)}" onerror="this.src='https://placehold.co/150x150/222/FFF?text=Postal'" loading="lazy">
        <div class="vcc-overlay"><span class="icon">🔍</span></div>
      </div>
      <div class="vcc-info">
        <span class="vcc-date">${escapeHtml(v.date)}</span>
        <h3 class="vcc-title">${escapeHtml(v.title)}</h3>
        <p class="vcc-desc">${escapeHtml(v.description || '')}</p>
      </div>
    </div>
  `).join('');
}


function openVisitLightbox(url, title) {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  if (!lb || !lbImg) return;

  lbImg.src = url;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}



/* ---------- CAIXA DO TEMPO ---------- */
function renderCaixaTempo() {
  const grid = document.getElementById('caixaTempoGrid');
  if (!grid) return;

  let items = JSON.parse(localStorage.getItem('agr439-admin-caixa-tempo') || '[]');
  
  if (items.length === 0) {
    // Mock data for initial view
    items = [
      {
        id: 'mock1',
        year: '1985',
        title: 'Escuteiros 439 em destaque no jornal local',
        description: 'Reportagem sobre a atividade dos nossos pioneiros durante o acampamento de verão.',
        imageUrl: 'https://images.unsplash.com/photo-1585829365234-750ca8186175?auto=format&fit=crop&q=80&w=800',
        category: 'Imprensa'
      },
      {
        id: 'mock2',
        year: '1976',
        title: 'A primeira promessa do Agrupamento',
        description: 'Recorte histórico do jornal da paróquia assinalando as primeiras promessas do 439.',
        imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800',
        category: 'História'
      }
    ];
    localStorage.setItem('agr439-admin-caixa-tempo', JSON.stringify(items));
  }

  // Sort by year descending (approximate)
  items.sort((a, b) => b.year - a.year);

  grid.innerHTML = items.map(item => `
    <div class="archive-card reveal" data-item-id="${item.id}">
      <div class="archive-tag">${escapeHtml(item.category || 'Arquivo')}</div>
      <div class="archive-card-inner">
        <div class="archive-img-wrapper" onclick="openLightbox('${item.imageUrl}', '${escapeHtml(item.title)}')">
          <img src="${item.imageUrl}" class="archive-img" alt="${escapeHtml(item.title)}">
        </div>
        <span class="archive-year">${escapeHtml(item.year)}</span>
        <h3 class="archive-title">${escapeHtml(item.title)}</h3>
        <p class="archive-desc">${escapeHtml(item.description)}</p>
      </div>
    </div>
  `).join('');
}

/* ---------- CRONOLOGIA DINÂMICA E MODAL ---------- */
function initTimeline() {
  const stored = localStorage.getItem('agr439-admin-timeline');
  if (!stored || JSON.parse(stored).length === 0) {
    if (typeof INITIAL_TIMELINE !== 'undefined') {
      localStorage.setItem('agr439-admin-timeline', JSON.stringify(INITIAL_TIMELINE));
    }
  }
  renderTimelineList();
}

function renderTimelineList() {
  const grid = document.getElementById('timelineGrid');
  if (!grid) return;

  const timeline = JSON.parse(localStorage.getItem('agr439-admin-timeline') || '[]');
  
  // Parse numeric year for proper sorting
  timeline.sort((a, b) => {
     let yearA = parseInt(a.year) || 0;
     let yearB = parseInt(b.year) || 0;
     return yearA - yearB;
  });

  if (timeline.length === 0) {
    grid.innerHTML = '<p style="text-align:center; color: var(--text-muted); width: 100%;">A nossa história ainda está a ser escrita...</p>';
    return;
  }

  grid.innerHTML = timeline.map(item => `
    <div class="timeline-item reveal" ${item.items && item.items.length > 0 ? `onclick="openTimelineModal('${item.id}')" style="cursor: pointer;"` : ''}>
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <div class="timeline-year">${escapeHtml(item.year)}</div>
        <h3>${escapeHtml(item.title)}</h3>
        ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}
      </div>
    </div>
  `).join('');
}

function openTimelineModal(id) {
  const timeline = JSON.parse(localStorage.getItem('agr439-admin-timeline') || '[]');
  const data = timeline.find(t => t.id === id);
  if (!data) return;

  const modalBody = document.getElementById('timeline-modal-body');
  if (modalBody) {
    const items = data.items || [];
    
    let itemsHtml = items.map(item => {
      let mediaHtml = '';
      if (item.imageUrl) {
        mediaHtml += `<img src="${escapeHtml(item.imageUrl)}" style="width: 100%; max-height: 250px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;" alt="Imagem do Evento">`;
      }
      if (item.videoUrl) {
        const embedUrl = getYoutubeEmbedUrl(item.videoUrl);
        if (embedUrl) {
          mediaHtml += `
            <div style="position: relative; padding-bottom: 56.25%; height: 0; margin-bottom: 1rem;">
              <iframe src="${embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" allowfullscreen></iframe>
            </div>
          `;
        }
      }

      return `
        <div style="margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border-color);">
          <div style="display: flex; flex-direction: ${item.imageUrl || item.videoUrl ? 'column' : 'column'}; gap: 1.5rem;">
            ${mediaHtml ? `<div style="flex: 1;">${mediaHtml}</div>` : ''}
            <div style="flex: 1;">
              <h3 style="color: var(--c-primary); font-family: var(--f-heading); margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: baseline;">
                ${escapeHtml(item.title)}
                ${item.date ? `<span style="font-size: 0.85rem; color: var(--text-muted); font-weight: normal;">${escapeHtml(item.date)}</span>` : ''}
              </h3>
              ${item.description ? `<p style="font-weight: 500; font-size: 1.05rem; margin-bottom: 1rem;">${escapeHtml(item.description)}</p>` : ''}
              <div style="font-size: 1rem; color: var(--text-primary);">
                ${item.content || ''}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    modalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 2rem;">
        <span style="font-size: 1.2rem; font-weight: bold; color: var(--text-muted);">${escapeHtml(data.year)}</span>
        <h2 style="font-size: 2rem; color: var(--c-primary); font-family: var(--f-heading); margin-top: 0.2rem;">${escapeHtml(data.title)}</h2>
      </div>
      <div>
        ${itemsHtml.length > 0 ? itemsHtml : '<p style="text-align:center; color: var(--text-muted);">Sem detalhes disponíveis para este ano.</p>'}
      </div>
    `;
  }
  
  const modal = document.getElementById('timeline-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeTimelineModal() {
  const modal = document.getElementById('timeline-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
