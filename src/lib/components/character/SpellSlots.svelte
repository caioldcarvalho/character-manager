<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import { Moon, Zap } from 'lucide-svelte';

  const character = $derived(appStore.activeCharacter);

  function toggleSlot(level: 1 | 2, slotIndex: number) {
    if (!character) return;

    const slotKey = `level${level}` as const;
    const slots = character.spellSlots[slotKey];

    // If clicking an available slot, use it (decrement)
    // If clicking a used slot and it's the first used one, restore it (increment)
    const newCurrent = slotIndex < slots.current ? slots.current - 1 : slots.current + 1;
    appStore.updateSpellSlot(character.id, level, newCurrent);
  }

  function longRest() {
    if (character) {
      appStore.longRest(character.id);
    }
  }
</script>

{#if character}
  <Card variant="glass" class="p-6 animate-fade-in">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">Espaços de Magia</h2>
      <button
        onclick={longRest}
        class="px-3 py-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-semibold transition-colors flex items-center gap-2"
      >
        <Moon size={16} /> Descanso Longo
      </button>
    </div>

    <div class="space-y-4">
      <!-- Level 1 Slots -->
      <div>
        <div class="text-sm font-medium text-muted-foreground mb-2">
          Nível 1
          <span class="ml-2 text-foreground">
            {character.spellSlots.level1.current}/{character.spellSlots.level1.max}
          </span>
        </div>
        <div class="flex gap-2">
          {#each Array(character.spellSlots.level1.max) as _, i}
            <button
              onclick={() => toggleSlot(1, i)}
              class="w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center {i < character.spellSlots.level1.current
                ? 'bg-primary border-primary'
                : 'bg-transparent border-muted-foreground/30 hover:border-muted-foreground'}"
              aria-label="Espaço de magia nível 1 {i + 1}"
            >
              {#if i < character.spellSlots.level1.current}
                <div class="text-primary-foreground font-bold">I</div>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <!-- Level 2 Slots -->
      <div>
        <div class="text-sm font-medium text-muted-foreground mb-2">
          Nível 2
          <span class="ml-2 text-foreground">
            {character.spellSlots.level2.current}/{character.spellSlots.level2.max}
          </span>
        </div>
        <div class="flex gap-2">
          {#each Array(character.spellSlots.level2.max) as _, i}
            <button
              onclick={() => toggleSlot(2, i)}
              class="w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center {i < character.spellSlots.level2.current
                ? 'bg-magic border-magic'
                : 'bg-transparent border-muted-foreground/30 hover:border-muted-foreground'}"
              aria-label="Espaço de magia nível 2 {i + 1}"
            >
              {#if i < character.spellSlots.level2.current}
                <div class="text-magic-foreground font-bold">II</div>
              {/if}
            </button>
          {/each}
        </div>
      </div>
    </div>
  </Card>
{/if}