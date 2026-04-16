/* ============================================================
   ADMIN PANEL — AGRUPAMENTO 439
   CRUD Logic · localStorage demo
   ============================================================ */

// ---------- AUTH ----------
const ADMIN_USER = 'admin439';
const ADMIN_PASS = 'escuteiros2025';

function checkAuth() {
  return sessionStorage.getItem('agr439-admin-auth') === 'true';
}

function doLogin() {
  const user = document.getElementById('login-user').value;
  const pass = document.getElementById('login-pass').value;
  const errorEl = document.getElementById('login-error');

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
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
  } else {
    showLogin();
  }

  // Theme
  const saved = localStorage.getItem('agr439-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
});

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
      headerTitle.innerHTML = '✨ <span>Destaques Hero</span>';
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
    case 'pages':
      headerTitle.innerHTML = '🌐 <span>Conteúdo de Páginas</span>';
      renderPagesCRUD(main);
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
  }
}



// ---------- STORAGE HELPERS ----------
function getStore(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function setStore(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
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
    <div class="stats-row">
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
        <div class="stat-name">Arquivo</div>
      </div>
    </div>

    <div class="admin-table-container">
      <div class="admin-table-header">
        <h3>📋 Últimas Mensagens</h3>
      </div>
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
        <button class="btn btn-outline btn-sm" onclick="openImagePicker(url => document.getElementById('m-news-img').value = url)">🖼️ Escolher</button>
      </div>
      <small style="color: var(--text-muted); font-size: 0.75rem;">Link da imagem ou escolha da galeria.</small>
    </div>
    <div class="form-group">
      <label><input type="checkbox" id="m-news-published" ${item?.published ? 'checked' : ''}> Publicar</label>
    </div>
    <div class="modal-actions">
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

  setStore('agr439-admin-news', news);
  closeModal();
  showToast('✅ Notícia guardada!');
  renderNewsCRUD(document.getElementById('admin-content'));
}

function deleteNews(id) {
  if (!confirm('Apagar esta notícia?')) return;
  const news = getStore('agr439-admin-news').filter(n => n.id !== id);
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
  if (!confirm('Apagar este evento?')) return;
  const events = getStore('agr439-admin-events').filter(e => e.id !== id);
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
                    <button class="action-btn" onclick="renderTimelineItemsCRUD('${t.id}')" title="Gerir Sub-itens deste ano" style="background:#f0e6d2; color:#b08d55;">📂 Abrir Itens</button>
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
  if (!confirm('Apagar este ano inteiro e todos os seus blocos de informação?')) return;
  const timeline = getStore('agr439-admin-timeline').filter(t => t.id !== id);
  setStore('agr439-admin-timeline', timeline);
  showToast('🗑️ Ano apagado.');
  renderTimelineCRUD();
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
        <button class="btn btn-outline btn-sm" onclick="openImagePicker(url => document.getElementById('m-tli-img').value = url)">🖼️ Escolher</button>
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
function renderGalleryCRUD(container) {
  const gallery = getStore('agr439-admin-gallery');

  container.innerHTML = `
    <div class="admin-table-container">
      <div class="admin-table-header">
        <h3>Galeria (${gallery.length})</h3>
        <button class="btn btn-primary btn-sm" onclick="openGalleryModal()">+ Adicionar Foto</button>
      </div>
      ${gallery.length === 0 ? '<div class="empty-state"><div class="icon">🖼️</div><p>Nenhuma foto na galeria.</p><button class="btn btn-primary btn-sm" onclick="openGalleryModal()">Adicionar Primeira Foto</button></div>' : `
        <table class="admin-table">
          <thead>
            <tr><th>Descrição</th><th>Categoria</th><th>Estado</th><th>Ações</th></tr>
          </thead>
          <tbody>
            ${gallery.map(g => `
              <tr>
                <td>${esc(g.description)}</td>
                <td>${esc(g.category)}</td>
                <td><span class="status-badge ${g.approved ? 'status-published' : 'status-draft'}">${g.approved ? 'Aprovada' : 'Pendente'}</span></td>
                <td>
                  <button class="action-btn edit" onclick="toggleGalleryApproval('${g.id}')" title="${g.approved ? 'Desaprovar' : 'Aprovar'}">${g.approved ? '❌' : '✅'}</button>
                  <button class="action-btn delete" onclick="deleteGalleryItem('${g.id}')" title="Apagar">🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;
}

function openGalleryModal() {
  showModal(`
    <h3>🖼️ Adicionar Foto</h3>
    <div class="form-group">
      <label>Descrição</label>
      <input type="text" id="m-gallery-desc">
    </div>
    <div class="form-group">
      <label>Categoria</label>
      <select id="m-gallery-cat">
        <option value="geral">Geral</option>
        <option value="lobitos">Lobitos</option>
        <option value="exploradores">Exploradores</option>
        <option value="pioneiros">Pioneiros</option>
        <option value="caminheiros">Caminheiros</option>
        <option value="acampamento">Acampamento</option>
        <option value="evento">Evento</option>
        <option value="recrutamento">Recrutamento</option>
        <option value="cancioneiro">Cancioneiro</option>
        <option value="visitantes">Visitantes / Postais</option>
        <option value="caixatempo">Caixa do Tempo (Arquivo)</option>
      </select>
    </div>
    <div class="form-group">
      <label>Opção 1: Upload de Ficheiro (Recomendado)</label>
      <input type="file" id="m-gallery-file" accept="image/*">
      <small style="color: var(--text-muted); font-size: 0.75rem;">A foto será enviada para o seu GitHub.</small>
    </div>
    <div style="text-align: center; margin: 1rem 0; color: var(--text-muted); font-size: 0.8rem;">— OU —</div>
    <div class="form-group">
      <label>Opção 2: URL da Imagem (Externo)</label>
      <input type="url" id="m-gallery-url" placeholder="https://...">
    </div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
      <button class="btn-save" id="btn-save-gallery" onclick="saveGalleryItem()">Guardar</button>
    </div>

  `);
}

async function saveGalleryItem() {
  const fileInput = document.getElementById('m-gallery-file');
  const urlInput = document.getElementById('m-gallery-url');
  const desc = document.getElementById('m-gallery-desc').value;
  const cat = document.getElementById('m-gallery-cat').value;
  const btn = document.getElementById('btn-save-gallery');

  let finalUrl = urlInput.value;

  // If a file is selected, upload to GitHub first
  if (fileInput.files.length > 0) {
    btn.disabled = true;
    btn.textContent = 'A carregar...';
    try {
      const result = await uploadToGitHub(fileInput.files[0]);
      finalUrl = result.url; // Use the local path
      showToast('🚀 Imagem enviada para o GitHub!');
    } catch (err) {
      alert('Erro no upload: ' + err.message);
      btn.disabled = false;
      btn.textContent = 'Guardar';
      return;
    }
  }

  if (!finalUrl) {
    alert('Por favor, selecione um ficheiro ou insira um URL.');
    return;
  }

  const gallery = getStore('agr439-admin-gallery');
  gallery.push({
    id: generateId(),
    description: desc,
    category: cat,
    url: finalUrl,
    approved: true,
    date: new Date().toISOString(),
  });
  
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
  if (!confirm('Apagar esta foto?')) return;
  const gallery = getStore('agr439-admin-gallery').filter(g => g.id !== id);
  setStore('agr439-admin-gallery', gallery);
  showToast('🗑️ Foto apagada.');
  renderGalleryCRUD(document.getElementById('admin-content'));
}

// ---------- PAGES CRUD ----------
function renderPagesCRUD(container) {
  const pages = getStore('agr439-admin-pages');

  const defaultPages = [
    { id: 'hero', label: 'Hero / Banner', key: 'hero_subtitle' },
    { id: 'about', label: 'Sobre o Agrupamento', key: 'footer_desc' },
  ];

  container.innerHTML = `
    <div class="admin-table-container">
      <div class="admin-table-header">
        <h3>Conteúdo Editável</h3>
      </div>
      <table class="admin-table">
        <thead>
          <tr><th>Secção</th><th>Conteúdo Atual</th><th>Ações</th></tr>
        </thead>
        <tbody>
          ${defaultPages.map(p => {
            const custom = pages.find(pg => pg.id === p.id);
            return `
              <tr>
                <td><strong>${p.label}</strong></td>
                <td>${custom ? esc(custom.content.substring(0, 80)) + '…' : '<em>Padrão</em>'}</td>
                <td><button class="action-btn edit" onclick="openPageModal('${p.id}', '${p.label}')" title="Editar">✏️</button></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function openPageModal(pageId, label) {
  const pages = getStore('agr439-admin-pages');
  const existing = pages.find(p => p.id === pageId);

  showModal(`
    <h3>✏️ Editar: ${label}</h3>
    <div class="form-group">
      <label>Conteúdo (PT)</label>
      <textarea id="m-page-content-pt" rows="4">${existing ? esc(existing.content) : ''}</textarea>
    </div>
    <div class="form-group">
      <label>Conteúdo (EN)</label>
      <textarea id="m-page-content-en" rows="4">${existing ? esc(existing.contentEn || '') : ''}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
      <button class="btn-save" onclick="savePage('${pageId}')">Guardar</button>
    </div>
  `);
}

function savePage(pageId) {
  const pages = getStore('agr439-admin-pages');
  const idx = pages.findIndex(p => p.id === pageId);
  const data = {
    id: pageId,
    content: document.getElementById('m-page-content-pt').value,
    contentEn: document.getElementById('m-page-content-en').value,
  };

  if (idx >= 0) {
    pages[idx] = data;
  } else {
    pages.push(data);
  }

  setStore('agr439-admin-pages', pages);
  closeModal();
  showToast('✅ Conteúdo guardado!');
  renderPagesCRUD(document.getElementById('admin-content'));
}

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
  if (!confirm('Apagar esta música do cancioneiro?')) return;
  const songs = getStore('agr439-admin-songs').filter(s => s.id !== id);
  setStore('agr439-admin-songs', songs);
  showToast('🗑️ Música removida.');
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
        <button class="btn btn-outline btn-sm" onclick="openImagePicker(url => document.getElementById('m-visit-image').value = url)">🖼️ Galeria</button>
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
  if (!confirm('Apagar este registo de visita?')) return;
  const visits = getStore('agr439-admin-visits').filter(v => v.id !== id);
  setStore('agr439-admin-visits', visits);
  showToast('🗑️ Registo removido.');
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
                <td><img src="${p.imageUrl}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;"></td>
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
      <label>Imagem (Recorte de Jornal / Foto Antiga)</label>
      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <input type="text" id="m-archive-img" value="${item ? esc(item.imageUrl || '') : ''}" placeholder="https://..." style="flex: 1;">
        <button class="btn btn-outline btn-sm" onclick="openImagePicker(url => document.getElementById('m-archive-img').value = url)">🖼️ Escolher</button>
      </div>
      <small style="color: var(--text-muted); font-size: 0.75rem;">Link da imagem ou escolha da galeria.</small>
    </div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
      <button class="btn-save" onclick="saveCaixaTempoItem('${id || ''}')">Guardar</button>
    </div>
  `);
}

function saveCaixaTempoItem(id) {
  const items = getStore('agr439-admin-caixa-tempo');
  const data = {
    id: id || generateId(),
    title: document.getElementById('m-archive-title').value,
    year: document.getElementById('m-archive-year').value,
    category: document.getElementById('m-archive-cat').value,
    description: document.getElementById('m-archive-desc').value,
    imageUrl: document.getElementById('m-archive-img').value,
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
  const items = getStore('agr439-admin-caixa-tempo').filter(n => n.id !== id);
  setStore('agr439-admin-caixa-tempo', items);
  showToast('🗑️ Recorte apagado.');
  renderCaixaTempoCRUD(document.getElementById('admin-content'));
}

// ---------- MODAL HELPERS ----------
function showModal(content) {
  let overlay = document.getElementById('modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<div class="modal" id="modal-body"></div>';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  document.getElementById('modal-body').innerHTML = content;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay')?.classList.remove('active');
  document.body.style.overflow = '';
}


// ---------- SETTINGS & GITHUB API ----------
function renderSettings(container) {
  const config = getGitHubConfig();

  container.innerHTML = `
    <div class="admin-table-container" style="max-width: 600px;">
      <div class="admin-table-header">
        <h3>🚀 Configuração GitHub API</h3>
      </div>
      <div style="padding: 1.5rem;">
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">
          Configure as credenciais para permitir o upload direto de imagens para o repositório. 
          O Token é guardado apenas no seu navegador.
        </p>
        
        <div class="form-group">
          <label>GitHub Personal Access Token (PAT)</label>
          <input type="password" id="gh-token" value="${config.token || ''}" placeholder="ghp_xxxxxxxxxxxx">
          <small style="color: var(--text-muted); font-size: 0.75rem;">Crie um token com permissão 'contents: write' no GitHub.</small>
        </div>
        
        <div class="form-group">
          <label>Utilizador GitHub (Owner)</label>
          <input type="text" id="gh-owner" value="${config.owner || ''}" placeholder="ex: OTeuUser">
        </div>
        
        <div class="form-group">
          <label>Nome do Repositório</label>
          <input type="text" id="gh-repo" value="${config.repo || ''}" placeholder="ex: Escuteiros">
        </div>
        
        <div class="form-group">
          <label>Branch</label>
          <input type="text" id="gh-branch" value="${config.branch || 'main'}" placeholder="main">
        </div>

        <div style="margin-top: 2rem;">
          <button class="btn btn-primary" onclick="saveGitHubSettings()">Guardar Configurações</button>
        </div>
      </div>
    </div>
  `;
}

function getGitHubConfig() {
  const saved = localStorage.getItem('agr439-gh-config');
  return saved ? JSON.parse(saved) : { owner: '', repo: '', branch: 'main', token: '' };
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
    const err = await response.json();
    throw new Error(err.message || 'Erro no upload para o GitHub');
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
  let modal = document.getElementById('modal-overlay');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-overlay';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `<div class="modal">${html}</div>`;
  modal.classList.add('active');
  modal.onclick = (e) => { if(e.target === modal) closeModal(); };
}

function closeModal() {
  const modal = document.getElementById('modal-overlay');
  if (modal) modal.classList.remove('active');
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
                <button class="btn btn-outline btn-sm" onclick="openImagePicker(url => { document.getElementById('rec-flyer-url').value = url; updateRecPreview('flyer-preview', url); })">🖼️ Galeria</button>
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
                <button class="btn btn-outline btn-sm" onclick="openImagePicker(url => { document.getElementById('rec-header-url').value = url; updateRecPreview('header-preview', url); })">🖼️ Galeria</button>
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
                  <button class="btn btn-outline btn-sm" onclick="openImagePicker(url => { document.getElementById('rec-pdf-img-url').value = url; updateRecPreview('pdf-preview', url); })">🖼️ Galeria</button>
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


// ---------- MEDIA PICKER MODAL ----------
function openImagePicker(onSelect) {
  const gallery = getStore('agr439-admin-gallery');
  let selectedUrl = '';

  const html = `
    <h3>🖼️ Selecionar Imagem</h3>
    <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">
      Escolha uma imagem da sua galeria.
    </p>
    
    <div class="media-picker-grid" id="picker-grid">
      ${gallery.map(g => `
        <div class="media-picker-item" onclick="selectPickerImage(this, '${g.url}')">
          <img src="${g.url}" alt="${esc(g.description)}">
          <div class="check">✓</div>
        </div>
      `).join('')}
      ${gallery.length === 0 ? '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">A galeria está vazia.</p>' : ''}
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
  });
}

function renderHeroStatsEditor(container) {
  const data = JSON.parse(localStorage.getItem('agr439-admin-hero-stats')) || {
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
    <div class="admin-card reveal">
      <h3>✨ Destaques da Página Inicial</h3>
      <p style="margin-bottom:1.5rem; color:var(--text-secondary);">Configure os textos principais e os valores das estatísticas que aparecem no topo do site.</p>
      
      <form id="hero-stats-form" onsubmit="event.preventDefault(); saveHeroStats();">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
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

  // Update preview on URL change
  document.getElementById('h-icon').addEventListener('input', e => {
     document.getElementById('h-icon-preview').src = e.target.value;
  });

  window.saveHeroStats = () => {
    const newData = {
      icon: document.getElementById('h-icon').value,
      title1: document.getElementById('h-title1').value,
      title2: document.getElementById('h-title2').value,
      subtitle: document.getElementById('h-subtitle').value,
      years: parseInt(document.getElementById('h-years').value),
      scouts: parseInt(document.getElementById('h-scouts').value),
      camps: parseInt(document.getElementById('h-camps').value),
      nights: parseInt(document.getElementById('h-nights').value)
    };
    localStorage.setItem('agr439-admin-hero-stats', JSON.stringify(newData));
    alert('✅ Configurações salvas com sucesso! A página inicial foi atualizada.');
  };

  window.openHeroIconPicker = () => {
    openImagePicker(url => {
      document.getElementById('h-icon').value = url;
      document.getElementById('h-icon-preview').src = url;
    });
  };
}

function toggleSidebar() {
  document.querySelector('.admin-sidebar')?.classList.toggle('open');
}


