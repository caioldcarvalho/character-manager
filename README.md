# D&D 5e Character Creator

Aplicação web para criação de personagens de D&D 5e (2014 Edition).

## Funcionalidades

- ✅ Wizard de criação de personagem em 4 etapas
- ✅ Definição de nome do personagem
- ✅ Seleção de atributos (STR, DEX, CON, INT, WIS, CHA)
- ✅ Seleção de raça com visualização de modificadores
- ✅ Seleção de classe com informações detalhadas
- ✅ Resumo final do personagem criado
- ✅ Interface responsiva com Tailwind CSS
- ✅ Integração com D&D 5e API (2014)

## Tecnologias Utilizadas

- **Svelte 5**: Framework reativo
- **SvelteKit**: Meta-framework para Svelte
- **TypeScript**: Tipagem estática
- **Tailwind CSS v4**: Estilização
- **D&D 5e API**: Dados oficiais do SRD 5e 2014

## Executando Localmente

### Pré-requisitos

- Node.js 20+
- npm

### Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Acessar em http://localhost:5173
```

### Build de Produção

```bash
# Criar build otimizado
npm run build

# Visualizar build localmente
npm run preview
```

## Docker

### Usando Docker Compose (recomendado)

```bash
# Build e iniciar
docker-compose up --build

# Acessar em http://localhost:3000
```

### Usando Docker diretamente

```bash
# Build da imagem
docker build -t dnd-character-creator .

# Executar container
docker run -p 3000:3000 dnd-character-creator

# Acessar em http://localhost:3000
```

## Estrutura do Projeto

```
svelte-app/
├── src/
│   ├── lib/
│   │   ├── components/ui/  # Componentes UI reutilizáveis
│   │   ├── stores/         # State management
│   │   ├── api.ts          # Cliente da API D&D 5e
│   │   ├── types.ts        # Tipos TypeScript
│   │   └── utils.ts        # Funções utilitárias
│   ├── routes/
│   │   ├── +layout.svelte  # Layout global
│   │   └── +page.svelte    # Página principal (wizard)
│   └── app.css             # Estilos globais
├── Dockerfile              # Configuração Docker
├── docker-compose.yml      # Orquestração Docker
└── svelte.config.js        # Configuração SvelteKit
```

## API Utilizada

Este projeto utiliza a [D&D 5e API](https://www.dnd5eapi.co/) (2014 Edition) para obter dados oficiais do SRD:

- Endpoint base: `https://www.dnd5eapi.co/api/2014`
- Recursos utilizados:
  - `/races` - Lista de raças disponíveis
  - `/races/{index}` - Detalhes de uma raça específica
  - `/classes` - Lista de classes disponíveis
  - `/classes/{index}` - Detalhes de uma classe específica

## Próximos Passos (Roadmap)

- [ ] Adicionar sistema de login/autenticação
- [ ] Suporte para múltiplos personagens
- [ ] Salvar personagens (localStorage ou backend)
- [ ] Seleção de equipamento inicial
- [ ] Seleção de magias (para classes conjuradoras)
- [ ] Sistema de progressão de nível
- [ ] Exportar ficha em PDF
- [ ] Temas dark/light mode

## Licença

Este projeto é apenas para fins educacionais e não possui afiliação oficial com Wizards of the Coast.
