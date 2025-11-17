<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import Card from '$lib/components/ui/card.svelte';

  const abilities = [
    { key: 'strength', label: 'Força', abbr: 'FOR' },
    { key: 'dexterity', label: 'Destreza', abbr: 'DES' },
    { key: 'constitution', label: 'Constituição', abbr: 'CON' },
    { key: 'intelligence', label: 'Inteligência', abbr: 'INT' },
    { key: 'wisdom', label: 'Sabedoria', abbr: 'SAB' },
    { key: 'charisma', label: 'Carisma', abbr: 'CAR' }
  ];

  function calculateModifier(score: number): string {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  function getAbilityScore(key: string): number {
    const char = appStore.activeCharacter;
    if (!char) return 10;
    return char.abilityScores[key as keyof typeof char.abilityScores] || 10;
  }

  function getFinalAbilityScore(key: string): number {
    const base = getAbilityScore(key);
    const char = appStore.activeCharacter;
    if (!char?.race) return base;

    const abilityMap: Record<string, string> = {
      strength: 'str',
      dexterity: 'dex',
      constitution: 'con',
      intelligence: 'int',
      wisdom: 'wis',
      charisma: 'cha'
    };

    const bonus = char.race.ability_bonuses.find(
      b => b.ability_score.index === abilityMap[key]
    );

    return base + (bonus?.bonus || 0);
  }
</script>

{#if appStore.state.activeTab === 'summary' && appStore.activeCharacter}
  {@const character = appStore.activeCharacter}

  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">{character.name}</h1>
        <p class="text-lg text-muted-foreground">
          {character.race?.name || 'Raça desconhecida'} {character.class?.name || 'Classe desconhecida'} - Nível {character.level}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Atributos -->
      <Card class="lg:col-span-2 p-6">
        <h2 class="text-xl font-bold mb-4">Atributos</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          {#each abilities as ability}
            {@const score = getFinalAbilityScore(ability.key)}
            <div class="flex flex-col items-center p-4 bg-secondary rounded-lg">
              <div class="text-sm text-muted-foreground font-medium">{ability.abbr}</div>
              <div class="text-3xl font-bold my-2">{score}</div>
              <div class="text-lg text-primary font-semibold">{calculateModifier(score)}</div>
              <div class="text-xs text-muted-foreground mt-1">{ability.label}</div>
            </div>
          {/each}
        </div>
      </Card>

      <!-- Info básica -->
      <Card class="p-6 space-y-4">
        <h2 class="text-xl font-bold mb-4">Informações</h2>

        <div>
          <div class="text-sm text-muted-foreground">Raça</div>
          <div class="font-semibold">{character.race?.name || 'Não definida'}</div>
        </div>

        <div>
          <div class="text-sm text-muted-foreground">Classe</div>
          <div class="font-semibold">{character.class?.name || 'Não definida'}</div>
        </div>

        <div>
          <div class="text-sm text-muted-foreground">Nível</div>
          <div class="font-semibold">{character.level}</div>
        </div>

        {#if character.race}
          <div>
            <div class="text-sm text-muted-foreground">Velocidade</div>
            <div class="font-semibold">{character.race.speed} pés</div>
          </div>

          <div>
            <div class="text-sm text-muted-foreground">Tamanho</div>
            <div class="font-semibold">{character.race.size}</div>
          </div>
        {/if}

        {#if character.class}
          <div>
            <div class="text-sm text-muted-foreground">Dado de Vida</div>
            <div class="font-semibold">d{character.class.hit_die}</div>
          </div>
        {/if}
      </Card>
    </div>

    <!-- Características raciais -->
    {#if character.race?.traits && character.race.traits.length > 0}
      <Card class="p-6">
        <h2 class="text-xl font-bold mb-4">Características Raciais</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          {#each character.race.traits as trait}
            <div class="p-3 bg-secondary rounded-lg">
              <div class="font-semibold">{trait.name}</div>
            </div>
          {/each}
        </div>
      </Card>
    {/if}

    <!-- Proficiências -->
    {#if character.class?.proficiencies && character.class.proficiencies.length > 0}
      <Card class="p-6">
        <h2 class="text-xl font-bold mb-4">Proficiências</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {#each character.class.proficiencies as prof}
            <div class="p-2 bg-secondary rounded text-sm">
              {prof.name}
            </div>
          {/each}
        </div>
      </Card>
    {/if}

    <!-- Testes de Resistência -->
    {#if character.class?.saving_throws && character.class.saving_throws.length > 0}
      <Card class="p-6">
        <h2 class="text-xl font-bold mb-4">Testes de Resistência</h2>
        <div class="flex gap-3 flex-wrap">
          {#each character.class.saving_throws as save}
            <div class="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold">
              {save.name}
            </div>
          {/each}
        </div>
      </Card>
    {/if}
  </div>
{:else if appStore.state.activeTab === 'abilities'}
  <div class="text-center py-12">
    <div class="text-6xl mb-4">⚔️</div>
    <h2 class="text-2xl font-bold mb-2">Habilidades</h2>
    <p class="text-muted-foreground">Em desenvolvimento...</p>
  </div>
{:else if appStore.state.activeTab === 'items'}
  <div class="text-center py-12">
    <div class="text-6xl mb-4">🎒</div>
    <h2 class="text-2xl font-bold mb-2">Itens</h2>
    <p class="text-muted-foreground">Em desenvolvimento...</p>
  </div>
{:else if appStore.state.activeTab === 'spells'}
  <div class="text-center py-12">
    <div class="text-6xl mb-4">✨</div>
    <h2 class="text-2xl font-bold mb-2">Magias</h2>
    <p class="text-muted-foreground">Em desenvolvimento...</p>
  </div>
{/if}
