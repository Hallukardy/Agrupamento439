/* ============================================================
   AI SERVICE — AGRUPAMENTO 439
   Dual-Mode Gateway (Portal_AI vs. Production) + Simple RAG
   ============================================================ */

/**
 * AI Error Mapping (Portuguese)
 */
const AI_ERRORS = {
  401: "Erro de Autenticação: Sua Chave API parece ser inválida ou expirou. Verifique nas definições.",
  402: "Créditos Insuficientes: A conta do provedor de AI (OpenAI/Gemini/etc) está sem saldo ou atingiu o limite.",
  429: "Limite de Frequência: Muitas requisições em pouco tempo. Aguarde um momento e tente novamente.",
  Default: "Erro na AI: Ocorreu um problema ao comunicar com o servidor. Tente novamente mais tarde."
};

const AI_CONFIG = {
  getMode: () => localStorage.getItem('agr439-ai-mode') || 'local',
  getProvider: () => localStorage.getItem('agr439-ai-provider') || 'openai',
  getApiKey: async () => {
    const encrypted = localStorage.getItem('agr439-ai-apikey-secure');
    if (!encrypted) return '';
    if (typeof window.Security !== 'undefined') {
       return await window.Security.decrypt(encrypted);
    }
    return '';
  },
  getLocalUrl: () => 'http://localhost:1111/v1/chat/completions',
  
  providers: {
    openai: { name: 'OpenAI', url: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o' },
    gemini: { name: 'Google Gemini', url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', model: 'gemini-2.0-flash' },
    anthropic: { name: 'Anthropic Claude', url: 'https://api.anthropic.com/v1/messages', model: 'claude-3-5-sonnet-20240620' },
    groq: { name: 'Groq (Llama 3)', url: 'https://api.groq.com/openai/v1/chat/completions', model: 'llama-3.3-70b-versatile' },
    mistral: { name: 'Mistral AI', url: 'https://api.mistral.ai/v1/chat/completions', model: 'mistral-large-latest' },
    perplexity: { name: 'Perplexity', url: 'https://api.perplexity.ai/chat/completions', model: 'llama-3.1-sonar-large-128k-online' },
    deepseek: { name: 'DeepSeek', url: 'https://api.deepseek.com/chat/completions', model: 'deepseek-chat' },
    together: { name: 'Together AI', url: 'https://api.together.xyz/v1/chat/completions', model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo' },
    openrouter: { name: 'OpenRouter', url: 'https://openrouter.ai/api/v1/chat/completions', model: 'auto' },
    cohere: { name: 'Cohere', url: 'https://api.cohere.ai/v1/chat', model: 'command-r-plus' }
  }
};

/**
 * Core AI Completion Function
 */
async function getAICompletion(messages, options = {}) {
  const mode = AI_CONFIG.getMode();
  const providerKey = AI_CONFIG.getProvider();
  const provider = AI_CONFIG.providers[providerKey];
  const apiKey = await AI_CONFIG.getApiKey();

  let url, headers, body;

  if (mode === 'local') {
    url = AI_CONFIG.getLocalUrl();
    headers = { 'Content-Type': 'application/json' };
    body = JSON.stringify({
      model: options.model || 'gpt-4o', 
      messages: messages,
      stream: false
    });
  } else {
    if (!apiKey) throw new Error('Chave API não configurada para o Modo Produção.');
    url = provider.url;
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
    
    if (providerKey === 'anthropic') {
       headers['x-api-key'] = apiKey;
       headers['anthropic-version'] = '2023-06-01';
       delete headers.Authorization;
    }

    body = JSON.stringify({
      model: provider.model,
      messages: messages,
      max_tokens: options.max_tokens || 1000
    });
  }

  try {
    const res = await fetch(url, { method: 'POST', headers, body });
    
    if (!res.ok) {
      const errorMsg = AI_ERRORS[res.status] || AI_ERRORS.Default;
      const detail = await res.json().catch(() => ({}));
      throw new Error(`${errorMsg} (Detalhe: ${detail.error?.message || res.statusText})`);
    }

    const data = await res.json();
    if (data.choices && data.choices[0]) return data.choices[0].message.content;
    if (data.content && data.content[0]) return data.content[0].text; 
    return JSON.stringify(data);
  } catch (err) {
    console.error('AI Completion Error:', err);
    throw err;
  }
}

/**
 * Simple RAG System
 * Chunks site-data.json and performs basic keyword/similarity search
 */
let siteDataIndex = [];

async function initAIService() {
  // Load site data for indexing
  try {
    const res = await fetch('data/site-data.json');
    if (res.ok) {
      const data = await res.json();
      buildSiteIndex(data);
    }
  } catch (e) {
    console.warn('Could not index site-data.json for RAG:', e);
  }
}

function buildSiteIndex(data) {
  siteDataIndex = [];
  
  // Index News
  if (data.news) {
    data.news.forEach(n => {
      siteDataIndex.push({ 
        type: 'Notícia', 
        title: n.title, 
        content: n.content, 
        text: `Notícia: ${n.title}. ${n.content}` 
      });
    });
  }

  // Index Events
  if (data.events) {
    data.events.forEach(e => {
      siteDataIndex.push({ 
        type: 'Evento', 
        title: e.title, 
        content: e.description, 
        text: `Evento: ${e.title} em ${e.date}. ${e.description}` 
      });
    });
  }

  // Index History
  if (data.timeline) {
    data.timeline.forEach(t => {
      const itemsText = t.items ? t.items.map(i => i.title + ': ' + i.description).join(' ') : '';
      siteDataIndex.push({ 
        type: 'História', 
        title: t.year, 
        content: t.title, 
        text: `História (${t.year}): ${t.title}. ${itemsText}` 
      });
    });
  }

  console.log(`[AI Service] Indexed ${siteDataIndex.length} chunks for RAG.`);
}

function searchSiteData(query, topK = 3) {
  if (!siteDataIndex.length) return "";

  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const scored = siteDataIndex.map(chunk => {
    let score = 0;
    words.forEach(w => {
      if (chunk.text.toLowerCase().includes(w)) score++;
    });
    return { ...chunk, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(c => c.score > 0)
    .map(c => `[Contexto: ${c.type}] ${c.text}`)
    .join('\n\n');
}

// Global exposure
window.AI = {
  complete: getAICompletion,
  search: searchSiteData,
  init: initAIService,
  config: AI_CONFIG,
  testConnection: async () => {
    return await getAICompletion([{ role: 'user', content: 'Responde apenas "OK" se receberes isto.' }], { max_tokens: 10 });
  }
};

document.addEventListener('DOMContentLoaded', initAIService);
