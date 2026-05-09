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
/**
 * Core AI Completion Function with Fallback & Resilience
 */
async function getAICompletion(messages, options = {}) {
  const mode = AI_CONFIG.getMode();
  if (mode === 'local') return await callAI(AI_CONFIG.getLocalUrl(), null, messages, options);

  const primaryProvider = AI_CONFIG.getProvider();
  const fallbackChain = ['gemini', 'openai', 'groq', 'deepseek'].filter(p => p !== primaryProvider);
  const providersToTry = [primaryProvider, ...fallbackChain];

  for (const providerKey of providersToTry) {
    // Check for Quota Lockout
    const lockout = localStorage.getItem(`agr439-lockout-${providerKey}`);
    if (lockout && Date.now() < parseInt(lockout)) {
      console.warn(`[AI Service] Provider ${providerKey} is in lockout. Skipping...`);
      continue;
    }

    try {
      const provider = AI_CONFIG.providers[providerKey];
      if (!provider) continue;

      const apiKey = await getProviderApiKey(providerKey);
      if (!apiKey) continue;

      console.log(`[AI Service] Attempting with ${provider.name}...`);
      return await callAI(provider.url, apiKey, messages, { ...options, providerKey });
    } catch (err) {
      console.error(`[AI Service] Error with ${providerKey}:`, err);
      
      // If it's a 429, set a 1-minute lockout
      if (err.message.includes('429') || err.message.includes('Limite')) {
        localStorage.setItem(`agr439-lockout-${providerKey}`, Date.now() + 60000);
      }
      
      // Continue to next provider in chain
      continue;
    }
  }

  throw new Error("Todos os provedores de IA falharam ou estão sem quota. Tente novamente mais tarde.");
}

async function getProviderApiKey(key) {
  // If it's the primary provider, use the secure one. 
  // For others, we might want to check for specific keys, but for now we use the same or check if defined.
  // In a real app, each provider would have its own key.
  const primary = AI_CONFIG.getProvider();
  if (key === primary) return await AI_CONFIG.getApiKey();
  
  // Fallback check: maybe we have other keys? (Future enhancement)
  // For now, only fallback if we have a key or if it's openrouter/together with the same key
  return await AI_CONFIG.getApiKey(); 
}

/**
 * Low-level Fetch Call
 */
async function callAI(url, apiKey, messages, options) {
  const isStream = options.stream || false;
  const providerKey = options.providerKey;

  let headers = { 'Content-Type': 'application/json' };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
    if (providerKey === 'anthropic') {
       headers['x-api-key'] = apiKey;
       headers['anthropic-version'] = '2023-06-01';
       delete headers.Authorization;
    }
  }

  const body = JSON.stringify({
    model: AI_CONFIG.providers[providerKey]?.model || options.model || 'gpt-4o',
    messages: messages,
    max_tokens: options.max_tokens || 1000,
    stream: isStream
  });

  const res = await fetch(url, { method: 'POST', headers, body });
  
  if (!res.ok) {
    const errorMsg = AI_ERRORS[res.status] || AI_ERRORS.Default;
    throw new Error(`${res.status}: ${errorMsg}`);
  }

  // Handle Streaming
  if (isStream && options.onChunk) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.trim() === '' || line.trim() === 'data: [DONE]') continue;
        
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.substring(6));
            const content = data.choices?.[0]?.delta?.content || '';
            if (content) {
              fullText += content;
              options.onChunk(content, fullText);
            }
          } catch (e) {
            // Ignore minor parse errors in stream
          }
        }
      }
    }
    return fullText;
  }

  const data = await res.json();
  if (data.choices && data.choices[0]) return data.choices[0].message.content;
  if (data.content && data.content[0]) return data.content[0].text; 
  return JSON.stringify(data);
}

/**
 * Planner Agent: Intent Classification
 */
async function classifyIntent(query) {
  // Simple keyword-based classifier to save tokens, but could use a tiny AI call
  const q = query.toLowerCase();
  if (q.includes('evento') || q.includes('calendario') || q.includes('quando')) return 'events';
  if (q.includes('historia') || q.includes('fundação') || q.includes('antigamente')) return 'history';
  if (q.includes('noticia') || q.includes('novidades') || q.includes('aconteceu')) return 'news';
  return 'general';
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

function searchSiteData(query, topK = 4) {
  if (!siteDataIndex.length) return "";

  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(w => w.length > 2);
  
  const scored = siteDataIndex.map(chunk => {
    let score = 0;
    const text = chunk.text.toLowerCase();
    
    // Exact match boost
    if (text.includes(q)) score += 5;
    
    // Keyword match
    words.forEach(w => {
      if (text.includes(w)) {
        score += 1;
        // Boost if word is in title
        if (chunk.title.toLowerCase().includes(w)) score += 2;
      }
    });
    
    // Recency boost (optional - if year is present)
    if (chunk.type === 'Notícia' || chunk.type === 'Evento') score += 1;

    return { ...chunk, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(c => c.score > 1) // Higher threshold for V2
    .map(c => `[Contexto: ${c.type}] ${c.text}`)
    .join('\n\n');
}

// Global exposure
window.AI = {
  complete: getAICompletion,
  search: searchSiteData,
  init: initAIService,
  classify: classifyIntent, // Planner Agent
  config: AI_CONFIG,
  testConnection: async () => {
    return await getAICompletion([{ role: 'user', content: 'Responde apenas "OK" se receberes isto.' }], { max_tokens: 10 });
  }
};

document.addEventListener('DOMContentLoaded', initAIService);
