<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import Card from '$lib/components/ui/card.svelte';

  let damageAmount = $state(0);
  let healAmount = $state(0);
  let tempHPAmount = $state(0);

  const character = $derived(appStore.activeCharacter);
  const hpPercentage = $derived(
    character ? (character.hitPoints.current / character.hitPoints.max) * 100 : 0
  );
  const hpColor = $derived(
    hpPercentage > 50 ? 'bg-green-500' : hpPercentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
  );

  function handleTakeDamage() {
    if (character && damageAmount > 0) {
      appStore.takeDamage(character.id, damageAmount);
      damageAmount = 0;
    }
  }

  function handleHeal() {
    if (character && healAmount > 0) {
      appStore.heal(character.id, healAmount);
      healAmount = 0;
    }
  }

  function handleSetTempHP() {
    if (character && tempHPAmount >= 0) {
      appStore.updateHP(character.id, character.hitPoints.current, tempHPAmount);
    }
  }
</script>

{#if character}
  <Card class="p-6">
    <h2 class="text-xl font-bold mb-4">Pontos de Vida</h2>

    <!-- Current/Max HP Display -->
    <div class="flex items-center justify-center mb-6">
      <div class="text-center">
        <div class="text-6xl font-bold">
          {character.hitPoints.current}
          <span class="text-3xl text-muted-foreground">/ {character.hitPoints.max}</span>
        </div>
        <div class="text-sm text-muted-foreground mt-2">Pontos de Vida</div>
      </div>
    </div>

    <!-- HP Bar -->
    <div class="mb-6">
      <div class="w-full bg-secondary rounded-full h-4 overflow-hidden">
        <div
          class="{hpColor} h-full transition-all duration-300"
          style="width: {hpPercentage}%"
        ></div>
      </div>
    </div>

    <!-- Temporary HP -->
    {#if character.hitPoints.temporary > 0}
      <div class="mb-4 p-3 bg-blue-500/20 border border-blue-500 rounded-lg">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">PV Temporários</span>
          <span class="text-lg font-bold text-blue-400">+{character.hitPoints.temporary}</span>
        </div>
      </div>
    {/if}

    <!-- Damage Input -->
    <div class="space-y-4">
      <div class="flex gap-2">
        <input
          type="number"
          bind:value={damageAmount}
          min="0"
          placeholder="Dano"
          class="flex-1 px-3 py-2 bg-secondary border border-input rounded-md text-foreground"
        />
        <button
          onclick={handleTakeDamage}
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold transition-colors"
        >
          Receber Dano
        </button>
      </div>

      <!-- Heal Input -->
      <div class="flex gap-2">
        <input
          type="number"
          bind:value={healAmount}
          min="0"
          placeholder="Cura"
          class="flex-1 px-3 py-2 bg-secondary border border-input rounded-md text-foreground"
        />
        <button
          onclick={handleHeal}
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition-colors"
        >
          Curar
        </button>
      </div>

      <!-- Temp HP Input -->
      <div class="flex gap-2">
        <input
          type="number"
          bind:value={tempHPAmount}
          min="0"
          placeholder="PV Temporário"
          class="flex-1 px-3 py-2 bg-secondary border border-input rounded-md text-foreground"
        />
        <button
          onclick={handleSetTempHP}
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors"
        >
          Definir Temp
        </button>
      </div>
    </div>
  </Card>
{/if}
