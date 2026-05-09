/* ============================================================
   CHATBOT LOGIC — AGRUPAMENTO 439
   ============================================================ */

const chatWindow = document.getElementById('aiBotWindow');
const chatMessages = document.getElementById('aiBotMessages');
const chatInput = document.getElementById('aiBotInput');

let chatHistory = [
  { role: 'system', content: 'És o assistente inteligente do Agrupamento 439 (São João Baptista de Vila do Conde). Responde de forma amigável, útil e sempre em português de Portugal. Utiliza o contexto fornecido para responder sobre notícias, eventos e história do agrupamento. Se não souberes algo, sugere que contactem a secretaria.' }
];

/**
 * PERSISTENCE (IndexedDB)
 */
const DB_NAME = 'Agr439ChatDB';
const STORE_NAME = 'messages';

async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

async function saveChatHistory() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.clear();
  // Don't save system prompt
  const toSave = chatHistory.filter(m => m.role !== 'system');
  for (const msg of toSave) {
    store.add(msg);
  }
}

async function loadChatHistory() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const request = store.getAll();
  return new Promise((resolve) => {
    request.onsuccess = () => {
      const msgs = request.result;
      if (msgs.length > 0) {
        chatHistory = [chatHistory[0], ...msgs];
        renderHistory();
      }
      resolve();
    };
  });
}

function renderHistory() {
  chatMessages.innerHTML = '';
  chatHistory.forEach(msg => {
    if (msg.role !== 'system') {
      appendMessage(msg.role, msg.content);
    }
  });
}

/**
 * UI & INTERACTION
 */
function toggleChatbot() {
  chatWindow.classList.toggle('open');
  if (chatWindow.classList.contains('open')) {
    chatInput.focus();
  }
}

// Slash Commands
const SLASH_COMMANDS = {
  '/calendario': async () => {
    const res = await fetch('data/site-data.json');
    const data = await res.json();
    const events = data.events.slice(0, 3).map(e => `• **${e.title}**: ${e.date}`).join('\n');
    return `📅 **Próximos Eventos:**\n${events || 'Sem eventos próximos.'}`;
  },
  '/secretaria': () => {
    return `🏢 **Contactos da Secretaria:**\n• Email: geral@agrupamento439.pt\n• Horário: 2ª a 6ª, 09:00 - 18:00.`;
  },
  '/reset': async () => {
    chatHistory = [chatHistory[0]];
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.objectStore(STORE_NAME).clear();
    chatMessages.innerHTML = '';
    return '🧹 Histórico limpo com sucesso!';
  }
};

async function sendChatbotMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  // Add User Message
  appendMessage('user', text);
  chatInput.value = '';
  
  // 1. Check Slash Commands
  if (text.startsWith('/')) {
    const cmd = text.split(' ')[0];
    if (SLASH_COMMANDS[cmd]) {
      const response = await SLASH_COMMANDS[cmd]();
      appendMessage('bot', response);
      return;
    }
  }

  // Show Loading state
  const loadingId = appendMessage('bot', '<span class="typing-dots"></span>', true);
  const botMsgDiv = document.getElementById(loadingId);

  try {
    // 2. Dynamic Context (Current Page)
    const pageContext = `Utilizador está na página: ${document.title}.`;
    
    // 3. Planner Agent: Classify Intent
    const intent = await window.AI.classify(text);
    console.log(`[Chatbot] Intent classified as: ${intent}`);
    
    // 4. Search Context (RAG)
    // Adjust search based on intent
    const siteContext = window.AI.search(text, intent === 'general' ? 3 : 5);
    
    // 5. Prepare Messages
    const promptMessages = [
      ...chatHistory,
      { role: 'user', content: `Intenção: ${intent}\nPágina atual: ${pageContext}\nContexto do site:\n${siteContext || 'Nenhum contexto específico.'}\n\nPergunta: ${text}` }
    ];

    // 5. Get Completion (Streaming)
    let fullResponse = '';
    botMsgDiv.innerHTML = ''; // Clear loading dots
    
    await window.AI.complete(promptMessages, {
      stream: true,
      onChunk: (chunk, full) => {
        fullResponse = full;
        botMsgDiv.innerHTML = fullResponse.replace(/\n/g, '<br>');
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    });
    
    // 6. Update History
    chatHistory.push({ role: 'user', content: text });
    chatHistory.push({ role: 'assistant', content: fullResponse });
    
    // Keep history manageable
    if (chatHistory.length > 9) chatHistory.splice(1, 2);
    
    saveChatHistory();

  } catch (err) {
    botMsgDiv.innerHTML = 'Desculpa, ocorreu um erro ao ligar ao cérebro da IA. Verifica as configurações no painel admin.';
    console.error('Chatbot Error:', err);
  }
}

function appendMessage(role, text, isLoading = false) {
  const id = 'msg-' + Date.now();
  const div = document.createElement('div');
  div.className = `message ${role}`;
  div.id = id;
  div.innerHTML = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return id;
}

// Global exposure
window.toggleChatbot = toggleChatbot;
window.sendChatbotMessage = sendChatbotMessage;

// Init
document.addEventListener('DOMContentLoaded', loadChatHistory);
