<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import { Focus, X } from 'lucide-svelte';

  const character = $derived(appStore.activeCharacter);

  function dropConcentration() {
    if (!character) return;
    appStore.setConcentration(character.id, null);
  }

  function getConSaveDC(damage: number): number {
    return Math.max(10, Math.floor(damage / 2));
  }

  let lastDamage = $state<number | null>(null);
</script>

{#if character?.concentratingOn}
  <div class="flex items-center gap-3 p-3 bg-magic/20 border border-magic/50 rounded-lg">
    <Focus size={20} class="text-magic-foreground shrink-0" />
    <div class="flex-1 min-w-0">
      <div class="text-sm font-semibold text-magic-foreground truncate">
        Concentrando: {character.concentratingOn}
      </div>
      {#if lastDamage !== null && lastDamage > 0}
        <div class="text-xs text-muted-foreground">
          CON Save DC {getConSaveDC(lastDamage)} (dano: {lastDamage})
        </div>
      {/if}
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <input
        type="number"
        bind:value={lastDamage}
        min="1"
        placeholder="Dano"
        class="w-16 px-2 py-1 bg-secondary border border-input rounded text-xs text-foreground placeholder:text-muted-foreground"
      />
      <button
        onclick={dropConcentration}
        class="p-1 text-danger hover:text-danger-dark transition-colors"
        title="Perder concentração"
      >
        <X size={18} />
      </button>
    </div>
  </div>
{/if}
