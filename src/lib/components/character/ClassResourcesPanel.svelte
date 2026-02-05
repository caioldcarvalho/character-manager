<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import { ChevronDown, ChevronRight } from 'lucide-svelte';

  const character = $derived(appStore.activeCharacter);

  let expandedResources = $state<Set<string>>(new Set());

  function toggleResource(resourceName: string) {
    if (expandedResources.has(resourceName)) {
      expandedResources.delete(resourceName);
    } else {
      expandedResources.add(resourceName);
    }
    expandedResources = new Set(expandedResources);
  }

  function useResource(resourceName: string) {
    if (character) {
      appStore.useClassResource(character.id, resourceName);
    }
  }

  function getResourceColor(rechargeOn: string) {
    switch (rechargeOn) {
      case 'short':
        return 'bg-info/10 border-info/30 text-info-light';
      case 'long':
        return 'bg-purple-500/10 border-purple-500/30 text-purple-400';
      case 'special':
        return 'bg-warning/10 border-warning/30 text-warning-light';
      default:
        return 'bg-secondary border-border';
    }
  }

  function getRechargeLabel(rechargeOn: string) {
    switch (rechargeOn) {
      case 'short':
        return 'Descanso Curto';
      case 'long':
        return 'Descanso Longo';
      case 'special':
        return 'Especial';
      default:
        return 'Desconhecido';
    }
  }
</script>

{#if character && character.classResources && character.classResources.length > 0}
  <Card variant="glass" class="p-6 animate-fade-in">
    <h2 class="text-xl font-bold mb-4">Recursos de Classe</h2>

    <div class="space-y-2">
      {#each character.classResources as resource}
        <div class="border border-border rounded-lg overflow-hidden">
          <button
            onclick={() => toggleResource(resource.name)}
            class="w-full p-3 bg-secondary hover:bg-secondary/80 transition-colors text-left flex items-center justify-between"
          >
            <div class="flex items-center gap-3 flex-1">
              <span class="font-semibold">{resource.name}</span>
              <span class={`text-xs px-2 py-1 rounded border ${getResourceColor(resource.rechargeOn)}`}>
                {getRechargeLabel(resource.rechargeOn)}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium">
                {resource.current}/{resource.max}
              </span>
              <span class="text-muted-foreground">
                {#if expandedResources.has(resource.name)}
                  <ChevronDown size={20} />
                {:else}
                  <ChevronRight size={20} />
                {/if}
              </span>
            </div>
          </button>

          {#if expandedResources.has(resource.name)}
            <div class="p-4 bg-background border-t border-border">
              {#if resource.description}
                <p class="text-sm text-foreground/80 mb-3">{resource.description}</p>
              {/if}
              {#if resource.current > 0}
                <button
                  onclick={() => useResource(resource.name)}
                  class="px-3 py-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-semibold transition-colors"
                >
                  Usar ({resource.current} restante{resource.current !== 1 ? 's' : ''})
                </button>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </Card>
{/if}
