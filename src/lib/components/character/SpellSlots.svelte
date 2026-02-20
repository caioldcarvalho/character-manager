<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import { Moon } from 'lucide-svelte';

  const character = $derived(appStore.activeCharacter);

  const SLOT_COLORS: Record<number, { active: string; label: string }> = {
    1: { active: 'bg-primary border-primary', label: 'I' },
    2: { active: 'bg-magic border-magic', label: 'II' },
    3: { active: 'bg-blue-500 border-blue-500', label: 'III' },
    4: { active: 'bg-violet-500 border-violet-500', label: 'IV' },
    5: { active: 'bg-amber-500 border-amber-500', label: 'V' },
    6: { active: 'bg-rose-500 border-rose-500', label: 'VI' },
    7: { active: 'bg-cyan-500 border-cyan-500', label: 'VII' },
    8: { active: 'bg-emerald-500 border-emerald-500', label: 'VIII' },
    9: { active: 'bg-red-600 border-red-600', label: 'IX' },
  };

  const LEVEL_NAMES = ['', 'Nível 1', 'Nível 2', 'Nível 3', 'Nível 4', 'Nível 5', 'Nível 6', 'Nível 7', 'Nível 8', 'Nível 9'];

  // Get active slot levels (those with max > 0) using dynamic keys
  const activeSlotLevels = $derived.by(() => {
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

  const hasSpellSlots = $derived(activeSlotLevels.length > 0);

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

{#if character && hasSpellSlots}
  <Card variant="glass" class="p-6 animate-fade-in">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">
        Espaços de Magia
        {#if character.isWarlock}
          <span class="text-sm font-normal text-muted-foreground ml-2">(Magia de Pacto)</span>
        {/if}
      </h2>
      <button
        onclick={longRest}
        class="px-3 py-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-semibold transition-colors flex items-center gap-2"
      >
        <Moon size={16} /> Descanso Longo
      </button>
    </div>

    <div class="space-y-4">
      {#each activeSlotLevels as slot}
        {@const color = SLOT_COLORS[slot.level] || { active: 'bg-primary border-primary', label: String(slot.level) }}
        <div>
          <div class="text-sm font-medium text-muted-foreground mb-2">
            {LEVEL_NAMES[slot.level] || `Nível ${slot.level}`}
            <span class="ml-2 text-foreground">
              {slot.current}/{slot.max}
            </span>
          </div>
          <div class="flex gap-2 flex-wrap">
            {#each Array(slot.max) as _, i}
              <button
                onclick={() => toggleSlot(slot.level, i)}
                class="w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center {i < slot.current
                  ? color.active
                  : 'bg-transparent border-muted-foreground/30 hover:border-muted-foreground'}"
                aria-label="Espaço de magia {LEVEL_NAMES[slot.level] || `Nível ${slot.level}`} {i + 1}"
              >
                {#if i < slot.current}
                  <div class="text-white font-bold text-xs">{color.label}</div>
                {/if}
              </button>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </Card>
{/if}
