<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import { DND_CONDITIONS } from '$lib/constants/dnd';
  import { 
    EyeOff, VolumeX, ShieldAlert, Hand, Ban, Ghost, 
    PauseOctagon, Box, Skull, ArrowDown, Lock, Zap, 
    Moon, BatteryLow, Info
  } from 'lucide-svelte';

  const character = $derived(appStore.activeCharacter);
  const activeCount = $derived(character?.statusConditions.length || 0);

  let expandedConditions = $state<Set<string>>(new Set());

  const CONDITION_ICONS: Record<string, any> = {
    'Cego': EyeOff,
    'Surdo': VolumeX,
    'Amedrontado': ShieldAlert,
    'Agarrado': Hand,
    'Incapacitado': Ban,
    'Invisível': Ghost,
    'Paralisado': PauseOctagon,
    'Petrificado': Box,
    'Envenenado': Skull,
    'Caído': ArrowDown,
    'Contido': Lock,
    'Atordoado': Zap,
    'Inconsciente': Moon,
    'Exausto': BatteryLow
  };

  function toggleCondition(name: string) {
    if (character) {
      appStore.toggleStatusCondition(character.id, name);
    }
  }

  function toggleExpanded(name: string) {
    if (expandedConditions.has(name)) {
      expandedConditions.delete(name);
    } else {
      expandedConditions.add(name);
    }
    expandedConditions = new Set(expandedConditions);
  }

  function isActive(name: string): boolean {
    return character?.statusConditions.includes(name) || false;
  }

  function clearAll() {
    if (character) {
      appStore.clearStatusConditions(character.id);
    }
  }
</script>

{#if character}
  <Card variant="glass" class="p-6 animate-fade-in">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <h2 class="text-xl font-bold">Condições</h2>
        {#if activeCount > 0}
          <span class="px-2 py-1 bg-danger/20 text-danger-light rounded-full text-sm font-bold">
            {activeCount}
          </span>
        {/if}
      </div>
      {#if activeCount > 0}
        <button
          onclick={clearAll}
          class="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 rounded transition-colors"
        >
          Limpar Todas
        </button>
      {/if}
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {#each DND_CONDITIONS as condition}
        {@const active = isActive(condition.name)}
        {@const expanded = expandedConditions.has(condition.name)}
        {@const Icon = CONDITION_ICONS[condition.name] || Info}

        <div class="border rounded-lg overflow-hidden {active ? 'border-danger bg-danger/10' : 'border-border'}">
          <div class="flex items-center justify-between p-3 {active ? 'bg-danger/20' : 'bg-background'}">
            <button
              onclick={() => toggleCondition(condition.name)}
              class="flex-1 flex items-center gap-2 text-left hover:opacity-80 transition-opacity"
            >
              <span class="text-2xl text-foreground">
                 <Icon size={24} />
              </span>
              <span class="font-semibold text-sm {active ? 'text-danger-light' : ''}">{condition.name}</span>
            </button>
            <button
              onclick={() => toggleExpanded(condition.name)}
              class="text-muted-foreground hover:text-foreground transition-colors px-2"
              aria-label="Informações sobre {condition.name}"
            >
              <Info size={16} />
            </button>
          </div>

          {#if expanded}
            <div class="p-3 bg-background border-t border-border text-xs text-foreground/80">
              {condition.description}
            </div>
          {/if}
        </div>
      {/each}
    </div>

    {#if activeCount === 0}
      <div class="mt-4 p-4 bg-muted/50 rounded-lg text-center">
        <p class="text-sm text-muted-foreground">
          Nenhuma condição ativa. Clique em uma condição para ativá-la.
        </p>
      </div>
    {:else}
      <div class="mt-4 p-3 bg-danger/10 border border-danger/30 rounded-lg">
        <div class="text-sm font-semibold text-danger-light mb-1">Condições Ativas:</div>
        <div class="flex flex-wrap gap-2">
          {#each character.statusConditions as conditionName}
            {@const condition = DND_CONDITIONS.find(c => c.name === conditionName)}
            {@const Icon = CONDITION_ICONS[conditionName] || Info}
            {#if condition}
              <span class="px-2 py-1 bg-danger/20 text-danger-light rounded text-sm flex items-center gap-1">
                <Icon size={16} /> {condition.name}
              </span>
            {/if}
          {/each}
        </div>
      </div>
    {/if}
  </Card>
{/if}