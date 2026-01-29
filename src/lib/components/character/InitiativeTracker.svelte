<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import { calculateInitiative, formatModifier, getFinalAbilityScore } from '$lib/utils/character';
  import { Dices } from 'lucide-svelte';

  const character = $derived(appStore.activeCharacter);
  const initiative = $derived(character ? calculateInitiative(character) : 0);

  let rollResult = $state<number | null>(null);

  function rollInitiative() {
    const d20 = Math.floor(Math.random() * 20) + 1;
    rollResult = d20 + initiative;
  }
</script>

{#if character}
  <Card class="p-6">
    <h2 class="text-xl font-bold mb-4">Iniciativa</h2>

    <!-- Initiative Modifier Display -->
    <div class="text-center mb-4">
      <div class="text-5xl font-bold text-primary">
        {formatModifier(getFinalAbilityScore(character, 'dexterity'))}
      </div>
      <div class="text-sm text-muted-foreground mt-2">Modificador de Iniciativa</div>
    </div>

    <!-- Roll Button -->
    <button
      onclick={rollInitiative}
      class="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-bold transition-colors flex items-center justify-center gap-2"
    >
      <Dices size={24} /> Rolar Iniciativa
    </button>

    <!-- Roll Result -->
    {#if rollResult !== null}
      <div class="mt-4 p-4 bg-secondary rounded-lg text-center animate-in fade-in">
        <div class="text-sm text-muted-foreground mb-1">Resultado</div>
        <div class="text-4xl font-bold text-primary">{rollResult}</div>
      </div>
    {/if}
  </Card>
{/if}