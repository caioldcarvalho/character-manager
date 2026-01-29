<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import { ChevronDown, ChevronRight } from 'lucide-svelte';

  const character = $derived(appStore.activeCharacter);

  let expandedFeatures = $state<Set<string>>(new Set());

  function toggleFeature(featureName: string) {
    if (expandedFeatures.has(featureName)) {
      expandedFeatures.delete(featureName);
    } else {
      expandedFeatures.add(featureName);
    }
    expandedFeatures = new Set(expandedFeatures);
  }

  function useFeature(featureName: string) {
    if (character) {
      appStore.useClassFeature(character.id, featureName);
    }
  }
</script>

{#if character}
  <Card class="p-6">
    <h2 class="text-xl font-bold mb-4">Características de Classe</h2>

    <!-- Fighting Style -->
    {#if character.fightingStyle}
      <div class="mb-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <div class="font-bold text-primary">Estilo de Luta: {character.fightingStyle}</div>
      </div>
    {/if}

    <!-- Paladin Resources -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <!-- Lay on Hands -->
      <div class="p-4 bg-secondary rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <span class="font-bold">Cura pelas Mãos</span>
          <span class="text-lg font-bold text-primary">
            {character.paladinResources.layOnHands.current}/{character.paladinResources.layOnHands.max}
          </span>
        </div>
        <div class="w-full bg-background rounded-full h-2 overflow-hidden">
          <div
            class="bg-green-500 h-full transition-all"
            style="width: {(character.paladinResources.layOnHands.current / character.paladinResources.layOnHands.max) * 100}%"
          ></div>
        </div>
      </div>

      <!-- Channel Divinity -->
      <div class="p-4 bg-secondary rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <span class="font-bold">Canalizar Divindade</span>
          <span class="text-lg font-bold text-primary">
            {character.paladinResources.channelDivinity.current}/{character.paladinResources.channelDivinity.max}
          </span>
        </div>
        <div class="flex gap-1">
          {#each Array(character.paladinResources.channelDivinity.max) as _, i}
            <div
              class="flex-1 h-2 rounded-full {i < character.paladinResources.channelDivinity.current ? 'bg-yellow-500' : 'bg-background'}"
            ></div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Class Features List -->
    <div class="space-y-2">
      {#each character.classFeatures as feature}
        <div class="border border-border rounded-lg overflow-hidden">
          <button
            onclick={() => toggleFeature(feature.name)}
            class="w-full p-3 bg-secondary hover:bg-secondary/80 transition-colors text-left flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <span class="font-semibold">{feature.name}</span>
              <span class="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                Nível {feature.level}
              </span>
            </div>
            <div class="flex items-center gap-2">
              {#if feature.uses}
                <span class="text-sm font-medium">
                  {feature.uses.current}/{feature.uses.max}
                </span>
              {/if}
              <span class="text-muted-foreground">
                {#if expandedFeatures.has(feature.name)}
                  <ChevronDown size={20} />
                {:else}
                  <ChevronRight size={20} />
                {/if}
              </span>
            </div>
          </button>

          {#if expandedFeatures.has(feature.name)}
            <div class="p-4 bg-background border-t border-border">
              <p class="text-sm text-foreground/80 mb-3">{feature.description}</p>
              {#if feature.uses && feature.uses.current > 0}
                <button
                  onclick={() => useFeature(feature.name)}
                  class="px-3 py-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-semibold transition-colors"
                >
                  Usar ({feature.uses.current} restante{feature.uses.current !== 1 ? 's' : ''})
                </button>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </Card>
{/if}