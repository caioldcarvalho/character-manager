<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import { getFinalAbilityScore, calculateModifier } from '$lib/utils/character';
  import { getModifierTotal, hasFeatSavingThrowProficiency } from '$lib/utils/modifiers';
  import type { AbilityScores } from '$lib/types';

  const character = $derived(appStore.activeCharacter);

  const abilities: { key: keyof AbilityScores; label: string; abbr: string }[] = [
    { key: 'strength', label: 'Força', abbr: 'FOR' },
    { key: 'dexterity', label: 'Destreza', abbr: 'DES' },
    { key: 'constitution', label: 'Constituição', abbr: 'CON' },
    { key: 'intelligence', label: 'Inteligência', abbr: 'INT' },
    { key: 'wisdom', label: 'Sabedoria', abbr: 'SAB' },
    { key: 'charisma', label: 'Carisma', abbr: 'CAR' }
  ];

  function getSaveBonus(ability: keyof AbilityScores): number {
    if (!character) return 0;
    const score = getFinalAbilityScore(character, ability);
    const mod = calculateModifier(score);
    const proficient = isProficient(ability);
    const featBonus = getModifierTotal(character, `save:${ability}`);
    return mod + (proficient ? character.combatStats.proficiencyBonus : 0) + featBonus;
  }

  function isProficient(ability: keyof AbilityScores): boolean {
    if (!character) return false;
    return (character.savingThrowProficiencies?.[ability] ?? false) || hasFeatSavingThrowProficiency(character, ability);
  }

  function toggleProficiency(ability: keyof AbilityScores) {
    if (!character) return;
    appStore.toggleSavingThrowProficiency(character.id, ability);
  }
</script>

{#if character}
  <Card variant="glass" class="p-6 animate-fade-in">
    <h2 class="text-xl font-bold mb-4">Testes de Resistência</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {#each abilities as ability}
        {@const bonus = getSaveBonus(ability.key)}
        {@const proficient = isProficient(ability.key)}
        <button
          onclick={() => toggleProficiency(ability.key)}
          class="flex flex-col items-center p-3 rounded-lg transition-all {proficient
            ? 'bg-primary/20 border-2 border-primary'
            : 'bg-secondary border-2 border-transparent hover:border-muted-foreground/30'}"
          title="Clique para alternar proficiência"
        >
          <div class="text-xs text-muted-foreground font-medium">{ability.abbr}</div>
          <div class="text-2xl font-bold my-1 {proficient ? 'text-primary' : ''}">
            {bonus >= 0 ? '+' : ''}{bonus}
          </div>
          {#if proficient}
            <div class="w-2 h-2 rounded-full bg-primary"></div>
          {:else}
            <div class="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
          {/if}
        </button>
      {/each}
    </div>
  </Card>
{/if}
