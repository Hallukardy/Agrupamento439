# Roadmap: Agrupamento 439 — Intelligent Scout Hub

Este roadmap delineia a evolução do site do Agrupamento 439, desde a sua fundação até à integração de funcionalidades de IA de nível profissional.

## Milestone 1: Fundação e Chat Básico (Concluído)
*Objetivo: Estabelecer a presença digital e uma interface de comunicação inicial com IA.*

- [x] **Estrutura Core:** Desenvolvimento do site base com HTML5, CSS3 e JS Vanilla.
- [x] **Módulo de Chatbot:** Interface de chat integrada e responsiva.
- [x] **Gateway de IA (Dual-Mode):** Suporte para chaves locais (localStorage) e modo produção.
- [x] **RAG Estático (V1):** Sistema de busca baseado em inclusão de palavras-chave em dados do site.
- [x] **Tratamento de Erros:** Mapeamento de erros de API (401, 402, 429) em Português.

## Milestone 2: Inteligência Avançada e UX (Concluído)
*Objetivo: Elevar a experiência do utilizador e a precisão das respostas utilizando padrões de arquitetura agentica.*

### 1. Experiência em Tempo Real (UX)
- [x] **Streaming de Respostas:** Implementado via `ReadableStream` com processamento de chunks para feedback instantâneo.
- [x] **Slash Commands:** Suporte para `/calendario`, `/secretaria` e `/reset` integrado.
- [x] **Persistência de Sessão:** Histórico de conversa mantido via `IndexedDB` entre navegações.

### 2. Inteligência e Precisão (Core)
- [x] **Planner Agent:** Camada de triagem que classifica a intenção (Notícias, Eventos, História) para otimizar o contexto.
- [x] **RAG Semântico (V2):** Algoritmo de scoring melhorado com pesos para títulos e correspondência exata.
- [x] **Contexto Dinâmico:** Deteção automática da página atual e inserção no system prompt.

### 3. Resiliência e Infraestrutura
- [x] **Multi-Provider Fallback:** Cascata inteligente (Gemini → OpenAI → Groq → Local) em caso de falha.
- [x] **Gestão de Quotas:** Sistema de lockout temporário para provedores com erro 429.
- [x] **Segurança de Dados:** Criptografia AES-GCM 256-bit para todas as chaves guardadas localmente.

---

## Milestone 3: Automação e Integração (Futuro)
- [ ] **Integração com Secretaria:** Possibilidade de agendar reuniões ou pedir documentos via chat.
- [ ] **Dashboard Admin:** Interface para gerir o índice de conhecimento do site sem mexer no código.
- [ ] **Suporte Multi-língua Dinâmico:** Deteção automática de idioma e ajuste de tom.
