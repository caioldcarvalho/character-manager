<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import { Skull, HeartPulse, AlertTriangle, Check, X } from 'lucide-svelte';

  const character = $derived(appStore.activeCharacter);

  const isDying = $derived(character?.hitPoints.current === 0);
  const isDead = $derived((character?.deathSaves?.failures ?? 0) >= 3);
  const isStabilized = $derived(character?.deathSaves?.stabilized ?? false);

  function toggleSuccess(index: number) {
    if (!character) return;

    if (character.deathSaves.successes > index) {
      appStore.removeDeathSave(character.id, 'success');
    } else if (character.deathSaves.successes === index) {
      appStore.recordDeathSave(character.id, 'success');
    }
  }

  function toggleFailure(index: number) {
    if (!character) return;

    if (character.deathSaves.failures > index) {
      appStore.removeDeathSave(character.id, 'failure');
    } else if (character.deathSaves.failures === index) {
      appStore.recordDeathSave(character.id, 'failure');
    }
  }

  function reset() {
    if (character) {
      appStore.resetDeathSaves(character.id);
    }
  }
</script>

{#if character && isDying}
  <div class="mt-6 p-4 border-2 rounded-lg {isDead ? 'border-danger bg-danger/10' : isStabilized ? 'border-success bg-success/10' : 'border-warning bg-warning/10'}">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-bold flex items-center {isDead ? 'text-danger-light' : isStabilized ? 'text-success-light' : 'text-warning-light'}">
        {#if isDead}
          <Skull size={20} class="mr-2" /> Morto
        {:else if isStabilized}
          <HeartPulse size={20} class="mr-2" /> Estabilizado
        {:else}
          <AlertTriangle size={20} class="mr-2" /> Morrendo
        {/if}
      </h3>
      <button
        onclick={reset}
        class="px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded transition-colors"
      >
        Resetar
      </button>
    </div>

    <div class="space-y-3">
      <!-- Successes -->
      <div>
        <div class="text-sm font-medium mb-2 text-success-light">Sucessos</div>
        <div class="flex gap-2">
          {#each [0, 1, 2] as index}
            <button
              onclick={() => toggleSuccess(index)}
              class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all {character.deathSaves.successes > index
                ? 'bg-success border-success'
                : 'border-success/50 hover:border-success'}"
              aria-label="Sucesso {index + 1}"
            >
              {#if character.deathSaves.successes > index}
                <span class="text-success-foreground font-bold"><Check size={16} /></span>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <!-- Failures -->
      <div>
        <div class="text-sm font-medium mb-2 text-danger-light">Falhas</div>
        <div class="flex gap-2">
          {#each [0, 1, 2] as index}
            <button
              onclick={() => toggleFailure(index)}
              class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all {character.deathSaves.failures > index
                ? 'bg-danger border-danger'
                : 'border-danger/50 hover:border-danger'}"
              aria-label="Falha {index + 1}"
            >
              {#if character.deathSaves.failures > index}
                <span class="text-danger-foreground font-bold"><X size={16} /></span>
              {/if}
            </button>
          {/each}
        </div>
      </div>
    </div>

    <div class="mt-3 p-2 bg-background/50 rounded text-xs text-foreground/70">
      <strong>Regra:</strong> Role 1d20. 10+ é sucesso, 9- é falha. 3 sucessos = estabilizado. 3 falhas = morte.
      Crítico (20) conta como 2 sucessos e restaura 1 PV. Crítico (1) conta como 2 falhas.
    </div>
  </div>
{/if}