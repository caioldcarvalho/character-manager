<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import { calculateModifier } from '$lib/utils/character';
  import { Moon, Sunrise, Dices, Star } from 'lucide-svelte';

  const character = $derived(appStore.activeCharacter);
  const hitDice = $derived(character?.hitDice);
  const conModifier = $derived(
    character ? calculateModifier(character.abilityScores.constitution) : 0
  );

  let diceToSpend = $state(1);
  let healingRoll = $state<number | null>(null);
  let showShortRestOptions = $state(false);

  function rollHitDice() {
    if (!character || !hitDice || diceToSpend > hitDice.current) return;

    let totalHealing = 0;
    for (let i = 0; i < diceToSpend; i++) {
      const roll = Math.floor(Math.random() * hitDice.type) + 1;
      totalHealing += roll + conModifier;
    }

    healingRoll = totalHealing;
    appStore.shortRest(character.id, diceToSpend, totalHealing);

    // Reset after 3 seconds
    setTimeout(() => {
      healingRoll = null;
      showShortRestOptions = false;
      diceToSpend = 1;
    }, 3000);
  }

  function longRest() {
    if (!character) return;
    if (confirm('Fazer um descanso longo? Isso restaurará HP, espaços de magia, dados de vida e características de classe.')) {
      appStore.longRest(character.id);
    }
  }

  function toggleInspiration() {
    if (character) {
      appStore.toggleInspiration(character.id);
    }
  }
</script>

{#if character && hitDice}
  <Card variant="glass" class="p-6 animate-fade-in">
    <h2 class="text-xl font-bold mb-4">Descanso & Recursos</h2>

    <!-- Hit Dice Display -->
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-muted-foreground">Dados de Vida</span>
        <span class="text-lg font-bold">
          {hitDice.current}/{hitDice.max} d{hitDice.type}
        </span>
      </div>
      <div class="flex gap-1">
        {#each Array(hitDice.max) as _, i}
          <div
            class="flex-1 h-2 rounded-full transition-all {i < hitDice.current
              ? 'bg-gradient-to-r from-success to-success-dark'
              : 'bg-muted'}"
          ></div>
        {/each}
      </div>
    </div>

    <!-- Inspiration -->
    <div class="mb-4">
      <button
        onclick={toggleInspiration}
        class="w-full px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-between {character.inspiration
          ? 'bg-warning/20 border-warning text-warning-dark animate-subtle-glow-pulse'
          : 'border-muted-foreground/30 hover:border-warning/50'}"
      >
        <div class="flex items-center gap-2">
          <Star size={20} fill={character.inspiration ? 'currentColor' : 'none'} />
          <span class="font-semibold">Inspiração</span>
        </div>
        <span class="text-sm">
          {character.inspiration ? 'Ativa' : 'Inativa'}
        </span>
      </button>
    </div>

    <!-- Short Rest -->
    <div class="mb-3">
      {#if !showShortRestOptions}
        <Button
          variant="outline"
          class="w-full justify-center"
          onclick={() => showShortRestOptions = true}
          disabled={hitDice.current === 0}
        >
          <Sunrise size={16} /> Descanso Curto
        </Button>
      {:else}
        <div class="space-y-3 p-4 bg-secondary/50 rounded-lg border border-border">
          <h3 class="text-sm font-bold">Descanso Curto</h3>

          {#if healingRoll !== null}
            <div class="p-3 bg-success/20 border border-success/50 rounded-lg text-center">
              <div class="text-sm text-muted-foreground mb-1">Você recuperou</div>
              <div class="text-3xl font-bold text-success">{healingRoll} HP</div>
            </div>
          {:else}
            <div>
              <label class="block text-sm font-medium mb-2">
                Quantos dados de vida gastar? (máx: {hitDice.current})
              </label>
              <input
                type="range"
                min="1"
                max={hitDice.current}
                bind:value={diceToSpend}
                class="w-full"
              />
              <div class="text-center text-sm text-muted-foreground mt-1">
                {diceToSpend} {diceToSpend === 1 ? 'dado' : 'dados'} (d{hitDice.type} + {conModifier >= 0 ? '+' : ''}{conModifier})
              </div>
            </div>

            <div class="flex gap-2">
              <Button variant="gradient" onclick={rollHitDice} class="flex-1">
                <Dices size={16} /> Rolar
              </Button>
              <Button variant="outline" onclick={() => showShortRestOptions = false}>
                Cancelar
              </Button>
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Long Rest -->
    <Button variant="gradient" class="w-full justify-center" onclick={longRest}>
      <Moon size={16} /> Descanso Longo
    </Button>

    <!-- Last Rest Info -->
    {#if character.restResources.lastLongRest}
      <div class="mt-3 text-xs text-muted-foreground text-center">
        Último descanso longo: {new Date(character.restResources.lastLongRest).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    {/if}
  </Card>
{/if}
