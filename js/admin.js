/* ============================================================
   ADMIN PANEL — AGRUPAMENTO 439
   CRUD Logic · localStorage demo
   ============================================================ */

// ---------- AUTH ----------
const AUTH_CONFIG = {
  user: 'admin439',
  pass: 'escuteiros2025' // Moving to a config object; in production this should be handled by a real backend
};

function checkAuth() {
  return sessionStorage.getItem('agr439-admin-auth') === 'true';
}

function doLogin() {
  const user = document.getElementById('login-user').value;
  const pass = document.getElementById('login-pass').value;
  const errorEl = document.getElementById('login-error');

  if (user === AUTH_CONFIG.user && pass === AUTH_CONFIG.pass) {
    sessionStorage.setItem('agr439-admin-auth', 'true');
    showDashboard();
  } else {
    errorEl.style.display = 'block';
    errorEl.textContent = '❌ Credenciais incorretas.';
  }
}

function doLogout() {
  sessionStorage.removeItem('agr439-admin-auth');
  location.reload();
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  if (checkAuth()) {
    showDashboard();
    // Apenas sincroniza automaticamente se o storage estiver vazio ou se não houver configurações do GitHub
    cleanGhostGalleryItems();
    const gallery = getStore('agr439-admin-gallery');
    if (gallery.length === 0) {
      syncFromGitHub();
    }
    fixGalleryPaths();
  } else {
    showLogin();
  }

  // Theme
  const saved = localStorage.getItem('agr439-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
});

/**
 * Converte caminhos locais (assets/gallery/...) que não existem localmente
 * em URLs diretos do GitHub (raw.githubusercontent.com)
 */
function fixGalleryPaths() {
  const gallery = getStore('agr439-admin-gallery');
  const config = getGitHubConfig();
  if (!config.owner || !config.repo) return;
  
  let changed = false;
  const baseUrl = `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch || 'main'}/`;
  
  const updated = gallery.map(item => {
    // Se o URL começar com assets/gallery/, mudamos para o URL do GitHub
    if (item.url && item.url.startsWith('assets/gallery/')) {
      item.url = baseUrl + item.url;
      changed = true;
    }
    return item;
  });
  
  if (changed) {
    setStore('agr439-admin-gallery', updated);
  }
}

function showLogin() {
  document.getElementById('login-view').style.display = 'flex';
  document.getElementById('admin-view').style.display = 'none';
}

function showDashboard() {
  document.getElementById('login-view').style.display = 'none';
  document.getElementById('admin-view').style.display = 'flex';
  navigateTo('dashboard');
}

// ---------- NAVIGATION ----------
let currentSection = 'dashboard';

function navigateTo(section) {
  currentSection = section;

  // Update sidebar active
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  document.querySelector(`[data-section="${section}"]`)?.classList.add('active');

  // Render section
  const main = document.getElementById('admin-content');
  const headerTitle = document.getElementById('admin-title');

  switch (section) {
    case 'dashboard':
      headerTitle.innerHTML = '📊 <span>Dashboard</span>';
      renderDashboard(main);
      break;
    case 'news':
      headerTitle.innerHTML = '📰 <span>Notícias / Avisos</span>';
      renderNewsCRUD(main);
      break;
    case 'hero':
      headerTitle.innerHTML = '✨ <span>Página Inicial / Títulos</span>';
      renderHeroStatsEditor(main);
      break;
    case 'events':
      headerTitle.innerHTML = '📅 <span>Eventos / Calendário</span>';
      renderEventsCRUD(main);
      break;
    case 'timeline':
      headerTitle.innerHTML = '⌛ <span>Cronologia</span>';
      renderTimelineCRUD(main);
      break;
    case 'gallery':
      headerTitle.innerHTML = '🖼️ <span>Galeria</span>';
      renderGalleryCRUD(main);
      break;
    case 'songs':
      headerTitle.innerHTML = '🎵 <span>Cancioneiro</span>';
      renderSongsCRUD(main);
      break;
    case 'visits':
      headerTitle.innerHTML = '👥 <span>Visitantes</span>';
      renderVisitsCRUD(main);
      break;
    case 'caixatempo':
      headerTitle.innerHTML = '⌛ <span>Caixa do Tempo</span>';
      renderCaixaTempoCRUD(main);
      break;

    case 'recruitment':
      headerTitle.innerHTML = '📢 <span>Recrutamento</span>';
      renderRecruitmentCRUD(main);
      break;
    case 'newsletter':
      headerTitle.innerHTML = '📧 <span>Newsletter</span>';
      renderNewsletter(main);
      break;
    case 'messages':
      headerTitle.innerHTML = '💬 <span>Mensagens</span>';
      renderMessages(main);
      break;
    case 'settings':
      headerTitle.innerHTML = '⚙️ <span>Definições Admin</span>';
      renderSettings(main);
      break;
    case 'ai-settings':
      headerTitle.innerHTML = '🤖 <span>AI Engine & RAG</span>';
      renderAISettings(main);
      break;
    case 'publish':
      publishSiteData();
      break;
  }
}



// ---------- STORAGE HELPERS ----------
function getStore(key) {
  try {
    const val = localStorage.getItem(key);
    if (!val) return [];
    
    if (val.startsWith('{') || val.startsWith('[')) {
      return JSON.parse(val);
    }
    return val;
  } catch (e) {
    console.error(`Error parsing ${key}`, e);
    return [];
  }
}

function setStore(key, data) {
  localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// ---------- TOAST ----------
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ---------- DASHBOARD ----------
function renderDashboard(container) {
  const news = getStore('agr439-admin-news');
  const events = getStore('agr439-admin-events');
  const gallery = getStore('agr439-admin-gallery');
  const subs = getStore('agr439-newsletter');
  const msgs = getStore('agr439-messages');
  const archive = getStore('agr439-admin-caixa-tempo');

  container.innerHTML = `
    <div class="stats-row" style="grid-column: 1/-1; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 1rem;">
      <div style="background: rgba(var(--c-primary-rgb), 0.1); border-left: 4px solid var(--c-primary); padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
        <h4 style="color: var(--c-primary); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
          ⚠️ Nota Importante
        </h4>
        <p style="font-size: 0.9rem; line-height: 1.5;">
          As alterações que faz neste painel (notícias, eventos, etc.) são guardadas apenas no seu navegador. 
          Para que elas apareçam no site oficial para todos os visitantes, <strong>deve clicar no botão "Publicar Agora"</strong> abaixo.
        </p>
      </div>

      <section class="stat-card" style="flex: 1; min-width: 280px; border: 2px solid var(--c-primary);">
        <h4 style="margin-bottom: 0.5rem;">🚀 Publicação do Site</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
          Envia os dados atuais para o repositório GitHub para atualizar o site de produção.
        </p>
        <div style="display:flex; gap:0.75rem; flex-wrap: wrap;">
          <button id="btn-publish" class="btn btn-save" onclick="publishSiteData()">🚀 Publicar Agora</button>
          <button class="btn btn-outline" onclick="syncFromGitHub(true)">🔄 Sincronizar Dados</button>
        </div>
      </section>
    </div>

    <div class="stats-row" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; width: 100%;">
      <div class="stat-card">
        <div class="stat-icon">📰</div>
        <div class="stat-value">${news.length}</div>
        <div class="stat-name">Notícias</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-value">${events.length}</div>
        <div class="stat-name">Eventos</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🖼️</div>
        <div class="stat-value">${gallery.length}</div>
        <div class="stat-name">Fotos</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📧</div>
        <div class="stat-value">${subs.length}</div>
        <div class="stat-name">Subscritores</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💬</div>
        <div class="stat-value">${msgs.length}</div>
        <div class="stat-name">Mensagens</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⌛</div>
        <div class="stat-value">${archive.length}</div>
        <div class="stat-name">Caixa do Tempo</div>
      </div>
    </div>

    <section class="admin-table-container" style="margin-top: 2rem;">
      <div class="admin-table-header">
        <h3>📋 Últimas Mensagens</h3>
      </div>
      <div style="overflow-x: auto;">
        ${msgs.length === 0 ? '<div class="empty-state"><div class="icon">📭</div><p>Sem mensagens recebidas.</p></div>' : `
          <table class="admin-table">
            <thead>
              <tr><th>Nome</th><th>Email</th><th>Mensagem</th><th>Data</th></tr>
            </thead>
            <tbody>
              ${msgs.slice(-5).reverse().map(m => `
                <tr>
                  <td>${esc(m.name)}</td>
                  <td>${esc(m.email)}</td>
                  <td>${esc(m.message?.substring(0, 60))}${m.message?.length > 60 ? '…' : ''}</td>
                  <td>${new Date(m.date).toLocaleDateString('pt-PT')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `}
      </div>
    </section>
  `;
}

// ---------- NEWS CRUD ----------
function renderNewsCRUD(container) {
  const news = getStore('agr439-admin-news');

  container.innerHTML = `
    <div class="admin-table-container">
      <div class="admin-table-header">
        <h3>Notícias (${news.length})</h3>
        <button class="btn btn-primary btn-sm" onclick="openNewsModal()">+ Nova Notícia</button>
      </div>
      ${news.length === 0 ? '<div class="empty-state"><div class="icon">📰</div><p>Nenhuma notícia criada.</p><button class="btn btn-primary btn-sm" onclick="openNewsModal()">Criar Primeira Notícia</button></div>' : `
        <table class="admin-table">
          <thead>
            <tr><th>Título</th><th>Tag</th><th>Status</th><th>Data</th><th>Ações</th></tr>
          </thead>
          <tbody>
            ${news.map(n => `
              <tr>
                <td><strong>${esc(n.title)}</strong></td>
                <td><span class="news-card-tag tag-${n.tag}">${n.tag}</span></td>
                <td><span class="status-badge ${n.published ? 'status-published' : 'status-draft'}">${n.published ? 'Publicado' : 'Rascunho'}</span></td>
                <td>${new Date(n.date).toLocaleDateString('pt-PT')}</td>
                <td>
                  <button class="action-btn edit" onclick="openNewsModal('${n.id}')" title="Editar">✏️</button>
                  <button class="action-btn delete" onclick="deleteNews('${n.id}')" title="Apagar">🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;
}

function openNewsModal(id) {
  const news = getStore('agr439-admin-news');
  const item = id ? news.find(n => n.id === id) : null;

  showModal(`
    <h3>${item ? '✏️ Editar Notícia' : '📰 Nova Notícia'}</h3>
    <div class="form-group">
      <label>Título</label>
      <input type="text" id="m-news-title" value="${item ? esc(item.title) : ''}">
    </div>
    <div class="form-group">
      <label>Conteúdo</label>
      <textarea id="m-news-content" rows="4">${item ? esc(item.content) : ''}</textarea>
    </div>
    <div class="form-group">
      <label>Tag</label>
      <select id="m-news-tag">
        <option value="geral" ${item?.tag === 'geral' ? 'selected' : ''}>Geral</option>
        <option value="lobitos" ${item?.tag === 'lobitos' ? 'selected' : ''}>Lobitos</option>
        <option value="exploradores" ${item?.tag === 'exploradores' ? 'selected' : ''}>Exploradores</option>
        <option value="pioneiros" ${item?.tag === 'pioneiros' ? 'selected' : ''}>Pioneiros</option>
        <option value="caminheiros" ${item?.tag === 'caminheiros' ? 'selected' : ''}>Caminheiros</option>
      </select>
    </div>
    <div class="form-group">
      <label>Imagem da Notícia</label>
      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <input type="text" id="m-news-img" value="${item ? esc(item.imageUrl || '') : ''}" placeholder="https://..." style="flex: 1;">
        <button class="btn btn-outline btn-sm" onclick="openImagePicker(url => document.getElementById('m-news-img').value = url, 'geral')">🖼️ Escolher</button>
      </div>
      <small style="color: var(--text-muted); font-size: 0.75rem;">Link da imagem ou escolha da galeria.</small>
    </div>
    <div class="form-group">
      <label><input type="checkbox" id="m-news-published" ${item?.published ? 'checked' : ''}> Publicar</label>
    </div>
    <div class="modal-actions" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <button class="btn btn-outline btn-sm" onclick="helpWriteNews()" style="margin-right: auto;">🤖 Ajudar a escrever (AI)</button>
      <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
      <button class="btn-save" onclick="saveNews('${id || ''}')">Guardar</button>
    </div>

  `);
}

function saveNews(id) {
  const news = getStore('agr439-admin-news');
  const data = {
    id: id || generateId(),
    title: document.getElementById('m-news-title').value,
    content: document.getElementById('m-news-content').value,
    tag: document.getElementById('m-news-tag').value,
    published: document.getElementById('m-news-published').checked,
    imageUrl: document.getElementById('m-news-img').value,
    date: new Date().toISOString(),
  };


  if (id) {
    const idx = news.findIndex(n => n.id === id);
    if (idx >= 0) news[idx] = { ...news[idx], ...data };
  } else {
    news.push(data);
  }

  console.log('DEBUG: Salvando notícias no storage...', news);
  setStore('agr439-admin-news', news);
  closeModal();
  showToast('✅ Notícia guardada!');
  renderNewsCRUD(document.getElementById('admin-content'));
}

function deleteNews(id) {
  console.log('DEBUG: deleteNews called with ID:', id);
  const news = getStore('agr439-admin-news').filter(n => String(n.id) !== String(id));
  setStore('agr439-admin-news', news);
  showToast('🗑️ Notícia apagada.');
  renderNewsCRUD(document.getElementById('admin-content'));
}

// ---------- EVENTS CRUD ----------
function renderEventsCRUD(container) {
  const events = getStore('agr439-admin-events');

  container.innerHTML = `
    <div class="admin-table-container">
      <div class="admin-table-header">
        <h3>Eventos (${events.length})</h3>
        <button class="btn btn-primary btn-sm" onclick="openEventModal()">+ Novo Evento</button>
      </div>
      ${events.length === 0 ? '<div class="empty-state"><div class="icon">📅</div><p>Nenhum evento criado.</p><button class="btn btn-primary btn-sm" onclick="openEventModal()">Criar Primeiro Evento</button></div>' : `
        <table class="admin-table">
          <thead>
            <tr><th>Evento</th><th>Data</th><th>Local</th><th>Ações</th></tr>
          </thead>
          <tbody>
            ${events.map(e => `
              <tr>
                <td><strong>${esc(e.title)}</strong></td>
                <td>${esc(e.date)}</td>
                <td>${esc(e.location)}</td>
                <td>
                  <button class="action-btn edit" onclick="openEventModal('${e.id}')" title="Editar">✏️</button>
                  <button class="action-btn delete" onclick="deleteEvent('${e.id}')" title="Apagar">🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;
}

function openEventModal(id) {
  const events = getStore('agr439-admin-events');
  const gallery = getStore('agr439-admin-gallery');
  const item = id ? events.find(e => e.id === id) : null;
  const eventGalleryIds = item?.galleryIds || [];

  let galleryHtml = gallery.length > 0 ? gallery.map(g => `
    <label style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem; cursor:pointer;">
      <input type="checkbox" class="m-event-gallery-cb" value="${g.id}" ${eventGalleryIds.includes(g.id) ? 'checked' : ''}>
      <img src="${g.url}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;">
      <span>${esc(g.description)}</span>
    </label>
  `).join('') : '<p style="font-size:0.85rem; color:var(--text-muted);">A Galeria está vazia.</p>';

  showModal(`
    <h3>${item ? '✏️ Editar Evento' : '📅 Novo Evento'}</h3>
    <div class="form-group">
      <label>Título</label>
      <input type="text" id="m-event-title" value="${item ? esc(item.title) : ''}">
    </div>
    <div class="form-group">
      <label>Data e Hora</label>
      <input type="datetime-local" id="m-event-date" value="${item ? item.date : ''}">
    </div>
    <div class="form-group">
      <label>Local</label>
      <input type="text" id="m-event-location" value="${item ? esc(item.location) : ''}">
    </div>
    <div class="form-group">
      <label>Descrição</label>
      <textarea id="m-event-desc" rows="3">${item ? esc(item.description) : ''}</textarea>
    </div>
    <div class="form-group">
      <label>Fotos Associadas</label>
      <div style="max-height: 150px; overflow-y: auto; background: var(--bg-card); border: 1px solid var(--border-color); padding: 0.5rem; border-radius: 4px;" id="m-event-selected-pics">
        ${galleryHtml}
      </div>
      <button class="btn btn-outline btn-sm" style="margin-top: 0.5rem; width: 100%;" onclick="openEventImagePicker()">+ Adicionar Fotos da Galeria</button>
    </div>

    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
      <button class="btn-save" onclick="saveEvent('${id || ''}')">Guardar</button>
    </div>
  `);
}

function saveEvent(id) {
  const events = getStore('agr439-admin-events');
  const checkboxes = document.querySelectorAll('.m-event-gallery-cb:checked');
  const galleryIds = Array.from(checkboxes).map(cb => cb.value);

  const data = {
    id: id || generateId(),
    title: document.getElementById('m-event-title').value,
    date: document.getElementById('m-event-date').value,
    location: document.getElementById('m-event-location').value,
    description: document.getElementById('m-event-desc').value,
    galleryIds: galleryIds,
  };

  if (id) {
    const idx = events.findIndex(e => e.id === id);
    if (idx >= 0) events[idx] = { ...events[idx], ...data };
  } else {
    events.push(data);
  }

  setStore('agr439-admin-events', events);
  closeModal();
  showToast('✅ Evento guardado!');
  renderEventsCRUD(document.getElementById('admin-content'));
}

function deleteEvent(id) {
  console.log('DEBUG: deleteEvent called with ID:', id);
  const events = getStore('agr439-admin-events').filter(e => String(e.id) !== String(id));
  setStore('agr439-admin-events', events);
  showToast('🗑️ Evento apagado.');
  renderEventsCRUD(document.getElementById('admin-content'));
}

// ---------- TIMELINE CRUD ----------
function renderTimelineCRUD(container) {
  if (getStore('agr439-admin-timeline').length === 0 && typeof INITIAL_TIMELINE !== 'undefined') {
    setStore('agr439-admin-timeline', INITIAL_TIMELINE);
  }

  const timeline = getStore('agr439-admin-timeline');
  
  timeline.sort((a, b) => {
     let yearA = parseInt(a.year) || 0;
     let yearB = parseInt(b.year) || 0;
     return yearA - yearB;
  });

  const main = container || document.getElementById('admin-content');
  main.innerHTML = `
    <div class="admin-table-container">
      <div class="admin-table-header">
        <h3>Marcos da Cronologia (${timeline.length})</h3>
        <button class="btn btn-primary btn-sm" onclick="openTimelineMilestoneModal()">+ Novo Ano / Marco</button>
      </div>
      ${timeline.length === 0 ? '<div class="empty-state"><div class="icon">⌛</div><p>Sem marcos históricos.</p></div>' : `
        <table class="admin-table">
          <thead>
            <tr><th>Ano</th><th>Título Principal</th><th>Nº de Itens</th><th>Ações</th></tr>
          </thead>
          <tbody>
            ${timeline.map(t => {
              const itemsCount = t.items ? t.items.length : 0;
              return `
                <tr>
                  <td><strong>${esc(t.year)}</strong></td>
                  <td>${esc(t.title)}</td>
                  <td><span class="status-badge status-published">${itemsCount} Itens</span></td>
                  <td>
                    <button class="action-btn-open" onclick="renderTimelineItemsCRUD('${t.id}')" title="Gerir Sub-itens deste ano">📂 Abrir Itens</button>
                    <button class="action-btn edit" onclick="openTimelineMilestoneModal('${t.id}')" title="Editar Ano">✏️</button>
                    <button class="action-btn delete" onclick="deleteTimelineMilestone('${t.id}')" title="Apagar Ano e os seus itens">🗑️</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;
}

function openTimelineMilestoneModal(id) {
  const timeline = getStore('agr439-admin-timeline');
  const item = id ? timeline.find(t => t.id === id) : null;

  showModal(`
    <h3>${item ? '✏️ Editar Ano' : '⌛ Novo Ano / Marco'}</h3>
    <div class="form-group">
      <label>Ano na linha do tempo</label>
      <input type="text" id="m-tlm-year" value="${item ? esc(item.year) : ''}" placeholder="Ex: 1975">
    </div>
    <div class="form-group">
      <label>Título Principal do Cartão</label>
      <input type="text" id="m-tlm-title" value="${item ? esc(item.title) : ''}" placeholder="Ex: Fundação do Agrupamento">
    </div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
      <button class="btn-save" onclick="saveTimelineMilestone('${id || ''}')">Guardar</button>
    </div>
  `);
}

function saveTimelineMilestone(id) {
  const timeline = getStore('agr439-admin-timeline');
  const data = {
    id: id || generateId(),
    year: document.getElementById('m-tlm-year').value,
    title: document.getElementById('m-tlm-title').value,
    items: [] // sub-items will be preserved if editing
  };

  if (id) {
    const idx = timeline.findIndex(t => t.id === id);
    if (idx >= 0) {
      data.items = timeline[idx].items || [];
      timeline[idx] = data;
    }
  } else {
    timeline.push(data);
  }

  setStore('agr439-admin-timeline', timeline);
  closeModal();
  showToast('✅ Ano guardado!');
  renderTimelineCRUD();
}

function deleteTimelineMilestone(id) {
  if (!confirm('Apagar este marco da cronologia?')) return;
  const timeline = getStore('agr439-admin-timeline').filter(m => String(m.id) !== String(id));
  setStore('agr439-admin-timeline', timeline);
  showToast('🗑️ Marco apagado.');
  renderTimelineCRUD(document.getElementById('admin-content'));
}

// --- SUB-ITEMS CRUD ---
function renderTimelineItemsCRUD(milestoneId) {
  const timeline = getStore('agr439-admin-timeline');
  const milestone = timeline.find(t => t.id === milestoneId);
  if (!milestone) return;

  const items = milestone.items || [];
  const main = document.getElementById('admin-content');
  
  main.innerHTML = `
    <div class="admin-table-container">
      <div class="admin-table-header">
        <div>
          <button class="btn btn-outline btn-sm" onclick="renderTimelineCRUD()" style="margin-bottom: 0.5rem; display: inline-flex; align-items: center; gap: 0.5rem;">← Voltar</button>
          <h3 style="margin: 0;">Itens do Ano ${esc(milestone.year)}</h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">${esc(milestone.title)}</p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="openTimelineItemModal('${milestoneId}')">+ Novo Bloco de Informação</button>
      </div>
      
      ${items.length === 0 ? '<div class="empty-state"><p>Sem informações adicionadas a este marco histórico.</p></div>' : `
        <table class="admin-table">
          <thead>
            <tr><th>Data</th><th>Título do Grupo</th><th>Tem Imagem?</th><th>Tem Vídeo?</th><th>Ações</th></tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td><strong>${esc(item.date || '')}</strong></td>
                <td>${esc(item.title)}</td>
                <td>${item.imageUrl ? '✅' : '❌'}</td>
                <td>${item.videoUrl ? '✅' : '❌'}</td>
                <td>
                  <button class="action-btn edit" onclick="openTimelineItemModal('${milestoneId}', '${item.id}')" title="Editar Bloco">✏️</button>
                  <button class="action-btn delete" onclick="deleteTimelineItem('${milestoneId}', '${item.id}')" title="Apagar Bloco">🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;
}

function openTimelineItemModal(milestoneId, itemId) {
  const timeline = getStore('agr439-admin-timeline');
  const milestone = timeline.find(t => t.id === milestoneId);
  if (!milestone) return;

  const item = itemId ? (milestone.items || []).find(i => i.id === itemId) : null;

  showModal(`
    <h3>${item ? '✏️ Editar Bloco de Informação' : '⌛ Novo Bloco de Informação'}</h3>
    <div class="form-group">
      <label>Título Secundário</label>
      <input type="text" id="m-tli-title" value="${item ? esc(item.title) : ''}" placeholder="Ex: 1º promessas">
    </div>
    <div class="form-group">
      <label>Data Localizada</label>
      <input type="text" id="m-tli-date" value="${item ? esc(item.date || item.year) : ''}" placeholder="Ex: 22 de Junho de 1975">
    </div>
    <div class="form-group">
      <label>Descrição Breve</label>
      <textarea id="m-tli-desc" rows="2" placeholder="Resumo a aparecer na lista...">${item ? esc(item.description || '') : ''}</textarea>
    </div>
    <div class="form-group">
      <label>Conteúdo Completo (HTML/Texto)</label>
      <textarea id="m-tli-content" rows="4">${item ? esc(item.content || '') : ''}</textarea>
    </div>
    <div class="form-group">
      <label>Imagem (Opcional)</label>
      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <input type="text" id="m-tli-img" value="${item ? esc(item.imageUrl || '') : ''}" placeholder="https://..." style="flex: 1;">
        <button class="btn btn-outline btn-sm" onclick="openImagePicker(url => document.getElementById('m-tli-img').value = url, 'timeline')">🖼️ Escolher</button>
      </div>
    </div>
    <div class="form-group">
      <label>Vídeo YouTube (Opcional)</label>
      <input type="url" id="m-tli-video" value="${item ? esc(item.videoUrl || '') : ''}" placeholder="https://www.youtube.com/watch?v=...">
    </div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
      <button class="btn-save" onclick="saveTimelineItem('${milestoneId}', '${itemId || ''}')">Guardar Objeto</button>
    </div>
  `);
}

function saveTimelineItem(milestoneId, itemId) {
  const timeline = getStore('agr439-admin-timeline');
  const mIndex = timeline.findIndex(t => t.id === milestoneId);
  if (mIndex === -1) return;

  const items = timeline[mIndex].items || [];
  
  const data = {
    id: itemId || generateId(),
    title: document.getElementById('m-tli-title').value,
    date: document.getElementById('m-tli-date').value,
    description: document.getElementById('m-tli-desc').value,
    content: document.getElementById('m-tli-content').value,
    imageUrl: document.getElementById('m-tli-img').value,
    videoUrl: document.getElementById('m-tli-video').value,
  };

  if (itemId) {
    const iIndex = items.findIndex(i => i.id === itemId);
    if (iIndex >= 0) items[iIndex] = data;
  } else {
    items.push(data);
  }

  timeline[mIndex].items = items;
  setStore('agr439-admin-timeline', timeline);
  closeModal();
  showToast('✅ Bloco de informação guardado!');
  renderTimelineItemsCRUD(milestoneId);
}

function deleteTimelineItem(milestoneId, itemId) {
  if (!confirm('Apagar este bloco de informação?')) return;
  const timeline = getStore('agr439-admin-timeline');
  const mIndex = timeline.findIndex(t => t.id === milestoneId);
  if (mIndex === -1) return;
  
  timeline[mIndex].items = (timeline[mIndex].items || []).filter(i => i.id !== itemId);
  setStore('agr439-admin-timeline', timeline);
  showToast('🗑️ Bloco de informação apagado.');
  renderTimelineItemsCRUD(milestoneId);
}


// ---------- GALLERY CRUD ----------
let galleryFilterCat = 'all';
let gallerySortCol = 'description';
let gallerySortDir = 'asc';

function renderGalleryCRUD(container) {
  let gallery = getStore('agr439-admin-gallery');
  const allCats = [...new Set(gallery.map(g => g.category))];

  // Aplicar Filtro
  if (galleryFilterCat !== 'all') {
    gallery = gallery.filter(g => g.category === galleryFilterCat);
  }

  // Aplicar Ordenação
  gallery.sort((a, b) => {
    let valA = (gallerySortCol === 'category' ? getCatLabel(a.category) : a[gallerySortCol]).toLowerCase();
    let valB = (gallerySortCol === 'category' ? getCatLabel(b.category) : b[gallerySortCol]).toLowerCase();
    
    if (valA < valB) return gallerySortDir === 'asc' ? -1 : 1;
    if (valA > valB) return gallerySortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const sortIcon = (col) => {
    if (gallerySortCol !== col) return '↕️';
    return gallerySortDir === 'asc' ? '🔼' : '🔽';
  };

  container.innerHTML = `
    <div class="admin-table-container">
      <div class="admin-table-header">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <h3>Galeria (${gallery.length})</h3>
          <select class="admin-filter-select" onchange="setGalleryFilter(this.value)">
            <option value="all" ${galleryFilterCat === 'all' ? 'selected' : ''}>Todas as Categorias</option>
            ${allCats.sort().map(cat => `
              <option value="${cat}" ${galleryFilterCat === cat ? 'selected' : ''}>${getCatLabel(cat)}</option>
            `).join('')}
          </select>
        </div>
        <button class="btn btn-primary btn-sm" onclick="openGalleryModal()">+ Adicionar Foto</button>
      </div>
      ${gallery.length === 0 ? '<div class="empty-state"><div class="icon">🖼️</div><p>Nenhuma foto encontrada com os filtros atuais.</p><button class="btn btn-primary btn-sm" onclick="openGalleryModal()">Adicionar Foto</button></div>' : `
        <div class="info-alert" style="margin-bottom: 1rem; font-size: 0.85rem; border-left: 4px solid var(--accent); background: rgba(var(--accent-rgb), 0.1); padding: 0.8rem; border-radius: 4px;">
          <strong>💡 Dica de Sincronização:</strong> Fotos com URL <code>assets/...</code> são locais. Use o botão <strong>Upload</strong> ao editar para enviá-las ao GitHub e garantir que apareçam no site publicado.
        </div>
        <table class="admin-table">
          <thead>
            <tr>
              <th class="sortable" onclick="setGallerySort('description')">Descrição ${sortIcon('description')}</th>
              <th class="sortable" onclick="setGallerySort('category')">Categoria ${sortIcon('category')}</th>
              <th>Localização</th>
              <th>Estado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            ${gallery.map(g => {
              const isRemote = g.url && g.url.startsWith('http');
              return `
              <tr>
                <td>${esc(g.description)}</td>
                <td>${esc(getCatLabel(g.category))}</td>
                <td>
                  <span style="font-size: 0.8rem; padding: 2px 6px; border-radius: 3px; background: ${isRemote ? '#dcfce7' : '#fee2e2'}; color: ${isRemote ? '#166534' : '#991b1b'};">
                    ${isRemote ? '🌐 GitHub' : '💻 Local'}
                  </span>
                </td>
                <td><span class="status-badge ${g.approved ? 'status-published' : 'status-draft'}">${g.approved ? 'Aprovada' : 'Pendente'}</span></td>
                <td>
                  <button class="action-btn edit" onclick="openGalleryModal('${g.id}')" title="Editar">✏️</button>
                  <button class="action-btn edit" onclick="toggleGalleryApproval('${g.id}')" title="${g.approved ? 'Desaprovar' : 'Aprovar'}">${g.approved ? '❌' : '✅'}</button>
                  <button class="action-btn delete" onclick="deleteGalleryItem('${g.id}')" title="Apagar">🗑️</button>
                </td>
              </tr>
            `;}).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;
}

function setGalleryFilter(cat) {
  galleryFilterCat = cat;
  renderGalleryCRUD(document.getElementById('admin-content'));
}

function setGallerySort(col) {
  if (gallerySortCol === col) {
    gallerySortDir = gallerySortDir === 'asc' ? 'desc' : 'asc';
  } else {
    gallerySortCol = col;
    gallerySortDir = 'asc';
  }
  renderGalleryCRUD(document.getElementById('admin-content'));
}


function openGalleryModal(id) {
  const gallery = getStore('agr439-admin-gallery');
  const item = id ? gallery.find(g => g.id === id) : null;

  showModal(`
    <h3>${item ? '✏️ Editar Foto' : '🖼️ Adicionar Foto'}</h3>
    <div class="form-group">
      <label>Descrição</label>
      <input type="text" id="m-gallery-desc" value="${item ? esc(item.description) : ''}">
    </div>
    <div class="form-group">
      <label>Categoria</label>
      <select id="m-gallery-cat">
        <option value="hero" ${item?.category === 'hero' ? 'selected' : ''}>Página Inicial / Títulos</option>
        <option value="timeline" ${item?.category === 'timeline' ? 'selected' : ''}>Cronologia</option>
        <option value="geral" ${item?.category === 'geral' ? 'selected' : ''}>Notícia / Aviso</option>
        <option value="lobitos" ${item?.category === 'lobitos' ? 'selected' : ''}>Lobitos</option>
        <option value="exploradores" ${item?.category === 'exploradores' ? 'selected' : ''}>Exploradores</option>
        <option value="pioneiros" ${item?.category === 'pioneiros' ? 'selected' : ''}>Pioneiros</option>
        <option value="caminheiros" ${item?.category === 'caminheiros' ? 'selected' : ''}>Caminheiros</option>
        <option value="acampamento" ${item?.category === 'acampamento' ? 'selected' : ''}>Acampamento</option>
        <option value="evento" ${item?.category === 'evento' ? 'selected' : ''}>Evento</option>
        <option value="recrutamento" ${item?.category === 'recrutamento' ? 'selected' : ''}>Recrutamento</option>
        <option value="cancioneiro" ${item?.category === 'cancioneiro' ? 'selected' : ''}>Cancioneiro</option>
        <option value="visitantes" ${item?.category === 'visitantes' ? 'selected' : ''}>Visitantes / Postais</option>
        <option value="caixatempo" ${item?.category === 'caixatempo' ? 'selected' : ''}>Caixa do Tempo (Arquivo)</option>
      </select>
    </div>
    <div class="form-group">
      <label>Opção 1: Upload de Ficheiro (Substitui existente)</label>
      <input type="file" id="m-gallery-file" accept="image/*">
      <small style="color: var(--text-muted); font-size: 0.75rem;">A foto será enviada para o seu GitHub.</small>
    </div>
    <div style="text-align: center; margin: 1rem 0; color: var(--text-muted); font-size: 0.8rem;">— OU —</div>
    <div class="form-group">
      <label>Opção 2: URL da Imagem (Externo)</label>
      <input type="url" id="m-gallery-url" placeholder="https://..." value="${item ? esc(item.url) : ''}">
    </div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
      <button class="btn-save" id="btn-save-gallery" onclick="saveGalleryItem('${id || ''}')">Guardar</button>
    </div>

  `);
}

async function saveGalleryItem(id) {
  const fileInput = document.getElementById('m-gallery-file');
  const urlInput = document.getElementById('m-gallery-url');
  const desc = document.getElementById('m-gallery-desc').value;
  const cat = document.getElementById('m-gallery-cat').value;
  const btn = document.getElementById('btn-save-gallery');

  const gallery = getStore('agr439-admin-gallery');
  let itemIndex = -1;
  if (id) {
    itemIndex = gallery.findIndex(g => g.id === id);
  }

  let finalUrl = urlInput.value;

  // If a file is selected, upload to GitHub first
  if (fileInput.files.length > 0) {
    btn.disabled = true;
    btn.textContent = 'A carregar...';
    try {
      const result = await uploadToGitHub(fileInput.files[0]);
      finalUrl = result.githubUrl; // Utilizar o URL direto do GitHub para visibilidade imediata
      showToast('🚀 Imagem enviada para o GitHub!');
    } catch (err) {
      console.error('Upload error:', err);
      showToast('❌ Erro no upload: ' + err.message + '\n\nVerifique se o Token do GitHub está configurado corretamente nas Definições.');
      btn.disabled = false;
      btn.textContent = 'Guardar';
      return;
    }
  }

  if (!finalUrl) {
    showToast('Por favor, selecione um ficheiro ou insira um URL.');
    return;
  }

  if (itemIndex >= 0) {
    gallery[itemIndex].description = desc;
    gallery[itemIndex].category = cat;
    gallery[itemIndex].url = finalUrl;
  } else {
    gallery.push({
      id: generateId(),
      description: desc,
      category: cat,
      url: finalUrl,
      approved: true,
      date: new Date().toISOString(),
    });
  }
  
  setStore('agr439-admin-gallery', gallery);
  closeModal();
  renderGalleryCRUD(document.getElementById('admin-content'));
}


function toggleGalleryApproval(id) {
  const gallery = getStore('agr439-admin-gallery');
  const item = gallery.find(g => g.id === id);
  if (item) item.approved = !item.approved;
  setStore('agr439-admin-gallery', gallery);
  showToast(item.approved ? '✅ Foto aprovada!' : '❌ Foto desaprovada.');
  renderGalleryCRUD(document.getElementById('admin-content'));
}

function deleteGalleryItem(id) {
  // Removido confirm temporariamente para debugar se o browser o está a bloquear
  console.log('DEBUG: Tentando apagar item:', id);
  
  const gallery = getStore('agr439-admin-gallery');
  const newGallery = gallery.filter(g => String(g.id) !== String(id));
  
  if (newGallery.length === gallery.length) {
    showToast('Erro: Item não encontrado para eliminar (ID: ' + id + ');');
    return;
  }
  
  setStore('agr439-admin-gallery', newGallery);
  showToast('🗑️ Foto apagada.');
  renderGalleryCRUD(document.getElementById('admin-content'));
}

// ---------- DELETED DUE TO DUPLICATION (MOVED TO BOTTOM FOR NEW PAGES CRUD) ----------
// ---------- NEWSLETTER ----------
function renderNewsletter(container) {
  const subs = getStore('agr439-newsletter');

  container.innerHTML = `
    <div class="admin-table-container">
      <div class="admin-table-header">
        <h3>Subscritores (${subs.length})</h3>
      </div>
      ${subs.length === 0 ? '<div class="empty-state"><div class="icon">📧</div><p>Nenhum subscritor ainda.</p></div>' : `
        <table class="admin-table">
          <thead>
            <tr><th>Email</th><th>Data</th></tr>
          </thead>
          <tbody>
            ${subs.map(s => `
              <tr>
                <td>${esc(s.email)}</td>
                <td>${new Date(s.date).toLocaleDateString('pt-PT')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;
}

// ---------- MESSAGES ----------
function renderMessages(container) {
  const msgs = getStore('agr439-messages');

  container.innerHTML = `
    <div class="admin-table-container">
      <div class="admin-table-header">
        <h3>Mensagens (${msgs.length})</h3>
      </div>
      ${msgs.length === 0 ? '<div class="empty-state"><div class="icon">💬</div><p>Sem mensagens recebidas.</p></div>' : `
        <table class="admin-table">
          <thead>
            <tr><th>Nome</th><th>Email</th><th>Mensagem</th><th>Data</th></tr>
          </thead>
          <tbody>
            ${msgs.map(m => `
              <tr>
                <td><strong>${esc(m.name)}</strong></td>
                <td>${esc(m.email)}</td>
                <td>${esc(m.message)}</td>
                <td>${new Date(m.date).toLocaleDateString('pt-PT')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;
}

// ---------- SONGS CRUD ----------
function renderSongsCRUD(container) {
  // Sync if empty
  if (getStore('agr439-admin-songs').length === 0 && typeof INITIAL_SONGS !== 'undefined') {
    setStore('agr439-admin-songs', INITIAL_SONGS);
  }

  const songs = getStore('agr439-admin-songs');
  songs.sort((a, b) => a.title.localeCompare(b.title));

  container.innerHTML = `
    <div class="admin-table-container">
      <div class="admin-table-header">
        <h3>Músicas (${songs.length})</h3>
        <button class="btn btn-primary btn-sm" onclick="openSongModalCRUD()">+ Nova Música</button>
      </div>
      ${songs.length === 0 ? '<div class="empty-state"><div class="icon">🎵</div><p>Nenhuma música no cancioneiro.</p><button class="btn btn-primary btn-sm" onclick="openSongModalCRUD()">Criar Primeira Música</button></div>' : `
        <table class="admin-table">
          <thead>
            <tr><th>Título</th><th>Subtítulo</th><th>Vídeo</th><th>Ações</th></tr>
          </thead>
          <tbody>
            ${songs.map(s => `
              <tr>
                <td><strong>${esc(s.title)}</strong></td>
                <td>${esc(s.subtitle)}</td>
                <td>${s.videoUrl ? '✅' : '❌'}</td>
                <td>
                  <button class="action-btn edit" onclick="openSongModalCRUD('${s.id}')" title="Editar">✏️</button>
                  <button class="action-btn delete" onclick="deleteSong('${s.id}')" title="Apagar">🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;
}

function openSongModalCRUD(id) {
  const songs = getStore('agr439-admin-songs');
  const song = id ? songs.find(s => s.id === id) : null;

  showModal(`
    <h3>${song ? '✏️ Editar Música' : '🎵 Nova Música'}</h3>
    <div class="form-group">
      <label>Título</label>
      <input type="text" id="m-song-title" value="${song ? esc(song.title) : ''}">
    </div>
    <div class="form-group">
      <label>Subtítulo (Opcional)</label>
      <input type="text" id="m-song-subtitle" value="${song ? esc(song.subtitle) : ''}">
    </div>
    <div class="form-group">
      <label>Letra</label>
      <textarea id="m-song-lyrics" rows="10">${song ? esc(song.lyrics) : ''}</textarea>
    </div>
    <div class="form-group">
      <label>Cifras (Opcional)</label>
      <textarea id="m-song-chords" rows="4">${song ? esc(song.chords) : ''}</textarea>
    </div>
    <div class="form-group">
      <label>Link do Vídeo YouTube (Opcional)</label>
      <input type="url" id="m-song-video" value="${song ? esc(song.videoUrl) : ''}" placeholder="https://www.youtube.com/watch?v=...">
    </div>
    <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
      <input type="checkbox" id="m-song-audio-only" ${song && song.audioOnly ? 'checked' : ''} style="width: auto; margin: 0;">
      <label for="m-song-audio-only" style="margin: 0; cursor: pointer; text-align: left; display: inline; font-size: 0.9rem;">Mostrar apenas controlos de áudio (esconder imagem do vídeo)</label>
    </div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
      <button class="btn-save" onclick="saveSong('${id || ''}')">Guardar</button>
    </div>
  `);
}

function saveSong(id) {
  const songs = getStore('agr439-admin-songs');
  const data = {
    id: id || generateId(),
    title: document.getElementById('m-song-title').value,
    subtitle: document.getElementById('m-song-subtitle').value,
    lyrics: document.getElementById('m-song-lyrics').value,
    chords: document.getElementById('m-song-chords').value,
    videoUrl: document.getElementById('m-song-video').value,
    audioOnly: document.getElementById('m-song-audio-only').checked
  };

  if (id) {
    const idx = songs.findIndex(s => s.id === id);
    if (idx >= 0) songs[idx] = data;
  } else {
    songs.push(data);
  }

  setStore('agr439-admin-songs', songs);
  closeModal();
  showToast('✅ Música guardada!');
  renderSongsCRUD(document.getElementById('admin-content'));
}

function deleteSong(id) {
  if (!confirm('Apagar este cântico?')) return;
  const songs = getStore('agr439-admin-songs').filter(s => String(s.id) !== String(id));
  setStore('agr439-admin-songs', songs);
  showToast('🗑️ Cântico apagado.');
  renderSongsCRUD(document.getElementById('admin-content'));
}

// ---------- VISITS CRUD ----------
function renderVisitsCRUD(container) {
  // Sync if empty
  if (getStore('agr439-admin-visits').length === 0 && typeof INITIAL_VISITS !== 'undefined') {
    setStore('agr439-admin-visits', INITIAL_VISITS);
  }

  const visits = getStore('agr439-admin-visits');
  // Optional: Sort by whatever field is relevant
  
  container.innerHTML = `
    <div class="admin-table-container">
      <div class="admin-table-header">
        <h3>Visitas (${visits.length})</h3>
        <button class="btn btn-primary btn-sm" onclick="openVisitModalCRUD()">+ Nova Visita</button>
      </div>
      ${visits.length === 0 ? '<div class="empty-state"><div class="icon">👥</div><p>Nenhuma visita registada.</p><button class="btn btn-primary btn-sm" onclick="openVisitModalCRUD()">Criar Primeira Visita</button></div>' : `
        <table class="admin-table">
          <thead>
            <tr><th>Foto</th><th>Remetente</th><th>Data</th><th>Ações</th></tr>
          </thead>
          <tbody>
            ${visits.map(v => `
              <tr>
                <td><img src="${v.imageUrl}" alt="${esc(v.title)}" style="width: 40px; height: 30px; object-fit: cover; border-radius: 4px;"></td>
                <td><strong>${esc(v.title)}</strong></td>
                <td>${esc(v.date)}</td>
                <td>
                  <button class="action-btn edit" onclick="openVisitModalCRUD('${v.id}')" title="Editar">✏️</button>
                  <button class="action-btn delete" onclick="deleteVisit('${v.id}')" title="Apagar">🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;
}

function openVisitModalCRUD(id) {
  const visits = getStore('agr439-admin-visits');
  const visit = id ? visits.find(v => v.id === id) : null;

  showModal(`
    <h3>${visit ? '✏️ Editar Visita' : '👥 Nova Visita'}</h3>
    <div class="form-group">
      <label>Agrupamento / Remetente</label>
      <input type="text" id="m-visit-title" value="${visit ? esc(visit.title) : ''}" placeholder="Ex: Agrupamento 123 - Lisboa">
    </div>
    <div class="form-group">
      <label>Data / Época</label>
      <input type="text" id="m-visit-date" value="${visit ? esc(visit.date) : ''}" placeholder="Ex: Agosto 2024">
    </div>
    <div class="form-group">
      <label>Foto da Carta/Postal</label>
      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <input type="url" id="m-visit-image" value="${visit ? esc(visit.imageUrl) : ''}" placeholder="https://..." style="flex: 1;">
        <button class="btn btn-outline btn-sm" onclick="openImagePicker(url => document.getElementById('m-visit-image').value = url, 'visitantes')">🖼️ Galeria</button>
      </div>
      <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Upload primeiro na galeria para escolher aqui, ou use um URL direto.</p>
    </div>

    <div class="form-group">
      <label>Descrição / Mensagem (Opcional)</label>
      <textarea id="m-visit-desc" rows="4">${visit ? esc(visit.description) : ''}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
      <button class="btn-save" onclick="saveVisit('${id || ''}')">Guardar</button>
    </div>
  `);
}

function saveVisit(id) {
  const visits = getStore('agr439-admin-visits');
  const data = {
    id: id || generateId(),
    title: document.getElementById('m-visit-title').value,
    date: document.getElementById('m-visit-date').value,
    imageUrl: document.getElementById('m-visit-image').value,
    description: document.getElementById('m-visit-desc').value,
  };

  if (id) {
    const idx = visits.findIndex(v => v.id === id);
    if (idx >= 0) visits[idx] = data;
  } else {
    visits.push(data);
  }

  setStore('agr439-admin-visits', visits);
  closeModal();
  showToast('✅ Visita guardada!');
  renderVisitsCRUD(document.getElementById('admin-content'));
}

function deleteVisit(id) {
  if (!confirm('Apagar este registo?')) return;
  const visits = getStore('agr439-admin-visits').filter(v => String(v.id) !== String(id));
  setStore('agr439-admin-visits', visits);
  showToast('🗑️ Registo apagado.');
  renderVisitsCRUD(document.getElementById('admin-content'));
}

// ---------- CAIXA DO TEMPO CRUD ----------
function renderCaixaTempoCRUD(container) {
  const items = getStore('agr439-admin-caixa-tempo');

  container.innerHTML = `
    <div class="admin-table-container">
      <div class="admin-table-header">
        <h3>Arquivo: Caixa do Tempo (${items.length})</h3>
        <button class="btn btn-primary btn-sm" onclick="openCaixaTempoModal()">+ Novo Item</button>
      </div>
      ${items.length === 0 ? '<div class="empty-state"><div class="icon">⌛</div><p>Sem itens no arquivo histórico.</p><button class="btn btn-primary btn-sm" onclick="openCaixaTempoModal()">Adicionar Primeiro Item</button></div>' : `
        <table class="admin-table">
          <thead>
            <tr><th>Imagem</th><th>Ano</th><th>Título</th><th>Categoria</th><th>Ações</th></tr>
          </thead>
          <tbody>
            ${items.map(p => `
              <tr>
                <td><img src="${p.imageUrls ? p.imageUrls[0] : p.imageUrl}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;"></td>
                <td><strong>${esc(p.year)}</strong></td>
                <td>${esc(p.title)}</td>
                <td><span class="news-card-tag tag-geral">${esc(p.category)}</span></td>
                <td>
                  <button class="action-btn edit" onclick="openCaixaTempoModal('${p.id}')" title="Editar">✏️</button>
                  <button class="action-btn delete" onclick="deleteCaixaTempoItem('${p.id}')" title="Apagar">🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;
}

function openCaixaTempoModal(id) {
  const items = getStore('agr439-admin-caixa-tempo');
  const item = id ? items.find(n => n.id === id) : null;

  showModal(`
    <h3>${item ? '✏️ Editar Item de Arquivo' : '⌛ Novo Item de Arquivo'}</h3>
    <div class="form-group">
      <label>Título da Notícia/Evento</label>
      <input type="text" id="m-archive-title" value="${item ? esc(item.title) : ''}" placeholder="Ex: Acampamento de 1985">
    </div>
    <div class="form-group-row" style="display:flex; gap:1rem;">
      <div class="form-group" style="flex:1;">
        <label>Ano</label>
        <input type="text" id="m-archive-year" value="${item ? esc(item.year) : ''}" placeholder="Ex: 1985">
      </div>
      <div class="form-group" style="flex:1;">
        <label>Categoria</label>
        <input type="text" id="m-archive-cat" value="${item ? esc(item.category) : 'Imprensa'}" placeholder="Ex: Imprensa, Foto, Evento">
      </div>
    </div>
    <div class="form-group">
      <label>Descrição / Contexto</label>
      <textarea id="m-archive-desc" rows="3">${item ? esc(item.description) : ''}</textarea>
    </div>
    <div class="form-group">
      <label>Imagens (Recortes de Jornal / Fotos Antigas)</label>
      <div id="m-archive-images-container">
        ${(() => {
          const urls = item?.imageUrls || (item?.imageUrl ? [item.imageUrl] : ['']);
          return urls.map((url, i) => `
            <div class="archive-img-row" style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
              <input type="text" class="m-archive-img-input" value="${esc(url)}" placeholder="https://..." style="flex: 1;">
              <button class="btn btn-outline btn-sm" onclick="openImagePicker(url => this.previousElementSibling.value = url, 'caixatempo')">🖼️</button>
              ${i > 0 ? `<button class="btn btn-outline btn-sm" onclick="this.parentElement.remove()" style="color: var(--c-danger);">✕</button>` : ''}
            </div>
          `).join('');
        })()}
      </div>
      <button class="btn btn-outline btn-sm" style="width: 100%; margin-top: 0.2rem;" onclick="addArchiveImageRow()">+ Adicionar Outra Imagem</button>
      <small style="color: var(--text-muted); font-size: 0.75rem;">Adicione várias imagens para criar um carrossel no site.</small>
    </div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
      <button class="btn-save" onclick="saveCaixaTempoItem('${id || ''}')">Guardar</button>
    </div>
  `);
}

/** Helper para adicionar nova linha de imagem na modal */
window.addArchiveImageRow = () => {
  const container = document.getElementById('m-archive-images-container');
  const div = document.createElement('div');
  div.className = 'archive-img-row';
  div.style = 'display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;';
  div.innerHTML = `
    <input type="text" class="m-archive-img-input" value="" placeholder="https://..." style="flex: 1;">
    <button class="btn btn-outline btn-sm" onclick="openImagePicker(url => this.previousElementSibling.value = url, 'caixatempo')">🖼️</button>
    <button class="btn btn-outline btn-sm" onclick="this.parentElement.remove()" style="color: var(--c-danger);">✕</button>
  `;
  container.appendChild(div);
};

function saveCaixaTempoItem(id) {
  const items = getStore('agr439-admin-caixa-tempo');
  const imageUrls = Array.from(document.querySelectorAll('.m-archive-img-input'))
    .map(input => input.value.trim())
    .filter(url => url !== '');

  const data = {
    id: id || generateId(),
    title: document.getElementById('m-archive-title').value,
    year: document.getElementById('m-archive-year').value,
    category: document.getElementById('m-archive-cat').value,
    description: document.getElementById('m-archive-desc').value,
    imageUrls: imageUrls,
    imageUrl: imageUrls[0] || '', // Mantém legacy field para compatibilidade simples
    date: new Date().toISOString(),
  };

  if (id) {
    const idx = items.findIndex(n => n.id === id);
    if (idx >= 0) items[idx] = data;
  } else {
    items.push(data);
  }

  setStore('agr439-admin-caixa-tempo', items);
  closeModal();
  showToast('✅ Arquivo histórico guardado!');
  renderCaixaTempoCRUD(document.getElementById('admin-content'));
}

function deleteCaixaTempoItem(id) {
  if (!confirm('Deseja apagar este recorte histórico?')) return;
  const items = getStore('agr439-admin-caixa-tempo').filter(n => String(n.id) !== String(id));
  setStore('agr439-admin-caixa-tempo', items);
  showToast('🗑️ Recorte apagado.');
  renderCaixaTempoCRUD(document.getElementById('admin-content'));
}

// [showModal and closeModal are defined once in the UI HELPERS section below]




async function renderAISettings(container) {
  const mode = localStorage.getItem('agr439-ai-mode') || 'local';
  const provider = localStorage.getItem('agr439-ai-provider') || 'openai';
  const chatbotEnabled = localStorage.getItem('agr439-chatbot-enabled') === 'true';
  
  let apiKey = '';
  const encrypted = localStorage.getItem('agr439-ai-apikey-secure');
  if (encrypted && window.Security) {
    apiKey = await window.Security.decrypt(encrypted) || '';
  }

  container.innerHTML = `
    <div class="admin-table-container" style="max-width: 700px;">
      <div class="admin-table-header">
        <h3>🤖 Configuração de Inteligência Artificial</h3>
      </div>
      <div style="padding: 1.5rem;">
        
        <!-- --- SECTION: CHATBOT TOGGLE --- -->
        <div class="admin-card" style="margin-bottom: 2rem; border: 1px solid var(--border-color); background: rgba(var(--c-primary-rgb), 0.05);">
          <h4 style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">💬 Assistente Virtual (Chatbot)</h4>
          <div class="form-group">
            <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; font-weight: 600;">
              <input type="checkbox" id="chatbot-enabled" ${chatbotEnabled ? 'checked' : ''} style="width: 20px; height: 20px;">
              <span>Ativar Chatbot no Site</span>
            </label>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">
              Quando ativo, um ícone de robô aparecerá no canto inferior do site para responder a perguntas dos visitantes.
            </p>
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 2rem;">
          <label>Modo de Conexão do Motor AI</label>
          <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="radio" name="ai-mode" value="local" ${mode === 'local' ? 'checked' : ''} onchange="toggleAIFields()">
              <span>Portal_AI (Local / Dev)</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="radio" name="ai-mode" value="production" ${mode === 'production' ? 'checked' : ''} onchange="toggleAIFields()">
              <span>Modo Produção (Direto)</span>
            </label>
          </div>
          <small style="color: var(--text-muted);">Use Portal_AI para desenvolvimento local. Use Produção para quando o site estiver publicado (exige Chave API).</small>
        </div>

        <div id="ai-production-fields" style="display: ${mode === 'production' ? 'block' : 'none'}; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
          <div class="form-group">
            <label>Provedor AI (Recomendado: Google Gemini)</label>
            <select id="ai-provider" style="width: 100%;">
              <option value="gemini" ${provider === 'gemini' ? 'selected' : ''}>Google Gemini (Grátis/Baixo Custo)</option>
              <option value="openai" ${provider === 'openai' ? 'selected' : ''}>OpenAI (ChatGPT)</option>
              <option value="anthropic" ${provider === 'anthropic' ? 'selected' : ''}>Anthropic Claude</option>
              <option value="groq" ${provider === 'groq' ? 'selected' : ''}>Groq (Ultra Rápido)</option>
              <option value="deepseek" ${provider === 'deepseek' ? 'selected' : ''}>DeepSeek</option>
              <option value="openrouter" ${provider === 'openrouter' ? 'selected' : ''}>OpenRouter (Vários)</option>
            </select>
          </div>
          <div class="form-group">
            <label id="label-apikey">Chave API (Gemini/Outro)</label>
            <input type="password" id="ai-apikey" value="${apiKey}" placeholder="Cole aqui a sua chave API...">
            <div style="margin-top: 0.5rem; padding: 0.75rem; background: var(--bg-secondary); border-radius: 6px; font-size: 0.8rem; line-height: 1.4;">
              <strong>Como obter uma chave para o Gemini?</strong><br>
              1. Vá ao <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: var(--c-primary);">Google AI Studio</a>.<br>
              2. Crie uma "API Key".<br>
              3. Cole-a no campo acima e clique em "Guardar".
            </div>
          </div>
        </div>

        <div style="margin-top: 2rem; padding: 1rem; background: rgba(var(--c-primary-rgb), 0.1); border-radius: 8px;">
          <h4 style="margin-bottom: 0.5rem;">🧠 Estado do RAG (Base de Conhecimento)</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">
            O chatbot utiliza os dados do site (notícias, eventos, história) para responder.
          </p>
          <button class="btn btn-outline btn-sm" style="margin-top: 0.5rem;" onclick="window.AI.init(); showToast('🧠 Dados re-indexados!');">🔄 Atualizar Base de Conhecimento</button>
        </div>

        <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="testAndSaveAISettings()" id="btn-ai-test">💾 Guardar & Testar Ligação</button>
          <button class="btn btn-outline" onclick="saveAISettings()">Apenas Guardar</button>
        </div>
      </div>
    </div>
  `;
}

function toggleAIFields() {
  const fields = document.getElementById('ai-production-fields');
  const mode = document.querySelector('input[name="ai-mode"]:checked').value;
  fields.style.display = mode === 'production' ? 'block' : 'none';
}



async function saveAISettings() {
  const mode = document.querySelector('input[name="ai-mode"]:checked').value;
  const provider = document.getElementById('ai-provider').value;
  const apiKey = document.getElementById('ai-apikey').value.trim();
  const chatbotEnabled = document.getElementById('chatbot-enabled').checked;

  localStorage.setItem('agr439-ai-mode', mode);
  localStorage.setItem('agr439-ai-provider', provider);
  localStorage.setItem('agr439-chatbot-enabled', chatbotEnabled);
  
  if (apiKey && window.Security) {
    const encrypted = await window.Security.encrypt(apiKey);
    localStorage.setItem('agr439-ai-apikey-secure', encrypted);
    localStorage.removeItem('agr439-ai-apikey');
  }

  showToast('✅ Configurações de AI guardadas de forma segura!');
}

async function testAndSaveAISettings() {
  await saveAISettings();

  const mode = document.querySelector('input[name="ai-mode"]:checked').value;
  if (mode === 'local') {
    showToast('🚀 Ligação salva para Modo de Desenvolvimento (Portal_AI).');
    return;
  }

  const btn = document.getElementById('btn-ai-test');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'A testar ligação...';
  
  try {
    const result = await window.AI.testConnection();
    showToast(`✅ Ligação com o provedor estabelecida com sucesso!\n\nResposta do provedor: ${result}`);
  } catch (err) {
    showToast(`❌ Falha na ligação AI:\n\n${err.message}\n\nA sua chave foi guardada na mesma, mas poderá não funcionar corretamente com a configuração atual.`);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }
}

/**
 * AI ADMIN HELPERS
 */
async function helpWriteNews() {
  const title = document.getElementById('m-news-title').value;
  const content = document.getElementById('m-news-content').value;
  
  if (!title && !content) {
    showToast('⚠️ Escreve pelo menos um título ou ideia inicial.');
    return;
  }

  showToast('🤖 AI a processar rascunho...');
  
  try {
    const prompt = `Estou a escrever uma notícia para o site do Agrupamento 439 (Escuteiros). 
    Título atual: ${title}
    Conteúdo atual: ${content}
    
    Por favor, melhora este texto para ser mais cativante, mantendo o tom escutista. 
    Se o conteúdo estiver vazio, expande o título para uma notícia completa de 2 parágrafos.
    Responde APENAS com o texto final da notícia.`;

    const result = await window.AI.complete([{ role: 'user', content: prompt }]);
    document.getElementById('m-news-content').value = result;
    showToast('✨ Texto melhorado pela AI!');
  } catch (err) {
    showToast('❌ Erro na AI: ' + err.message);
  }
}

/**
 * SITE SYNCHRONIZATION & PUBLISHING SYSTEM
 * ----------------------------------------
 */

const SYNC_KEYS = [
  'agr439-admin-gallery',
  'agr439-admin-news',
  'agr439-admin-events',
  'agr439-admin-caixa-tempo',
  'agr439-admin-timeline',
  'agr439-admin-songs',
  'agr439-admin-visits',
  'agr439-admin-pages',
  'agr439-admin-hero-stats',
  'agr439-admin-recruitment'
];

async function syncFromGitHub(manual = false) {
  const config = getGitHubConfig();
  if (!config.owner || !config.repo) return;
  
  if (manual) showToast('🔍 Procurando atualizações no GitHub...');

  try {
    const url = `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch || 'main'}/data/site-data.json?t=${Date.now()}`;
    const res = await fetch(url);
    if (!res.ok) {
      if (manual) showToast('ℹ️ Nenhum ficheiro de dados encontrado no GitHub.');
      return;
    }
    
    const remoteData = await res.json();
    let updatedCount = 0;

    SYNC_KEYS.forEach(key => {
      const dataKey = key.replace('agr439-admin-', '').replace('agr439-', '');
      if (remoteData[dataKey]) {
        localStorage.setItem(key, JSON.stringify(remoteData[dataKey]));
        updatedCount++;
      }
    });

    if (updatedCount > 0 && manual) {
      showToast('✅ Sincronizado com sucesso! A recarregar...');
      setTimeout(() => location.reload(), 1500);
    }
  } catch (err) {
    if (manual) showToast('❌ Erro na sincronização: ' + err.message);
  }
}

async function publishSiteData() {
  const config = getGitHubConfig();
  if (!config.token || !config.owner || !config.repo) {
    showToast('Erro: Configure o Token do GitHub nas Definições primeiro.');
    return;
  }

  // Comentado para evitar bloqueio do browser durante debug
  // if (!confirm('Tem a certeza que deseja tornar as suas alterações públicas?')) return;

  const btn = document.getElementById('btn-publish');
  const originalText = btn ? btn.textContent : '🚀 Publicar Agora';
  if (btn) {
    btn.disabled = true;
    btn.textContent = '🚀 A publicar...';
  }

  try {
    console.log('Iniciando publicação...');
    const payload = {};
    SYNC_KEYS.forEach(key => {
      const dataKey = key.replace('agr439-admin-', '').replace('agr439-', '');
      payload[dataKey] = getStore(key); // Usar getStore que já é seguro
    });
    
    console.log('Payload gerado com sucesso:', Object.keys(payload));
    console.log('Resumo do Payload:', {
      noticias: payload.news?.length || 0,
      galeria: payload.gallery?.length || 0,
      eventos: payload.events?.length || 0,
      musicas: payload.songs?.length || 0,
      caixaTempo: payload['caixa-tempo']?.length || 0
    });

    // 2. Get current SHA if file exists
    let sha = null;
    const path = 'data/site-data.json';
    const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`;
    
    console.log('Buscando SHA atual em:', apiUrl);
    const getRes = await fetch(apiUrl, {
      headers: { 'Authorization': `token ${config.token}` }
    });
    
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
      console.log('SHA atual encontrado:', sha);
    } else if (getRes.status === 404) {
      console.log('Arquivo site-data.json não existe no GitHub. Criando novo...');
    } else {
      const err = await getRes.json();
      throw new Error(`Erro ao buscar SHA: ${err.message || getRes.statusText}`);
    }

    // 3. Upload/Update file
    console.log('Enviando dados para o GitHub (PUT)...');
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: '🚀 Publish site content update',
        content: btoa(unescape(encodeURIComponent(JSON.stringify(payload, null, 2)))),
        sha: sha || undefined,
        branch: config.branch
      })
    });

    if (!putRes.ok) {
      let errMsg = 'Erro na API do GitHub';
      const status = putRes.status;
      try {
        const err = await putRes.json();
        errMsg = err.message || errMsg;
        
        if (status === 401) errMsg = 'Token do GitHub inválido ou expirado. Verifique as Definições.';
        if (status === 404) errMsg = 'Repositório ou branch não encontrado. Verifique as Definições.';
        if (status === 422) errMsg = 'Conflito de SHA ou dados inválidos. Tente Sincronizar primeiro.';
      } catch (e) {
        errMsg = `HTTP ${status}: ${putRes.statusText}`;
      }
      throw new Error(errMsg);
    }

    console.log('Publicação concluída com sucesso!');
    showToast('✨ Site publicado com sucesso! Visite para ver as mudanças.');
  } catch (err) {
    console.error('Falha na publicação:', err);
    alert('❌ Erro na publicação:\n' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}


function renderSettings(container) {
  const config = getGitHubConfig();

  container.innerHTML = `
    <div class="admin-card" style="max-width: 600px;">
      <h3>⚙️ Configurações do GitHub (Auto-Publish)</h3>
      <p style="margin-bottom: 1.5rem; color: var(--text-muted);">
        Configure estas definições para que o sistema possa publicar automaticamente as suas alterações no site.
      </p>

      <div class="form-group">
        <label>Personal Access Token (GitHub)</label>
        <input type="password" id="gh-token" value="${esc(config.token)}" placeholder="ghp_xxxxxxxxxxxx">
        <small style="color: var(--text-muted);">A sua chave é guardada apenas localmente no navegador.</small>
      </div>

      <div class="form-group-row" style="display: flex; gap: 1rem; margin-top: 1rem;">
        <div class="form-group" style="flex: 1;">
          <label>Proprietário (Owner)</label>
          <input type="text" id="gh-owner" value="${esc(config.owner)}" placeholder="Ex: Hallukardy">
        </div>
        <div class="form-group" style="flex: 1;">
          <label>Repositório (Repo)</label>
          <input type="text" id="gh-repo" value="${esc(config.repo)}" placeholder="Ex: Agrupamento439">
        </div>
      </div>

      <div class="form-group" style="margin-top: 1rem;">
        <label>Branch</label>
        <input type="text" id="gh-branch" value="${esc(config.branch)}" placeholder="Ex: main">
      </div>

      <div style="margin-top: 2rem; display: flex; gap: 1rem;">
        <button class="btn btn-primary" onclick="saveGitHubSettings()">💾 Guardar Configuração</button>
      </div>
    </div>
  `;
}

function getGitHubConfig() {
  const saved = localStorage.getItem('agr439-gh-config');
  const defaults = { owner: 'Hallukardy', repo: 'Agrupamento439', branch: 'main', token: '' };
  
  if (!saved) return defaults;
  try {
    const config = JSON.parse(saved);
    return { ...defaults, ...config };
  } catch (e) {
    return defaults;
  }
}

function saveGitHubSettings() {
  const config = {
    token: document.getElementById('gh-token').value,
    owner: document.getElementById('gh-owner').value,
    repo: document.getElementById('gh-repo').value,
    branch: document.getElementById('gh-branch').value || 'main'
  };
  localStorage.setItem('agr439-gh-config', JSON.stringify(config));
  showToast('✅ Configurações do GitHub guardadas!');
}

/**
 * Upload file to GitHub using REST API
 */
async function uploadToGitHub(file) {
  const config = getGitHubConfig();
  if (!config.token || !config.owner || !config.repo) {
    throw new Error('Configuração do GitHub incompleta.');
  }

  // Generate filename: original_YYYYMMDDHHMM.ext
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 12); 
  const dotIdx = file.name.lastIndexOf('.');
  const ext = file.name.substring(dotIdx + 1);
  const nameOnly = file.name.substring(0, dotIdx);
  const originalName = nameOnly.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const finalName = `${originalName}_${timestamp}.${ext}`;
  const path = `assets/gallery/${finalName}`;

  // Read file as Base64
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Upload media: ${finalName}`,
      content: base64,
      branch: config.branch
    })
  });

  if (!response.ok) {
    let errorMsg = 'Erro no upload para o GitHub';
    try {
      const err = await response.json();
      errorMsg = err.message || errorMsg;
    } catch (e) {
      errorMsg = `Erro ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMsg);
  }

  const result = await response.json();
  return {
    url: path, // Local path relative to site root
    githubUrl: result.content.download_url,
    filename: finalName
  };
}

// ---------- UI HELPERS ----------
function showModal(html) {
  let overlay = document.getElementById('modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  }
  overlay.innerHTML = `<div class="modal">${html}</div>`;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // prevent body scroll when modal is open
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = ''; // restore body scroll
}

// ---------- RECRUITMENT CRUD ----------
function renderRecruitmentCRUD(container) {
  const data = JSON.parse(localStorage.getItem('agr439-admin-recruitment') || '{}');

  container.innerHTML = `
    <div class="admin-table-container" style="max-width: 800px;">
      <div class="admin-table-header">
        <h3>📢 Gestão de Recrutamento</h3>
      </div>
      <div style="padding: 1.5rem;">
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 2rem;">
          Gerencie as imagens e recursos da secção "Vem ser Escuteiro".
        </p>

        <div class="form-group" style="margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border-color);">
          <label style="font-weight: 600; font-size: 1.1rem; display: block; margin-bottom: 1rem;">🖼️ Flyer Principal (Grandão)</label>
          <div style="display: flex; gap: 1.5rem; align-items: start; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 300px;">
              <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 1rem;">
                <input type="text" id="rec-flyer-url" value="${data.flyerUrl || 'assets/vemser_img1.png'}" placeholder="URL da imagem" style="flex: 1;">
                <button class="btn btn-outline btn-sm" onclick="openImagePicker(url => { document.getElementById('rec-flyer-url').value = url; updateRecPreview('flyer-preview', url); }, 'recrutamento')">🖼️ Galeria</button>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-muted);">Este é o flyer que aparece no centro da secção de recrutamento.</p>
            </div>
            <div style="width: 200px; height: 150px; background: var(--bg-secondary); border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color);">
              <img id="flyer-preview" src="${data.flyerUrl || 'assets/vemser_img1.png'}" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border-color);">
          <label style="font-weight: 600; font-size: 1.1rem; display: block; margin-bottom: 1rem;">📸 Imagem de Cabeçalho</label>
          <div style="display: flex; gap: 1.5rem; align-items: start; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 300px;">
              <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 1rem;">
                <input type="text" id="rec-header-url" value="${data.headerUrl || 'assets/vemser_img2.png'}" placeholder="URL da imagem" style="flex: 1;">
                <button class="btn btn-outline btn-sm" onclick="openImagePicker(url => { document.getElementById('rec-header-url').value = url; updateRecPreview('header-preview', url); }, 'recrutamento')">🖼️ Galeria</button>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-muted);">Imagem que aparece logo no início da secção (imagem de celebração).</p>
            </div>
            <div style="width: 200px; height: 100px; background: var(--bg-secondary); border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color);">
              <img id="header-preview" src="${data.headerUrl || 'assets/vemser_img2.png'}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 2rem;">
          <label style="font-weight: 600; font-size: 1.1rem; display: block; margin-bottom: 1rem;">📄 Recurso PDF (Método Escutista)</label>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div class="form-group">
              <label>Link do PDF (Google Drive ou outro)</label>
              <input type="url" id="rec-pdf-link" value="${data.pdfLink || 'https://drive.google.com/file/d/1QQajQ4CBA_Sn8JnB8fJhNBXKV9-QcPUE/view'}" placeholder="https://drive.google.com/...">
            </div>
            <div style="display: flex; gap: 1.5rem; align-items: start; flex-wrap: wrap;">
              <div style="flex: 1; min-width: 300px;">
                <label>Miniatura do PDF</label>
                <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
                  <input type="text" id="rec-pdf-img-url" value="${data.pdfImageUrl || 'assets/flyer1.jpg'}" placeholder="URL da miniatura" style="flex: 1;">
                  <button class="btn btn-outline btn-sm" onclick="openImagePicker(url => { document.getElementById('rec-pdf-img-url').value = url; updateRecPreview('pdf-preview', url); }, 'recrutamento')">🖼️ Galeria</button>
                </div>
              </div>
              <div style="width: 70px; height: 95px; background: #fff; border: 1px solid #ccc; box-shadow: var(--shadow-sm); overflow: hidden;">
                <img id="pdf-preview" src="${data.pdfImageUrl || 'assets/flyer1.jpg'}" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top: 3rem; display: flex; justify-content: flex-end;">
          <button class="btn btn-primary" onclick="saveRecruitment()">✨ Guardar Alterações</button>
        </div>
      </div>
    </div>
  `;
}

function updateRecPreview(id, url) {
  const img = document.getElementById(id);
  if (img) img.src = url;
}

function saveRecruitment() {
  const data = {
    flyerUrl: document.getElementById('rec-flyer-url').value,
    headerUrl: document.getElementById('rec-header-url').value,
    pdfLink: document.getElementById('rec-pdf-link').value,
    pdfImageUrl: document.getElementById('rec-pdf-img-url').value,
    lastUpdated: new Date().toISOString()
  };

  localStorage.setItem('agr439-admin-recruitment', JSON.stringify(data));
  showToast('✅ Recrutamento atualizado com sucesso!');
}


// ---------- PAGES CRUD ----------
const _defaultPages = [
  { id: 'hero',  label: 'Hero / Banner',          key: 'hero_subtitle', content: '', contentEn: '' },
  { id: 'about', label: 'Sobre o Agrupamento',    key: 'footer_desc',   content: '', contentEn: '' },
];

function renderPagesCRUD(container) {
  // Merge: add any _defaultPages entries that don't yet exist in the store
  // This handles partial data (e.g., only 1 of 2 entries saved from a previous session)
  const _existing = getStore('agr439-admin-pages');
  let _changed = false;
  _defaultPages.forEach(def => {
    if (!_existing.find(p => p.id === def.id)) {
      _existing.push(Object.assign({}, def)); // add missing entry; preserve saved ones
      _changed = true;
    }
  });
  if (_changed) setStore('agr439-admin-pages', _existing);

  const pages = getStore('agr439-admin-pages');

  container.innerHTML = `
    <div class="admin-table-container">
      <div class="admin-table-header">
        <h3>Conteúdo Editável</h3>
      </div>
      <table class="admin-table">
        <thead>
          <tr>
            <th>Secção</th>
            <th>Conteúdo Atual</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          ${pages.map(p => `
            <tr>
              <td><strong>${esc(p.label)}</strong></td>
              <td style="max-width:500px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:${p.content ? 'var(--text-primary)' : 'var(--text-muted)'};">
                ${p.content ? esc(p.content) : 'Padrão (sem override)'}
              </td>
              <td>
                <button class="action-btn edit" onclick="openPageEditModal('${p.id}')" title="Editar conteúdo">✏️</button>
                ${p.content ? `<button class="action-btn delete" onclick="clearPageContent('${p.id}')" title="Repor padrão">🗑️</button>` : ''}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function openPageEditModal(id) {
  const pages = getStore('agr439-admin-pages');
  const page = pages.find(p => p.id === id);
  if (!page) return;

  showModal(`
    <h3>✏️ Editar — ${esc(page.label)}</h3>
    <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:1.2rem;">
      Este texto substitui o conteúdo padrão do site. Deixe em branco para usar o texto original.
    </p>
    <div class="form-group">
      <label>Conteúdo (PT)</label>
      <textarea id="m-page-content-pt" rows="4" placeholder="Texto em Português…">${esc(page.content || '')}</textarea>
    </div>
    <div class="form-group">
      <label>Conteúdo (EN) <span style="color:var(--text-muted); font-weight:400;">(Opcional)</span></label>
      <textarea id="m-page-content-en" rows="4" placeholder="English text (optional)…">${esc(page.contentEn || '')}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
      <button class="btn-save" onclick="savePageContent('${id}')">Guardar</button>
    </div>
  `);
}

function savePageContent(id) {
  const pages = getStore('agr439-admin-pages');
  const idx = pages.findIndex(p => p.id === id);
  if (idx < 0) return;

  pages[idx].content   = document.getElementById('m-page-content-pt').value.trim();
  pages[idx].contentEn = document.getElementById('m-page-content-en').value.trim();

  setStore('agr439-admin-pages', pages);
  closeModal();
  showToast('✅ Conteúdo da página guardado!');
  renderPagesCRUD(document.getElementById('admin-content'));
}

function clearPageContent(id) {
  if (!confirm('Repor o conteúdo padrão desta secção?')) return;
  const pages = getStore('agr439-admin-pages');
  const idx = pages.findIndex(p => p.id === id);
  if (idx < 0) return;
  pages[idx].content   = '';
  pages[idx].contentEn = '';
  setStore('agr439-admin-pages', pages);
  showToast('🔄 Conteúdo reposto ao padrão.');
  renderPagesCRUD(document.getElementById('admin-content'));
}


// ---------- MEDIA PICKER MODAL ----------
function openImagePicker(onSelect, filterCat = null) {
  const gallery = getStore('agr439-admin-gallery');
  let selectedUrl = '';
  
  // Store callback globally to allow "Ver Todas" to re-call this function
  window.currentPickerOnSelect = onSelect;

  // Apply filter
  const items = filterCat ? gallery.filter(g => g.category === filterCat) : gallery;
  const filterLabel = filterCat ? getCatLabel(filterCat) : 'Todas';

  const html = `
    <h3>🖼️ Selecionar Imagem</h3>
    <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
      <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">
        ${filterCat ? `A mostrar apenas: <strong>${filterLabel}</strong>` : 'Escolha uma imagem da sua galeria.'}
      </p>
      ${filterCat ? `<button class="btn btn-outline btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="openImagePicker(window.currentPickerOnSelect)">Ver Todas</button>` : ''}
    </div>
    
    <div class="media-picker-grid" id="picker-grid">
      ${items.map(g => `
        <div class="media-picker-item" onclick="selectPickerImage(this, '${g.url}')">
          <img src="${g.url}" alt="${esc(g.description)}">
          <div class="check">✓</div>
        </div>
      `).join('')}
      ${items.length === 0 ? `
        <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
          <p style="margin-bottom: 1rem;">Nenhuma imagem encontrada em "${filterLabel}".</p>
          ${filterCat ? `<button class="btn btn-primary btn-sm" onclick="openImagePicker(window.currentPickerOnSelect)">Ver Todas as Fotos</button>` : ''}
        </div>` : ''}
    </div>

    <div class="modal-actions">
      <button class="btn-cancel" onclick="closePicker()">Cancelar</button>
      <button class="btn-save" id="btn-confirm-picker" disabled onclick="confirmPicker()">Confirmar Seleção</button>
    </div>
  `;

  // We need a separate overlay for the picker so we don't close the current modal
  let pickerOverlay = document.getElementById('picker-overlay');
  if (!pickerOverlay) {
    pickerOverlay = document.createElement('div');
    pickerOverlay.id = 'picker-overlay';
    pickerOverlay.className = 'modal-overlay';
    document.body.appendChild(pickerOverlay);
  }
  pickerOverlay.innerHTML = `<div class="modal" style="max-width: 600px;">${html}</div>`;
  pickerOverlay.classList.add('active');

  window.selectPickerImage = (el, url) => {
    document.querySelectorAll('.media-picker-item').forEach(i => i.classList.remove('selected'));
    el.classList.add('selected');
    selectedUrl = url;
    document.getElementById('btn-confirm-picker').disabled = false;
  };

  window.confirmPicker = () => {
    onSelect(selectedUrl);
    closePicker();
  };

  window.closePicker = () => {
    pickerOverlay.classList.remove('active');
  };
}

function esc(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function getCatLabel(cat) {
  const labels = {
    'geral': 'Notícia / Aviso',
    'lobitos': 'Lobitos',
    'exploradores': 'Exploradores',
    'pioneiros': 'Pioneiros',
    'caminheiros': 'Caminheiros',
    'acampamento': 'Acampamento',
    'evento': 'Evento',
    'timeline': 'Cronologia',
    'recrutamento': 'Recrutamento',
    'cancioneiro': 'Cancioneiro',
    'visitantes': 'Visitantes / Postais',
    'caixatempo': 'Caixa do Tempo (Arquivo)',
    'hero': 'Página Inicial / Títulos'
  };
  return labels[cat] || cat;
}


function openEventImagePicker() {
  openImagePicker(url => {
    const list = document.getElementById('m-event-selected-pics');
    // Check if empty state
    if (list.querySelector('p')) list.innerHTML = '';
    
    // Add new checkbox
    const gallery = getStore('agr439-admin-gallery');
    const item = gallery.find(g => g.url === url);
    if (!item) return;

    // Check if already in list
    if (list.querySelector(`input[value="${item.id}"]`)) return;

    const div = document.createElement('label');
    div.style = 'display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem; cursor:pointer;';
    div.innerHTML = `
      <input type="checkbox" class="m-event-gallery-cb" value="${item.id}" checked>
      <img src="${item.url}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;">
      <span>${esc(item.description)}</span>
    `;
    list.appendChild(div);
  }, 'evento');
}

function renderHeroStatsEditor(container) {
  // Fix: wrap JSON.parse in try/catch to handle corrupted localStorage data
  let _heroRaw;
  try { _heroRaw = JSON.parse(localStorage.getItem('agr439-admin-hero-stats')); } catch (e) { _heroRaw = null; }
  const data = _heroRaw || {
    badge: '🏕️ 50 Anos de Escutismo em Vila do Conde',
    groupPhoto: 'assets/imagem.jpg',
    icon: 'assets/logo.png',
    title1: 'Agrupamento',
    title2: '439',
    subtitle: 'São João Baptista de Vila do Conde — Desde 1975, a formar jovens para a vida através da aventura, do serviço e da amizade.',
    years: 50,
    scouts: 500,
    camps: 200,
    nights: 1000
  };

  container.innerHTML = `
    <div class="admin-card">
      <h3>✨ Página Inicial / Títulos</h3>
      <p style="margin-bottom:1.5rem; color:var(--text-secondary);">Configure os textos principais e os valores das estatísticas que aparecem no topo do site.</p>
      
      <form id="hero-stats-form" onsubmit="event.preventDefault(); window.saveHeroStats();">
        <div class="form-group">
          <label>Texto da Badge (Topo)</label>
          <input type="text" id="h-badge" value="${esc(data.badge || '')}">
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-top:1rem;">
          <div class="form-group">
            <label>Foto de Grupo (Topo - URL)</label>
            <div style="display:flex; gap:0.5rem;">
              <input type="text" id="h-group-photo" value="${esc(data.groupPhoto || '')}" style="flex-grow:1;">
              <button type="button" class="btn btn-outline" onclick="openHeroPhotoPicker()" style="padding:0.5rem 1rem;">🖼️</button>
            </div>
          </div>
          <div class="form-group">
             <label>Preview Foto</label>
             <div style="background:var(--bg-secondary); padding:0.5rem; border-radius:var(--r-md); text-align:center;">
                <img id="h-group-preview" src="${data.groupPhoto || ''}" style="height:50px; border-radius:4px; border:1px solid var(--border-color); object-fit:cover; width:100px;">
             </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-top:1rem;">
          <div class="form-group">
            <label>Ícone/Logo (URL)</label>
            <div style="display:flex; gap:0.5rem;">
              <input type="text" id="h-icon" value="${esc(data.icon)}" style="flex-grow:1;">
              <button type="button" class="btn btn-outline" onclick="openHeroIconPicker()" style="padding:0.5rem 1rem;">🖼️</button>
            </div>
          </div>
          <div class="form-group">
             <label>Preview Ícone</label>
             <div style="background:var(--bg-secondary); padding:0.5rem; border-radius:var(--r-md); text-align:center;">
                <img id="h-icon-preview" src="${data.icon}" style="height:50px; border-radius:50%; border:2px solid var(--c-primary); object-fit:cover;">
             </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-top:1rem;">
          <div class="form-group">
            <label>Título Parte 1</label>
            <input type="text" id="h-title1" value="${esc(data.title1)}">
          </div>
          <div class="form-group">
            <label>Título Parte 2 (Destaque)</label>
            <input type="text" id="h-title2" value="${esc(data.title2)}">
          </div>
        </div>

        <div class="form-group" style="margin-top:1rem;">
          <label>Subtítulo / Mensagem</label>
          <textarea id="h-subtitle" rows="3">${esc(data.subtitle)}</textarea>
        </div>

        <hr style="margin:2rem 0; border:0; border-top:1px solid var(--border-color);">
        
        <h4 style="margin-bottom:1rem;">🔢 Estatísticas (Contadores)</h4>
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:1rem;">
          <div class="form-group">
            <label>Anos</label>
            <input type="number" id="h-years" value="${data.years}">
          </div>
          <div class="form-group">
            <label>Formados</label>
            <input type="number" id="h-scouts" value="${data.scouts}">
          </div>
          <div class="form-group">
            <label>Acampamentos</label>
            <input type="number" id="h-camps" value="${data.camps}">
          </div>
          <div class="form-group">
            <label>Noites</label>
            <input type="number" id="h-nights" value="${data.nights}">
          </div>
        </div>

        <div style="margin-top:2rem; text-align:right;">
          <button type="submit" class="btn btn-primary">💾 Guardar Alterações</button>
        </div>
      </form>
    </div>
  `;

  // Update previews on URL change
  document.getElementById('h-icon').addEventListener('input', e => {
     document.getElementById('h-icon-preview').src = e.target.value;
  });
  document.getElementById('h-group-photo').addEventListener('input', e => {
     document.getElementById('h-group-preview').src = e.target.value;
  });

  window.saveHeroStats = () => {
    console.log('DEBUG: saveHeroStats starting...');
    const newData = {
      badge: document.getElementById('h-badge').value,
      groupPhoto: document.getElementById('h-group-photo').value,
      icon: document.getElementById('h-icon').value,
      title1: document.getElementById('h-title1').value,
      title2: document.getElementById('h-title2').value,
      subtitle: document.getElementById('h-subtitle').value,
      years: parseInt(document.getElementById('h-years').value),
      scouts: parseInt(document.getElementById('h-scouts').value),
      camps: parseInt(document.getElementById('h-camps').value),
      nights: parseInt(document.getElementById('h-nights').value)
    };
    console.log('DEBUG: Data collected:', newData);
    localStorage.setItem('agr439-admin-hero-stats', JSON.stringify(newData));
    showToast('✅ Configurações salvas com sucesso! A página inicial foi atualizada.');
  };

  window.openHeroPhotoPicker = () => {
    openImagePicker(url => {
      document.getElementById('h-group-photo').value = url;
      document.getElementById('h-group-preview').src = url;
    }, 'hero');
  };

  window.openHeroIconPicker = () => {
    openImagePicker(url => {
      document.getElementById('h-icon').value = url;
      document.getElementById('h-icon-preview').src = url;
    }, 'hero');
  };
}

function toggleSidebar() {
  document.querySelector('.admin-sidebar')?.classList.toggle('open');
}

function cleanGhostGalleryItems() {
  const gallery = getStore('agr439-admin-gallery');
  if (!gallery || gallery.length === 0) return;

  const ghostIds = ['test2', 'test_with_token', 'test-item', 'test_item'];
  const newGallery = gallery.filter(item => {
    // Remove se o ID estiver na lista de fantasmas
    if (ghostIds.includes(item.id)) return false;
    // Remove se o URL contiver "test" e não parecer um URL real
    if (item.url && (item.url.includes('test2') || item.url.includes('test_with_token'))) return false;
    return true;
  });

  if (newGallery.length !== gallery.length) {
    console.log(`CLEANUP: Removed ${gallery.length - newGallery.length} ghost items.`);
    setStore('agr439-admin-gallery', newGallery);
  }
}


