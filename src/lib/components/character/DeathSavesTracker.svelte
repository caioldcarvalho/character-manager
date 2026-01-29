<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';

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
  <div class="mt-6 p-4 border-2 rounded-lg {isDead ? 'border-red-600 bg-red-500/10' : isStabilized ? 'border-green-600 bg-green-500/10' : 'border-yellow-600 bg-yellow-500/10'}">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-bold {isDead ? 'text-red-400' : isStabilized ? 'text-green-400' : 'text-yellow-400'}">
        {#if isDead}
          ☠️ Morto
        {:else if isStabilized}
          ✅ Estabilizado
        {:else}
          ⚠️ Morrendo
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
        <div class="text-sm font-medium mb-2 text-green-400">Sucessos</div>
        <div class="flex gap-2">
          {#each [0, 1, 2] as index}
            <button
              onclick={() => toggleSuccess(index)}
              class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all {character.deathSaves.successes > index
                ? 'bg-green-500 border-green-500'
                : 'border-green-500/50 hover:border-green-500'}"
              aria-label="Sucesso {index + 1}"
            >
              {#if character.deathSaves.successes > index}
                <span class="text-white font-bold">✓</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <!-- Failures -->
      <div>
        <div class="text-sm font-medium mb-2 text-red-400">Falhas</div>
        <div class="flex gap-2">
          {#each [0, 1, 2] as index}
            <button
              onclick={() => toggleFailure(index)}
              class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all {character.deathSaves.failures > index
                ? 'bg-red-500 border-red-500'
                : 'border-red-500/50 hover:border-red-500'}"
              aria-label="Falha {index + 1}"
            >
              {#if character.deathSaves.failures > index}
                <span class="text-white font-bold">✕</span>
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
