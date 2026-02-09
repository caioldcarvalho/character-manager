# Plano de Implementação: Criação Dinâmica de Qualquer Classe em Qualquer Nível

## Objetivo
Permitir que o wizard de criação de personagem gere automaticamente um personagem **completo** para qualquer uma das 12 classes do D&D 5e, em qualquer nível (1-20), buscando habilidades, spell slots e features direto da API `dnd5eapi.co`.

---

## APIs Disponíveis (Base URL: `https://www.dnd5eapi.co/api/2014`)

| Endpoint | Retorna | Exemplo |
|----------|---------|---------|
| `GET /classes` | Lista de 12 classes | `{results: [{index: "fighter", name: "Fighter"}]}` |
| `GET /classes/{index}` | Detalhes da classe (hit_die, proficiencies, saving_throws) | já existe em `api.ts` |
| `GET /classes/{index}/levels` | Array com 20 objetos, um por nível. Cada um tem: `level`, `prof_bonus`, `features[]`, `class_specific`, e opcionalmente `spellcasting` (spell slots por nível) | **NOVO - principal** |
| `GET /classes/{index}/levels/{level}` | Dados de um nível específico | alternativa ao acima |
| `GET /features/{index}` | Detalhes de uma feature: `name`, `desc[]`, `level`, `class` | **NOVO** |
| `GET /classes/{index}/spells` | Lista de magias disponíveis para a classe: `{results: [{index, name, level, url}]}` | **NOVO** |
| `GET /spells/{index}` | Detalhes completos da magia: `name`, `level`, `school`, `casting_time`, `range`, `duration`, `concentration`, `desc` | **NOVO** |

---

## Estrutura dos Dados da API (referência para implementação)

### Resposta de `/classes/fighter/levels` (cada item do array):
```json
{
  "level": 1,
  "prof_bonus": 2,
  "features": [
    { "index": "second-wind", "name": "Second Wind", "url": "/api/2014/features/second-wind" }
  ],
  "class_specific": { "action_surges": 0, "indomitable_uses": 0, "extra_attacks": 0 }
}
```

### Resposta de `/classes/wizard/levels/3` (classe com spellcasting):
```json
{
  "level": 3,
  "prof_bonus": 2,
  "features": [],
  "spellcasting": {
    "cantrips_known": 3,
    "spell_slots_level_1": 4,
    "spell_slots_level_2": 2,
    "spell_slots_level_3": 0,
    "spell_slots_level_4": 0,
    "spell_slots_level_5": 0,
    "spell_slots_level_6": 0,
    "spell_slots_level_7": 0,
    "spell_slots_level_8": 0,
    "spell_slots_level_9": 0
  },
  "class_specific": { "arcane_recovery_levels": 2 }
}
```

### Resposta de `/features/second-wind`:
```json
{
  "index": "second-wind",
  "name": "Second Wind",
  "level": 1,
  "desc": ["You have a limited well of stamina..."],
  "class": { "index": "fighter", "name": "Fighter" }
}
```

### Resposta de `/spells/cure-wounds`:
```json
{
  "index": "cure-wounds",
  "name": "Cure Wounds",
  "level": 1,
  "school": { "index": "evocation", "name": "Evocation" },
  "casting_time": "1 action",
  "range": "Touch",
  "duration": "Instantaneous",
  "concentration": false,
  "desc": ["A creature you touch regains..."],
  "classes": [{ "index": "paladin", "name": "Paladin" }]
}
```

---

## Tarefas de Implementação (em ordem)

### TAREFA 1: Expandir `SpellSlots` no `types.ts`

**Arquivo:** `src/lib/types.ts`

**Problema:** Hoje `SpellSlots` só suporta nível 1 e 2. Precisamos de 1 a 9.

**O que fazer:**
Substituir a interface `SpellSlots` atual:
```typescript
// ANTES:
export interface SpellSlots {
  level1: { current: number; max: number };
  level2: { current: number; max: number };
}

// DEPOIS:
export interface SpellSlotLevel {
  current: number;
  max: number;
}

export interface SpellSlots {
  level1: SpellSlotLevel;
  level2: SpellSlotLevel;
  level3: SpellSlotLevel;
  level4: SpellSlotLevel;
  level5: SpellSlotLevel;
  level6: SpellSlotLevel;
  level7: SpellSlotLevel;
  level8: SpellSlotLevel;
  level9: SpellSlotLevel;
}
```

**Também na interface `Character`, remover `paladinResources` e adicionar campo genérico:**
```typescript
// Adicionar ao Character:
subclass?: string; // ex: "Psi Warrior", "Oath of Vengeance"
spellcastingAbility?: string; // ex: "charisma", "intelligence", "wisdom"
```

**Não remover** `paladinResources` e `psionicDice` agora para manter compatibilidade. Só adicionar os campos novos.

---

### TAREFA 2: Adicionar novas funções na API (`src/lib/api.ts`)

**Arquivo:** `src/lib/api.ts`

Adicionar estas 4 funções novas:

```typescript
// 1. Buscar TODOS os níveis de uma classe (retorna array de 20 itens)
export async function getClassLevels(classIndex: string): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/classes/${classIndex}/levels`);
  if (!response.ok) throw new Error(`Failed to fetch class levels: ${response.statusText}`);
  return response.json();
}

// 2. Buscar dados de UM nível específico
export async function getClassLevel(classIndex: string, level: number): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/classes/${classIndex}/levels/${level}`);
  if (!response.ok) throw new Error(`Failed to fetch class level: ${response.statusText}`);
  return response.json();
}

// 3. Buscar detalhes de uma feature específica
export async function getFeatureDetails(featureIndex: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/features/${featureIndex}`);
  if (!response.ok) throw new Error(`Failed to fetch feature: ${response.statusText}`);
  return response.json();
}

// 4. Buscar lista de magias disponíveis para uma classe
export async function getClassSpells(classIndex: string): Promise<{ count: number; results: any[] }> {
  const response = await fetch(`${API_BASE_URL}/classes/${classIndex}/spells`);
  if (!response.ok) throw new Error(`Failed to fetch class spells: ${response.statusText}`);
  return response.json();
}

// 5. Buscar detalhes de UMA magia
export async function getSpellDetails(spellIndex: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/spells/${spellIndex}`);
  if (!response.ok) throw new Error(`Failed to fetch spell: ${response.statusText}`);
  return response.json();
}
```

---

### TAREFA 3: Criar o serviço de construção de personagem (`src/lib/utils/character-builder.ts`)

**Arquivo NOVO:** `src/lib/utils/character-builder.ts`

Este é o arquivo **principal** da implementação. Ele recebe os dados da API e monta um `Character` completo.

```typescript
import type { Character, ClassFeature, SpellSlots, Spell } from '$lib/types';
import { getClassLevel, getFeatureDetails, getClassSpells, getSpellDetails } from '$lib/api';
import { DND_SKILLS } from '$lib/constants/dnd';

/**
 * Constrói um personagem completo a partir dos dados da API.
 *
 * @param name - Nome do personagem
 * @param level - Nível desejado (1-20)
 * @param classIndex - Index da classe na API (ex: "fighter", "wizard", "paladin")
 * @param classDetails - Objeto CharacterClass já buscado da API
 * @param raceDetails - Objeto Race já buscado da API
 * @param abilityScores - Atributos definidos pelo usuário
 */
export async function buildCharacter(params: {
  name: string;
  level: number;
  classIndex: string;
  classDetails: CharacterClass;
  raceDetails: Race;
  abilityScores: AbilityScores;
}): Promise<Character> {
  // ... implementação descrita abaixo
}
```

**Lógica da função `buildCharacter` (passo a passo):**

#### Passo 1: Buscar dados do nível na API
```typescript
const levelData = await getClassLevel(classIndex, level);
// levelData contém: prof_bonus, features[], spellcasting?, class_specific
```

#### Passo 2: Buscar detalhes de TODAS as features até o nível escolhido
Para cada nível de 1 até `level`, buscar as features. Usar `Promise.all` para paralelizar:

```typescript
// Buscar todos os níveis de 1 até level
const allLevelPromises = [];
for (let i = 1; i <= level; i++) {
  allLevelPromises.push(getClassLevel(classIndex, i));
}
const allLevels = await Promise.all(allLevelPromises);

// Coletar todas as features de todos os níveis
const allFeatureRefs = allLevels.flatMap(lvl => lvl.features);

// Buscar detalhes de cada feature em paralelo
const featureDetails = await Promise.all(
  allFeatureRefs.map(f => getFeatureDetails(f.index))
);

// Converter para ClassFeature[]
const classFeatures: ClassFeature[] = featureDetails.map(f => ({
  name: f.name,
  description: f.desc.join('\n'), // desc é array de strings
  level: f.level,
}));
```

#### Passo 3: Montar spell slots (se classe tem spellcasting)
```typescript
const spellSlots: SpellSlots = {
  level1: { current: 0, max: 0 },
  level2: { current: 0, max: 0 },
  level3: { current: 0, max: 0 },
  level4: { current: 0, max: 0 },
  level5: { current: 0, max: 0 },
  level6: { current: 0, max: 0 },
  level7: { current: 0, max: 0 },
  level8: { current: 0, max: 0 },
  level9: { current: 0, max: 0 },
};

// Se o nível da API tem spellcasting, preencher
if (levelData.spellcasting) {
  const sc = levelData.spellcasting;
  spellSlots.level1.max = spellSlots.level1.current = sc.spell_slots_level_1 || 0;
  spellSlots.level2.max = spellSlots.level2.current = sc.spell_slots_level_2 || 0;
  spellSlots.level3.max = spellSlots.level3.current = sc.spell_slots_level_3 || 0;
  // ... até level9
}
```

#### Passo 4: Buscar lista de magias (se classe tem spellcasting)
```typescript
let knownSpells: Spell[] = [];

// Classes com spellcasting: bard, cleric, druid, paladin, ranger, sorcerer, warlock, wizard
// Verificar se levelData.spellcasting existe
if (levelData.spellcasting) {
  const spellList = await getClassSpells(classIndex);

  // Filtrar magias pelo nível máximo de spell slot disponível
  const maxSpellLevel = getMaxSpellLevel(spellSlots); // helper: retorna o maior nível com slots > 0
  const availableSpells = spellList.results.filter(s => s.level <= maxSpellLevel);

  // Buscar detalhes de cada magia (LIMITAR a 30 para não sobrecarregar)
  const spellsToFetch = availableSpells.slice(0, 30);
  const spellDetails = await Promise.all(
    spellsToFetch.map(s => getSpellDetails(s.index))
  );

  knownSpells = spellDetails.map(s => ({
    name: s.name,
    level: s.level,
    school: s.school.name,
    castingTime: s.casting_time,
    range: s.range,
    duration: s.duration,
    concentration: s.concentration,
    description: s.desc.join('\n'),
    prepared: false,
  }));
}
```

#### Passo 5: Calcular HP
```typescript
const conModifier = Math.floor((abilityScores.constitution - 10) / 2);
const hitDie = classDetails.hit_die;
const averageRoll = Math.floor(hitDie / 2) + 1; // d10=6, d8=5, d6=4, d12=7
const maxHP = hitDie + conModifier + (level - 1) * (averageRoll + conModifier);
```

#### Passo 6: Montar o objeto Character completo
```typescript
return {
  id: generateId(),
  name,
  level,
  class: classDetails,
  race: raceDetails,
  abilityScores,
  hitPoints: { current: maxHP, max: maxHP, temporary: 0 },
  combatStats: {
    initiative: Math.floor((abilityScores.dexterity - 10) / 2),
    armorClass: 10 + Math.floor((abilityScores.dexterity - 10) / 2),
    speed: raceDetails.speed,
    proficiencyBonus: levelData.prof_bonus,
  },
  skills: initializeDefaultSkills(),
  spellSlots,
  knownSpells,
  preparedSpells: [],
  classFeatures,
  fightingStyle: '',
  paladinResources: { layOnHands: { current: 0, max: 0 }, channelDivinity: { current: 0, max: 0 } },
  classResources: [],
  weapons: [],
  statusConditions: [],
  deathSaves: { successes: 0, failures: 0, stabilized: false },
  notes: [],
  hitDice: { current: level, max: level, type: hitDie },
  restResources: {},
  inspiration: false,
};
```

**Helpers necessários neste arquivo:**
```typescript
function generateId(): string {
  return `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getMaxSpellLevel(slots: SpellSlots): number {
  for (let i = 9; i >= 1; i--) {
    const key = `level${i}` as keyof SpellSlots;
    if (slots[key].max > 0) return i;
  }
  return 0;
}

function initializeDefaultSkills(): Record<string, Skill> {
  const skills: Record<string, Skill> = {};
  Object.entries(DND_SKILLS).forEach(([key, data]) => {
    skills[key] = { ...data, proficient: false };
  });
  return skills;
}
```

---

### TAREFA 4: Adicionar seleção de nível no wizard de criação

**Arquivo:** `src/routes/create/+page.svelte`

**Mudanças:**

1. **Adicionar um novo step** entre "Classe" e a finalização para seletor de nível:

   Atualizar o array `steps`:
   ```typescript
   const steps = [
     { title: 'Nome do Personagem', component: 'name' },
     { title: 'Atributos', component: 'abilities' },
     { title: 'Raça', component: 'race' },
     { title: 'Classe', component: 'class' },
     { title: 'Nível', component: 'level' },  // NOVO
   ];
   ```

2. **Adicionar variável de estado para o nível:**
   ```typescript
   let selectedLevel = $state(1);
   ```

3. **Criar o UI do step de nível** (step 4, index 4):
   ```svelte
   {#if currentStep === 4}
     <div class="space-y-6">
       <h2 class="text-2xl font-bold mb-2">Escolha o Nível</h2>
       <p class="text-muted-foreground">
         Selecione o nível inicial do seu personagem (1-20).
       </p>
       <div class="grid grid-cols-4 md:grid-cols-5 gap-2">
         {#each Array.from({length: 20}, (_, i) => i + 1) as lvl}
           <button
             type="button"
             onclick={() => selectedLevel = lvl}
             class="p-3 border-2 rounded-lg font-bold text-lg transition-all
               {selectedLevel === lvl ? 'border-magic bg-magic-light/20' : 'border-border hover:border-magic/50'}"
           >
             {lvl}
           </button>
         {/each}
       </div>
       <div class="p-4 bg-info-light/20 rounded-lg">
         <p>Bônus de Proficiência: +{Math.ceil(selectedLevel / 4) + 1}</p>
         <p>Dado de Vida: {selectedLevel}d{selectedClassDetails?.hit_die}</p>
       </div>
     </div>
   {/if}
   ```

4. **Modificar `finishCharacterCreation`** para usar `buildCharacter`:
   ```typescript
   import { buildCharacter } from '$lib/utils/character-builder';

   let creatingCharacter = $state(false);
   let creationError = $state<string | null>(null);

   async function finishCharacterCreation() {
     if (!selectedClassDetails || !selectedRaceDetails) return;

     creatingCharacter = true;
     creationError = null;

     try {
       const character = await buildCharacter({
         name: nameInput,
         level: selectedLevel,
         classIndex: selectedClassIndex!,
         classDetails: selectedClassDetails,
         raceDetails: selectedRaceDetails,
         abilityScores,
       });

       appStore.addCharacter(character);
       goto('/character');
     } catch (error) {
       creationError = 'Erro ao criar personagem. Verifique sua conexão.';
       console.error(error);
     } finally {
       creatingCharacter = false;
     }
   }
   ```

5. **Adicionar indicador de loading** no botão de finalizar:
   ```svelte
   <Button onclick={finishCharacterCreation} disabled={creatingCharacter || !canProceed()}>
     {#if creatingCharacter}
       Criando personagem...
     {:else}
       Finalizar Criação
     {/if}
   </Button>
   ```

---

### TAREFA 5: Atualizar `SpellSlots` component e a store

**Arquivo:** `src/lib/components/character/SpellSlots.svelte`

Atualizar para renderizar spell slots de nível 1 a 9 **dinamicamente** (só mostrar níveis com max > 0):

```svelte
{#each [1,2,3,4,5,6,7,8,9] as lvl}
  {@const slotKey = `level${lvl}` as keyof SpellSlots}
  {@const slot = character.spellSlots[slotKey]}
  {#if slot.max > 0}
    <!-- Renderizar card do slot level {lvl} -->
  {/if}
{/each}
```

**Arquivo:** `src/lib/stores/app.svelte.ts`

Atualizar os métodos `useSpellSlot` e `updateSpellSlot` para aceitar níveis 1-9:
```typescript
// Mudar o tipo de level de `1 | 2` para `number` (1-9)
useSpellSlot(id: string, level: number) { ... }
updateSpellSlot(id: string, level: number, current: number) { ... }
```

Atualizar `longRest` para restaurar todos os 9 níveis (já usa `Object.keys`, então deve funcionar automaticamente após expandir a interface).

---

### TAREFA 6: Atualizar `migrateCharacter` na store

**Arquivo:** `src/lib/stores/app.svelte.ts`

Atualizar a função `migrateCharacter` para garantir que personagens antigos (que só tinham level1 e level2) ganhem os novos campos:

```typescript
spellSlots: {
  level1: char.spellSlots?.level1 || { current: 0, max: 0 },
  level2: char.spellSlots?.level2 || { current: 0, max: 0 },
  level3: char.spellSlots?.level3 || { current: 0, max: 0 },
  level4: char.spellSlots?.level4 || { current: 0, max: 0 },
  level5: char.spellSlots?.level5 || { current: 0, max: 0 },
  level6: char.spellSlots?.level6 || { current: 0, max: 0 },
  level7: char.spellSlots?.level7 || { current: 0, max: 0 },
  level8: char.spellSlots?.level8 || { current: 0, max: 0 },
  level9: char.spellSlots?.level9 || { current: 0, max: 0 },
},
```

---

### TAREFA 7: Remover botões de sample characters

**Arquivo:** `src/routes/create/+page.svelte`

Remover os botões "Carregar Paladino de Teste" e "Criar Guerreiro Psi", pois o wizard agora cria qualquer classe dinamicamente. Manter apenas o botão "Importar".

**NÃO deletar** os arquivos `sample-paladin.ts` e `sample-psi-warrior.ts` — eles servem como referência e podem ser úteis para testes.

---

## Resumo da Ordem de Execução

| # | Tarefa | Arquivos | Dependência |
|---|--------|----------|-------------|
| 1 | Expandir SpellSlots (1-9) | `types.ts` | nenhuma |
| 2 | Novas funções de API | `api.ts` | nenhuma |
| 3 | Character builder | `utils/character-builder.ts` (NOVO) | tarefas 1 e 2 |
| 4 | Step de nível no wizard + usar builder | `create/+page.svelte` | tarefa 3 |
| 5 | Atualizar SpellSlots component e store | `SpellSlots.svelte`, `app.svelte.ts` | tarefa 1 |
| 6 | Migrar personagens antigos | `app.svelte.ts` | tarefa 1 |
| 7 | Limpar botões de sample | `create/+page.svelte` | tarefa 4 |

**Tarefas 1 e 2 podem ser feitas em paralelo.**
**Tarefas 5 e 6 podem ser feitas em paralelo (após tarefa 1).**

---

## Notas Importantes para o Implementador

1. **A API retorna textos em inglês.** Não traduzir — manter inglês nas features e spells. Tradução é escopo futuro.

2. **Limite de requests:** Ao criar um personagem nível 20, serão feitas ~20 requests para níveis + ~20-40 requests para features + ~30 requests para spells. Total: ~60-90 requests. Usar `Promise.all` para paralelizar, mas considerar adicionar um `Promise.allSettled` com fallback para features que falhem.

3. **A API não tem subclasses detalhadas.** Subclasses como Psi Warrior, Oath of Vengeance, etc. NÃO estão na API com features completas. O sistema genérico funciona para as features BASE da classe. Subclasses são escopo futuro.

4. **Spell slots do Warlock são diferentes** (Pact Magic). A API retorna isso corretamente no campo `spellcasting` — tratar normalmente.

5. **Não quebrar personagens existentes.** Os campos `paladinResources` e `psionicDice` devem continuar existindo. A migração deve garantir que personagens antigos no localStorage continuem funcionando.

6. **`classResources` da API:** A API não retorna dados como "quantas vezes por descanso" uma feature pode ser usada. O campo `class_specific` tem alguns dados (ex: `action_surges: 1`), mas não é padronizado. Para o MVP, features vêm sem `uses` — o usuário pode editar manualmente depois.

7. **Cantrips:** Se `levelData.spellcasting.cantrips_known` existir e for > 0, buscar cantrips (spells com level=0) da lista de spells da classe e salvar em `character.cantrips`.
