<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import { Zap } from 'lucide-svelte';

  const character = $derived(appStore.activeCharacter);
  const psionicDice = $derived(character?.psionicDice);

  function handleSpendDie() {
    if (character) {
      appStore.usePsionicDie(character.id);
    }
  }

  function handleRecoverDie() {
    if (character) {
      appStore.recoverPsionicDie(character.id);
    }
  }
</script>

{#if character && psionicDice}
  <Card variant="glass" class="p-6 animate-fade-in">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold flex items-center gap-2">
        <Zap size={24} class="text-warning" />
        Dados Psiônicos
      </h2>
      <div class="text-2xl font-bold">
        <span class="text-warning">d{psionicDice.dieSize}</span>
      </div>
    </div>

    <!-- Dice Count Display -->
    <div class="mb-6">
      <div class="text-center">
        <div class="text-5xl font-bold">
          {psionicDice.current}
          <span class="text-2xl text-muted-foreground">/ {psionicDice.max}</span>
        </div>
        <div class="text-sm text-muted-foreground mt-2">Dados Disponíveis</div>
      </div>
    </div>

    <!-- Dice Visualization -->
    <div class="mb-6">
      <div class="flex flex-wrap gap-2 justify-center">
        {#each Array.from({ length: psionicDice.max }) as _, i}
          <button
            onclick={handleSpendDie}
            disabled={i >= psionicDice.current}
            class="w-12 h-12 rounded-lg font-bold text-sm transition-all {i < psionicDice.current
              ? 'bg-warning/30 border-2 border-warning text-warning-light hover:bg-warning/50 cursor-pointer'
              : 'bg-secondary border-2 border-muted text-muted-foreground cursor-not-allowed opacity-50'}"
            aria-label="Gastar dado psiônico"
          >
            d{psionicDice.dieSize}
          </button>
        {/each}
      </div>
    </div>

    <!-- Actions -->
    <div class="space-y-2">
      <button
        onclick={handleSpendDie}
        disabled={psionicDice.current === 0}
        class="w-full px-4 py-2 bg-warning hover:bg-warning-dark text-warning-foreground rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Gastar Dado Psiônico
      </button>
      <button
        onclick={handleRecoverDie}
        disabled={psionicDice.current === psionicDice.max}
        class="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-primary-foreground rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Recuperar Dado (Ação Bônus)
      </button>
    </div>

    <div class="mt-4 p-3 bg-muted/20 border border-muted rounded-lg">
      <p class="text-xs text-muted-foreground">
        <span class="font-semibold">Recuperação:</span> 1 dado por ação bônus durante descanso curto. Todos os dados são recuperados com descanso longo.
      </p>
    </div>
  </Card>
{/if}
