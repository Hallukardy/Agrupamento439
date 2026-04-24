/* ============================================================
   CHATBOT LOGIC — AGRUPAMENTO 439
   ============================================================ */

const chatWindow = document.getElementById('aiBotWindow');
const chatMessages = document.getElementById('aiBotMessages');
const chatInput = document.getElementById('aiBotInput');

let chatHistory = [
  { role: 'system', content: 'És o assistente inteligente do Agrupamento 439 (São João Baptista de Vila do Conde). Responde de forma amigável, útil e sempre em português de Portugal. Utiliza o contexto fornecido para responder sobre notícias, eventos e história do agrupamento. Se não souberes algo, sugere que contactem a secretaria.' }
];

function toggleChatbot() {
  chatWindow.classList.toggle('open');
  if (chatWindow.classList.contains('open')) {
    chatInput.focus();
  }
}

async function sendChatbotMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  // Add User Message
  appendMessage('user', text);
  chatInput.value = '';
  
  // Show Loading state
  const loadingId = appendMessage('bot', 'A pensar...', true);

  try {
    // 1. Search Context (RAG)
    const context = window.AI.search(text);
    
    // 2. Prepare Messages
    const promptMessages = [
      ...chatHistory,
      { role: 'user', content: `Contexto do site:\n${context || 'Nenhum contexto específico encontrado.'}\n\nPergunta: ${text}` }
    ];

    // 3. Get Completion
    const response = await window.AI.complete(promptMessages);
    
    // 4. Update UI
    removeLoading(loadingId);
    appendMessage('bot', response);
    
    // 5. Update History
    chatHistory.push({ role: 'user', content: text });
    chatHistory.push({ role: 'assistant', content: response });
    
    // Keep history manageable
    if (chatHistory.length > 7) chatHistory.splice(1, 2);

  } catch (err) {
    removeLoading(loadingId);
    appendMessage('bot', 'Desculpa, ocorreu um erro ao ligar ao cérebro da IA. Verifica as configurações no painel admin.');
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

function removeLoading(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// Global exposure
window.toggleChatbot = toggleChatbot;
window.sendChatbotMessage = sendChatbotMessage;
