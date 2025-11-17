# Roadmap - D&D 5e Character Manager

## Fase 1: Criação Básica de Personagem ✅ CONCLUÍDO
- [x] Wizard de 4 etapas (nome, atributos, raça, classe)
- [x] Integração com D&D 5e API 2014
- [x] Interface responsiva com Tailwind CSS
- [x] Docker + docker-compose
- [x] Resumo final do personagem

---

## Fase 2: Identidade Visual & Layout Principal 🎨 EM ANDAMENTO

### 2.1 Sistema de Cores D&D
- [ ] Definir paleta de cores D&D
  - Vermelho D&D como accent (#E31F1F ou similar, levemente mais escuro)
  - Fundo escuro sólido (#0F0F0F ou #1A1A1A)
  - Tons de cinza para contraste
  - Variantes de vermelho para hover/active
- [ ] Atualizar tema do Tailwind CSS
- [ ] Criar variáveis CSS customizadas

### 2.2 Layout Principal
- [ ] **Barra Lateral (Sidebar)**
  - [ ] Dropdown "Personagens" com lista de personagens criados
  - [ ] Botão "Criar Novo Personagem"
  - [ ] Logo/título da aplicação
  - [ ] Responsivo (collapse em mobile)

- [ ] **Barra Superior (Top Bar)**
  - [ ] Sistema de abas:
    - [ ] Aba "Resumo" (ficha resumida)
    - [ ] Aba "Habilidades" (skills, proficiências, traits)
    - [ ] Aba "Itens" (inventário, equipamento)
    - [ ] Aba "Magias" (para classes conjuradoras)
  - [ ] Breadcrumb/indicador do personagem atual

- [ ] **Área de Conteúdo Principal**
  - [ ] Container responsivo para as abas
  - [ ] Layout consistente entre todas as abas

### 2.3 Componentes UI Atualizados
- [ ] Redesenhar componentes com nova paleta
- [ ] Criar componente Sidebar
- [ ] Criar componente TabBar
- [ ] Criar componente Dropdown
- [ ] Transições e animações suaves

---

## Fase 3: Banco de Dados PostgreSQL 🗄️

### 3.1 Configuração do Banco
- [ ] Adicionar PostgreSQL ao docker-compose.yml
- [ ] Criar schema SQL para:
  - [ ] Tabela `characters` (personagens)
  - [ ] Tabela `ability_scores` (atributos)
  - [ ] Tabela `character_races` (dados da raça)
  - [ ] Tabela `character_classes` (dados da classe)
  - [ ] Tabela `items` (inventário)
  - [ ] Tabela `spells` (magias conhecidas/preparadas)
- [ ] Scripts de migração/seed

### 3.2 Backend API
- [ ] Configurar ORM (Drizzle ou Prisma)
- [ ] Criar endpoints REST ou tRPC:
  - [ ] `GET /api/characters` - Listar personagens
  - [ ] `GET /api/characters/:id` - Obter personagem
  - [ ] `POST /api/characters` - Criar personagem
  - [ ] `PUT /api/characters/:id` - Atualizar personagem
  - [ ] `DELETE /api/characters/:id` - Deletar personagem
- [ ] Validação de dados com Zod

### 3.3 Integração Frontend
- [ ] Atualizar character store para usar API
- [ ] Implementar loading states
- [ ] Tratamento de erros
- [ ] Cache otimizado

---

## Fase 4: Sistema de Múltiplos Personagens 👥

### 4.1 Lista de Personagens
- [ ] Página/sidebar com lista de todos os personagens
- [ ] Card visual para cada personagem (mini ficha)
- [ ] Filtros e busca
- [ ] Ordenação (por nome, nível, classe, etc)

### 4.2 Seleção de Personagem
- [ ] Dropdown funcional na sidebar
- [ ] Navegação entre personagens
- [ ] Estado global do personagem ativo

### 4.3 CRUD Completo
- [ ] Criar novo personagem (wizard existente)
- [ ] Editar personagem existente
- [ ] Duplicar personagem
- [ ] Deletar personagem (com confirmação)

---

## Fase 5: Fichas Detalhadas por Aba 📋

### 5.1 Aba "Resumo"
- [ ] Informações básicas (nome, raça, classe, nível)
- [ ] Atributos com modificadores
- [ ] HP, AC, Iniciativa, Velocidade
- [ ] Testes de resistência
- [ ] Proficiências
- [ ] Características raciais
- [ ] Características de classe

### 5.2 Aba "Habilidades"
- [ ] Lista de skills com modificadores
- [ ] Proficiências em ferramentas
- [ ] Idiomas conhecidos
- [ ] Feats/Talentos
- [ ] Ações especiais

### 5.3 Aba "Itens"
- [ ] Sistema de inventário
- [ ] Equipamento equipado vs guardado
- [ ] Peso total / capacidade de carga
- [ ] Moedas (CP, SP, EP, GP, PP)
- [ ] Adicionar/remover itens
- [ ] Integração com API de equipamentos D&D

### 5.4 Aba "Magias"
- [ ] Lista de magias conhecidas
- [ ] Magias preparadas (se aplicável)
- [ ] Espaços de magia por nível
- [ ] Detalhes de cada magia (descrição, componentes, etc)
- [ ] Filtros por nível, escola, ritual
- [ ] Integração com API de spells D&D

---

## Fase 6: Melhorias e Features Avançadas 🚀

### 6.1 Sistema de Níveis
- [ ] Progressão de nível
- [ ] Ganho de HP
- [ ] Novas proficiências
- [ ] ASI (Ability Score Improvement)
- [ ] Novas magias/habilidades

### 6.2 Combate e Gameplay
- [ ] Tracker de HP atual
- [ ] Pontos de vida temporários
- [ ] Condições (envenenado, paralisado, etc)
- [ ] Rastreador de espaços de magia
- [ ] Death saves
- [ ] Descansos (curto/longo)

### 6.3 Personalização
- [ ] Avatar/imagem do personagem
- [ ] Background/História
- [ ] Notas personalizadas
- [ ] Aparência física
- [ ] Personalidade, ideais, vínculos, defeitos

### 6.4 Exportação
- [ ] Exportar ficha em PDF
- [ ] Exportar em JSON
- [ ] Impressão otimizada

### 6.5 Otimizações
- [ ] PWA (Progressive Web App)
- [ ] Offline-first
- [ ] Dark/Light mode toggle
- [ ] Temas customizáveis
- [ ] Acessibilidade (ARIA, keyboard navigation)

---

## Fase 7: Autenticação (Futura)
- [ ] Sistema de login/registro
- [ ] Múltiplos usuários
- [ ] Sincronização na nuvem
- [ ] Compartilhamento de personagens
- [ ] Sessões de jogo em grupo

---

## Notas Técnicas

### Stack Atual
- Svelte 5 + SvelteKit
- TypeScript
- Tailwind CSS v4
- D&D 5e API 2014
- Docker

### Stack Planejada
- PostgreSQL (banco local)
- Drizzle ORM ou Prisma
- Zod (validação)
- tRPC ou REST API
- Docker Compose (multi-container)

### Prioridades
1. **Fase 2**: Identidade visual e layout
2. **Fase 3**: PostgreSQL e persistência
3. **Fase 4**: Múltiplos personagens
4. **Fase 5**: Fichas detalhadas
5. **Fase 6+**: Features avançadas
