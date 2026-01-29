<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import {
    calculatePreparedSpellCount,
    calculateSpellSaveDC,
    calculateSpellAttackBonus,
    formatModifier
  } from '$lib/utils/character';

  const character = $derived(appStore.activeCharacter);

  const maxPreparedSpells = $derived(character ? calculatePreparedSpellCount(character) : 0);
  const spellSaveDC = $derived(character ? calculateSpellSaveDC(character) : 0);
  const spellAttackBonus = $derived(character ? calculateSpellAttackBonus(character) : 0);

  let expandedSpells = $state<Set<string>>(new Set());
  let selectedLevel = $state<number | 'all'>('all');

  const spellsByLevel = $derived(() => {
    if (!character) return {};

    const grouped: Record<number, typeof character.knownSpells> = {};

    character.knownSpells.forEach(spell => {
      if (!grouped[spell.level]) {
        grouped[spell.level] = [];
      }
      grouped[spell.level].push(spell);
    });

    // Sort spells alphabetically within each level
    Object.values(grouped).forEach(spells => {
      spells.sort((a, b) => a.name.localeCompare(b.name));
    });

    return grouped;
  });

  const filteredSpells = $derived(() => {
    if (!character) return {};
    if (selectedLevel === 'all') return spellsByLevel();

    return { [selectedLevel]: spellsByLevel()[selectedLevel] || [] };
  });

  function toggleExpanded(spellName: string) {
    if (expandedSpells.has(spellName)) {
      expandedSpells.delete(spellName);
    } else {
      expandedSpells.add(spellName);
    }
    expandedSpells = new Set(expandedSpells);
  }

  function togglePrepared(spellName: string) {
    if (!character) return;

    const isPrepared = character.preparedSpells.includes(spellName);
    const canPrepare = character.preparedSpells.length < maxPreparedSpells;

    if (isPrepared || canPrepare) {
      appStore.toggleSpellPrepared(character.id, spellName);
    }
  }

  function isPrepared(spellName: string): boolean {
    return character?.preparedSpells.includes(spellName) || false;
  }

  function canPrepareMore(): boolean {
    return (character?.preparedSpells.length || 0) < maxPreparedSpells;
  }
</script>

{#if character}
  <div class="space-y-6">
    <!-- Spell Casting Stats -->
    <Card class="p-6">
      <h2 class="text-xl font-bold mb-4">Conjuração</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="text-center p-4 bg-secondary rounded-lg">
          <div class="text-sm text-muted-foreground mb-1">CD de Magia</div>
          <div class="text-3xl font-bold text-primary">{spellSaveDC}</div>
        </div>

        <div class="text-center p-4 bg-secondary rounded-lg">
          <div class="text-sm text-muted-foreground mb-1">Bônus de Ataque</div>
          <div class="text-3xl font-bold text-primary">
            {spellAttackBonus >= 0 ? '+' : ''}{spellAttackBonus}
          </div>
        </div>

        <div class="text-center p-4 bg-secondary rounded-lg">
          <div class="text-sm text-muted-foreground mb-1">Magias Preparadas</div>
          <div class="text-3xl font-bold text-primary">
            {character.preparedSpells.length}/{maxPreparedSpells}
          </div>
        </div>
      </div>

      <!-- Spell Slots -->
      <div class="mt-6 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">Espaços de Nível 1</span>
          <span class="font-bold">
            {character.spellSlots.level1.current}/{character.spellSlots.level1.max}
          </span>
        </div>
        <div class="w-full bg-secondary rounded-full h-2">
          <div
            class="bg-primary h-full rounded-full transition-all"
            style="width: {(character.spellSlots.level1.current / character.spellSlots.level1.max) * 100}%"
          ></div>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">Espaços de Nível 2</span>
          <span class="font-bold">
            {character.spellSlots.level2.current}/{character.spellSlots.level2.max}
          </span>
        </div>
        <div class="w-full bg-secondary rounded-full h-2">
          <div
            class="bg-purple-500 h-full rounded-full transition-all"
            style="width: {(character.spellSlots.level2.current / character.spellSlots.level2.max) * 100}%"
          ></div>
        </div>
      </div>
    </Card>

    <!-- Spell List -->
    <Card class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Magias Conhecidas</h2>

        <!-- Level Filter -->
        <select
          bind:value={selectedLevel}
          class="px-3 py-2 bg-secondary border border-input rounded-md text-sm"
        >
          <option value="all">Todos os Níveis</option>
          <option value={1}>Nível 1</option>
          <option value={2}>Nível 2</option>
        </select>
      </div>

      <div class="space-y-4">
        {#each Object.entries(filteredSpells()) as [level, spells]}
          <div>
            <h3 class="text-lg font-bold mb-3">Magias de Nível {level}</h3>
            <div class="space-y-2">
              {#each spells as spell}
                {@const prepared = isPrepared(spell.name)}
                <div class="border border-border rounded-lg overflow-hidden">
                  <div class="flex items-center gap-3 p-3 bg-secondary">
                    <!-- Prepare Checkbox -->
                    <button
                      onclick={() => togglePrepared(spell.name)}
                      disabled={!prepared && !canPrepareMore()}
                      class="w-6 h-6 rounded border-2 flex items-center justify-center transition-colors {prepared
                        ? 'bg-primary border-primary'
                        : 'border-muted-foreground/30 hover:border-muted-foreground'} disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Preparar {spell.name}"
                    >
                      {#if prepared}
                        <svg
                          class="w-4 h-4 text-primary-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="3"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      {/if}
                    </button>

                    <!-- Spell Name -->
                    <button
                      onclick={() => toggleExpanded(spell.name)}
                      class="flex-1 text-left font-semibold hover:text-primary transition-colors"
                    >
                      {spell.name}
                      {#if spell.concentration}
                        <span class="text-xs ml-2 text-primary">(C)</span>
                      {/if}
                    </button>

                    <!-- Expand Toggle -->
                    <button
                      onclick={() => toggleExpanded(spell.name)}
                      class="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {expandedSpells.has(spell.name) ? '▼' : '▶'}
                    </button>
                  </div>

                  {#if expandedSpells.has(spell.name)}
                    <div class="p-4 bg-background border-t border-border space-y-3">
                      <div class="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span class="text-muted-foreground">Escola:</span>
                          <span class="ml-2 font-medium">{spell.school}</span>
                        </div>
                        <div>
                          <span class="text-muted-foreground">Tempo:</span>
                          <span class="ml-2 font-medium">{spell.castingTime}</span>
                        </div>
                        <div>
                          <span class="text-muted-foreground">Alcance:</span>
                          <span class="ml-2 font-medium">{spell.range}</span>
                        </div>
                        <div>
                          <span class="text-muted-foreground">Duração:</span>
                          <span class="ml-2 font-medium">{spell.duration}</span>
                        </div>
                      </div>
                      <div class="text-sm text-muted-foreground">
                        {spell.description}
                      </div>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </Card>
  </div>
{/if}
