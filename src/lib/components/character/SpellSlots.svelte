<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import { Moon } from 'lucide-svelte';

  const character = $derived(appStore.activeCharacter);

  const slotLevels = $derived(() => {
    if (!character) return [];
    return Object.entries(character.spellSlots)
      .filter(([_, slot]) => slot.max > 0)
      .map(([key, slot]) => ({
        key,
        level: parseInt(key.replace('level', '')),
        current: slot.current,
        max: slot.max
      }))
      .sort((a, b) => a.level - b.level);
  });

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

  const slotColors = [
    'bg-primary border-primary',
    'bg-magic border-magic',
    'bg-success border-success',
    'bg-warning border-warning',
    'bg-danger border-danger',
    'bg-info border-info',
    'bg-primary border-primary',
    'bg-magic border-magic',
    'bg-warning border-warning'
  ];

  function toggleSlot(level: number, slotIndex: number) {
    if (!character) return;
    const slotKey = `level${level}`;
    const slots = character.spellSlots[slotKey];
    if (!slots) return;

    const newCurrent = slotIndex < slots.current ? slots.current - 1 : slots.current + 1;
    appStore.updateSpellSlot(character.id, level, newCurrent);
  }

  function longRest() {
    if (character) {
      appStore.longRest(character.id);
    }
  }
</script>

{#if character && slotLevels().length > 0}
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
      {#each slotLevels() as slot, idx}
        <div>
          <div class="text-sm font-medium text-muted-foreground mb-2">
            Nível {slot.level}
            <span class="ml-2 text-foreground">
              {slot.current}/{slot.max}
            </span>
          </div>
          <div class="flex gap-2 flex-wrap">
            {#each Array(slot.max) as _, i}
              <button
                onclick={() => toggleSlot(slot.level, i)}
                class="w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center {i < slot.current
                  ? slotColors[idx % slotColors.length]
                  : 'bg-transparent border-muted-foreground/30 hover:border-muted-foreground'}"
                aria-label="Espaço de magia nível {slot.level} {i + 1}"
              >
                {#if i < slot.current}
                  <div class="text-primary-foreground font-bold text-xs">{romanNumerals[slot.level - 1]}</div>
                {/if}
              </button>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </Card>
{/if}
