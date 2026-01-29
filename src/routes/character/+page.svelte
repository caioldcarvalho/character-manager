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
  import {
    getFinalAbilityScore,
    formatModifier,
    calculateSpellSaveDC,
    calculateSpellAttackBonus
  } from '$lib/utils/character';

  const abilities = [
    { key: 'strength', label: 'Força', abbr: 'FOR' },
    { key: 'dexterity', label: 'Destreza', abbr: 'DES' },
    { key: 'constitution', label: 'Constituição', abbr: 'CON' },
    { key: 'intelligence', label: 'Inteligência', abbr: 'INT' },
    { key: 'wisdom', label: 'Sabedoria', abbr: 'SAB' },
    { key: 'charisma', label: 'Carisma', abbr: 'CAR' }
  ];
</script>

{#if appStore.state.activeTab === 'summary' && appStore.activeCharacter}
  {@const character = appStore.activeCharacter}
  {@const spellSaveDC = calculateSpellSaveDC(character)}
  {@const spellAttackBonus = calculateSpellAttackBonus(character)}

  <div class="space-y-6">
    <!-- Header with Import/Export -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">{character.name}</h1>
        <p class="text-lg text-muted-foreground">
          {character.race?.name || 'Raça desconhecida'} {character.class?.name || 'Classe desconhecida'} - Nível {character.level}
        </p>
      </div>
      <ImportExport />
    </div>

    <!-- Combat Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <HPTracker />
      <InitiativeTracker />

      <!-- Spell Stats Card -->
      <Card class="p-6">
        <h2 class="text-xl font-bold mb-4">Magia</h2>
        <div class="space-y-4">
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
          <div class="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <span class="text-sm font-medium">CA</span>
            <span class="text-2xl font-bold">{character.combatStats.armorClass}</span>
          </div>
        </div>
      </Card>
    </div>

    <!-- Ability Scores Row -->
    <Card class="p-6">
      <h2 class="text-xl font-bold mb-4">Atributos</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {#each abilities as ability}
          {@const score = getFinalAbilityScore(character, ability.key)}
          <div class="flex flex-col items-center p-4 bg-secondary rounded-lg">
            <div class="text-sm text-muted-foreground font-medium">{ability.abbr}</div>
            <div class="text-3xl font-bold my-2">{score}</div>
            <div class="text-lg text-primary font-semibold">{formatModifier(score)}</div>
            <div class="text-xs text-muted-foreground mt-1">{ability.label}</div>
          </div>
        {/each}
      </div>
    </Card>

    <!-- Class Features -->
    <ClassFeatures />

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

    <!-- Testes de Resistência -->
    {#if character.class?.saving_throws && character.class.saving_throws.length > 0}
      <Card class="p-6">
        <h2 class="text-xl font-bold mb-4">Testes de Resistência</h2>
        <div class="flex gap-3 flex-wrap">
          {#each character.class.saving_throws as save}
            {@const saveAbility = save.index as keyof typeof character.abilityScores}
            {@const saveScore = getFinalAbilityScore(character, saveAbility)}
            {@const saveBonus = Math.floor((saveScore - 10) / 2) + character.combatStats.proficiencyBonus}
            <div class="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold">
              {save.name} {saveBonus >= 0 ? '+' : ''}{saveBonus}
            </div>
          {/each}
        </div>
      </Card>
    {/if}
  </div>
{:else if appStore.state.activeTab === 'abilities'}
  <SkillsPanel />
{:else if appStore.state.activeTab === 'items'}
  <div class="text-center py-12">
    <div class="text-6xl mb-4">🎒</div>
    <h2 class="text-2xl font-bold mb-2">Itens</h2>
    <p class="text-muted-foreground">Em desenvolvimento...</p>
  </div>
{:else if appStore.state.activeTab === 'spells'}
  <SpellManagement />
{/if}
