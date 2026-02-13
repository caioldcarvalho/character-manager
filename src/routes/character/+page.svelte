<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import HPTracker from '$lib/components/character/HPTracker.svelte';
  import InitiativeTracker from '$lib/components/character/InitiativeTracker.svelte';
  import SpellSlots from '$lib/components/character/SpellSlots.svelte';
  import ClassFeatures from '$lib/components/character/ClassFeatures.svelte';
  import ImportExport from '$lib/components/character/ImportExport.svelte';
  import SkillsPanel from '$lib/components/character/SkillsPanel.svelte';
  import SpellManagement from '$lib/components/character/SpellManagement.svelte';
  import AttacksPanel from '$lib/components/character/AttacksPanel.svelte';
  import StatusConditionsPanel from '$lib/components/character/StatusConditionsPanel.svelte';
  import NotesPanel from '$lib/components/character/NotesPanel.svelte';
  import RestManager from '$lib/components/character/RestManager.svelte';
  import SavingThrows from '$lib/components/character/SavingThrows.svelte';
  import ConcentrationTracker from '$lib/components/character/ConcentrationTracker.svelte';
  import DiceRoller from '$lib/components/character/DiceRoller.svelte';
  import InventoryPanel from '$lib/components/character/InventoryPanel.svelte';
  import FeatsPanel from '$lib/components/character/FeatsPanel.svelte';
  import {
    getFinalAbilityScore,
    formatModifier,
    calculateModifier,
    calculateSkillBonus,
    calculateSpellSaveDC,
    calculateSpellAttackBonus,
    calculateInitiative
  } from '$lib/utils/character';
  import { Pencil, Shield, Eye, Minus, Plus } from 'lucide-svelte';
  import { getModifierTotal } from '$lib/utils/modifiers';

  const abilities = [
    { key: 'strength', label: 'Força', abbr: 'FOR' },
    { key: 'dexterity', label: 'Destreza', abbr: 'DES' },
    { key: 'constitution', label: 'Constituição', abbr: 'CON' },
    { key: 'intelligence', label: 'Inteligência', abbr: 'INT' },
    { key: 'wisdom', label: 'Sabedoria', abbr: 'SAB' },
    { key: 'charisma', label: 'Carisma', abbr: 'CAR' }
  ];

  let editingName = $state(false);
  let nameInput = $state('');
  let editingAC = $state(false);
  let acInput = $state(10);

  const passivePerception = $derived(() => {
    if (!appStore.activeCharacter) return 10;
    return 10 + calculateSkillBonus(appStore.activeCharacter, 'perception') + getModifierTotal(appStore.activeCharacter, 'passive:perception');
  });

  function startEdit() {
    if (appStore.activeCharacter) {
      nameInput = appStore.activeCharacter.name;
      editingName = true;
    }
  }

  function saveName() {
    if (appStore.activeCharacter && nameInput.trim() && nameInput !== appStore.activeCharacter.name) {
      appStore.updateCharacter(appStore.activeCharacter.id, { name: nameInput.trim() });
    }
    editingName = false;
  }

  function startEditAC() {
    if (appStore.activeCharacter) {
      acInput = appStore.activeCharacter.combatStats.armorClass;
      editingAC = true;
    }
  }

  function saveAC() {
    if (appStore.activeCharacter) {
      appStore.updateArmorClass(appStore.activeCharacter.id, acInput);
    }
    editingAC = false;
  }
</script>

{#if appStore.state.activeTab === 'summary' && appStore.activeCharacter}
  {@const character = appStore.activeCharacter}
  {@const spellSaveDC = calculateSpellSaveDC(character)}
  {@const spellAttackBonus = calculateSpellAttackBonus(character)}

  <div class="space-y-6">
    <!-- Header with Import/Export -->
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          {#if editingName}
            <input
              type="text"
              bind:value={nameInput}
              onblur={saveName}
              onkeydown={(e) => e.key === 'Enter' && saveName()}
              class="text-3xl font-bold bg-background text-foreground border-b-2 border-primary focus:outline-none min-w-[200px]"
              autofocus
            />
          {:else}
            <h1 class="text-3xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors" onclick={startEdit}>
              {character.name}
            </h1>
            <button onclick={startEdit} class="text-muted-foreground hover:text-foreground transition-colors" aria-label="Editar nome">
              <Pencil size={18} />
            </button>
          {/if}
        </div>
        <p class="text-lg text-muted-foreground">
          {character.race?.name || 'Raça desconhecida'} {character.class?.name || 'Classe desconhecida'} - Nível {character.level}
        </p>
      </div>
      <ImportExport />
    </div>

    <!-- Combat Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <HPTracker />
      <RestManager />

      <!-- Combat & Spell Stats Card -->
      <Card variant="glass" class="p-6 animate-fade-in">
        <h2 class="text-xl font-bold mb-4">Combate</h2>
        <div class="space-y-4">
          <!-- Armor Class (editable) -->
          <div class="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <div class="flex items-center gap-2">
              <Shield size={18} class="text-primary" />
              <span class="text-sm font-medium">CA</span>
            </div>
            {#if editingAC}
              <div class="flex items-center gap-2">
                <button onclick={() => acInput = Math.max(0, acInput - 1)}
                  class="w-7 h-7 flex items-center justify-center bg-background rounded hover:bg-background/80 transition-colors">
                  <Minus size={14} />
                </button>
                <input type="number" bind:value={acInput}
                  onblur={saveAC}
                  onkeydown={(e) => e.key === 'Enter' && saveAC()}
                  class="w-16 text-center text-2xl font-bold bg-background border border-input rounded-md text-foreground"
                  autofocus />
                <button onclick={() => acInput++}
                  class="w-7 h-7 flex items-center justify-center bg-background rounded hover:bg-background/80 transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            {:else}
              <button onclick={startEditAC} class="text-2xl font-bold hover:text-primary transition-colors" title="Clique para editar">
                {character.combatStats.armorClass}
              </button>
            {/if}
          </div>

          <!-- Passive Perception -->
          <div class="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <div class="flex items-center gap-2">
              <Eye size={18} class="text-primary" />
              <span class="text-sm font-medium">Percepção Passiva</span>
            </div>
            <span class="text-2xl font-bold">{passivePerception()}</span>
          </div>

          <!-- Spell stats (only for casters) -->
          {#if character.spellSlots && Object.values(character.spellSlots).some(s => s.max > 0)}
            <div class="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <span class="text-sm font-medium">CD de Magia</span>
              <span class="text-2xl font-bold text-primary">{spellSaveDC}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <span class="text-sm font-medium">Ataque Mágico</span>
              <span class="text-2xl font-bold text-primary">
                {spellAttackBonus >= 0 ? '+' : ''}{spellAttackBonus}
              </span>
            </div>
          {/if}
        </div>
      </Card>
    </div>

    <!-- Concentration Tracker -->
    <ConcentrationTracker />

    <!-- Compact Initiative Tracker -->
    <Card variant="glass" class="p-4 animate-fade-in">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <div>
            <span class="text-sm text-muted-foreground">Iniciativa</span>
            <div class="text-2xl font-bold">{formatModifier(getFinalAbilityScore(character, 'dexterity'))}</div>
          </div>
        </div>
        <button
          onclick={() => {
            const initiativeMod = calculateInitiative(character);
            const d20 = Math.floor(Math.random() * 20) + 1;
            const result = d20 + initiativeMod;
            alert(`Iniciativa: ${result} (d20: ${d20} ${formatModifier(getFinalAbilityScore(character, 'dexterity'))})`);
          }}
          class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-semibold transition-[var(--transition-base)] hover:scale-[1.02]"
        >
          Rolar
        </button>
      </div>
    </Card>

    <!-- Ability Scores Row -->
    <Card variant="glass" class="p-6 animate-fade-in">
      <h2 class="text-xl font-bold mb-4">Atributos</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {#each abilities as ability}
          {@const score = getFinalAbilityScore(character, ability.key as keyof typeof character.abilityScores)}
          <div class="flex flex-col items-center p-4 bg-secondary rounded-lg">
            <div class="text-sm text-muted-foreground font-medium">{ability.abbr}</div>
            <div class="text-3xl font-bold my-2">{score}</div>
            <div class="text-lg text-primary font-semibold">{formatModifier(score)}</div>
            <div class="text-xs text-muted-foreground mt-1">{ability.label}</div>
          </div>
        {/each}
      </div>
    </Card>

    <!-- Attacks Panel -->
    <AttacksPanel />

    <!-- Status Conditions Panel -->
    <StatusConditionsPanel />

    <!-- Class Features -->
    <ClassFeatures />

    <!-- Feats -->
    <FeatsPanel />

    <!-- Resources Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SpellSlots />

      <!-- Info Card -->
      <Card class="p-6 space-y-4">
        <h2 class="text-xl font-bold mb-4">Informações</h2>

        <div>
          <div class="text-sm text-muted-foreground">Raça</div>
          <div class="font-semibold">{character.race?.name || 'Não definida'}</div>
        </div>

        <div>
          <div class="text-sm text-muted-foreground">Classe</div>
          <div class="font-semibold">{character.class?.name || 'Não definida'}</div>
        </div>

        <div>
          <div class="text-sm text-muted-foreground">Nível</div>
          <div class="font-semibold">{character.level}</div>
        </div>

        <div>
          <div class="text-sm text-muted-foreground">Bônus de Proficiência</div>
          <div class="font-semibold">+{character.combatStats.proficiencyBonus}</div>
        </div>

        {#if character.race}
          <div>
            <div class="text-sm text-muted-foreground">Velocidade</div>
            <div class="font-semibold">{character.race.speed} pés</div>
          </div>

          <div>
            <div class="text-sm text-muted-foreground">Tamanho</div>
            <div class="font-semibold">{character.race.size}</div>
          </div>
        {/if}

        {#if character.class}
          <div>
            <div class="text-sm text-muted-foreground">Dado de Vida</div>
            <div class="font-semibold">d{character.class.hit_die}</div>
          </div>
        {/if}
      </Card>
    </div>

    <!-- Características raciais -->
    {#if character.race?.traits && character.race.traits.length > 0}
      <Card class="p-6">
        <h2 class="text-xl font-bold mb-4">Características Raciais</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          {#each character.race.traits as trait}
            <div class="p-3 bg-secondary rounded-lg">
              <div class="font-semibold">{trait.name}</div>
            </div>
          {/each}
        </div>
      </Card>
    {/if}

    <!-- Proficiências -->
    {#if character.class?.proficiencies && character.class.proficiencies.length > 0}
      <Card class="p-6">
        <h2 class="text-xl font-bold mb-4">Proficiências</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {#each character.class.proficiencies as prof}
            <div class="p-2 bg-secondary rounded text-sm">
              {prof.name}
            </div>
          {/each}
        </div>
      </Card>
    {/if}

    <!-- Saving Throws -->
    <SavingThrows />

    <!-- Dice Roller -->
    <DiceRoller />
  </div>
{:else if appStore.state.activeTab === 'abilities'}
  <SkillsPanel />
{:else if appStore.state.activeTab === 'items'}
  <InventoryPanel />
{:else if appStore.state.activeTab === 'notes'}
  <NotesPanel />
{:else if appStore.state.activeTab === 'spells'}
  <SpellManagement />
{/if}