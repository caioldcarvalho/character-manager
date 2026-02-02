<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import { goto } from '$app/navigation';
  import Card from '$lib/components/ui/card.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import { Plus, Upload, Play, MoreVertical, Trash2 } from 'lucide-svelte';

  const characters = $derived(appStore.state.characters);

  function selectCharacter(id: string) {
    appStore.setActiveCharacter(id);
    goto('/character');
  }

  function deleteCharacter(id: string, name: string) {
    if (confirm(`Deletar o personagem "${name}"?`)) {
      appStore.deleteCharacter(id);
    }
  }

  function getHPPercentage(current: number, max: number): number {
    return (current / max) * 100;
  }

  function getHPColor(percentage: number): string {
    if (percentage > 50) return 'from-success to-success-dark';
    if (percentage > 25) return 'from-warning to-warning-dark';
    return 'from-danger to-danger-dark';
  }
</script>

<div class="min-h-screen bg-background p-6">
  <div class="container mx-auto max-w-7xl">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-4xl font-bold text-foreground mb-2">D&D 5e Character Manager</h1>
        <p class="text-muted-foreground">Gerencie seus personagens de D&D 5ª Edição</p>
      </div>
      <div class="flex gap-3">
        <Button variant="outline" onclick={() => goto('/character')}>
          <Upload size={16} /> Importar
        </Button>
        <Button variant="gradient" onclick={() => goto('/create')}>
          <Plus size={16} /> Criar Novo
        </Button>
      </div>
    </div>

    <!-- Characters Grid -->
    {#if characters.length === 0}
      <Card variant="glass" class="p-12 text-center animate-fade-in">
        <div class="mb-6 text-muted-foreground/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
        <h2 class="text-2xl font-semibold mb-4">Nenhum personagem criado</h2>
        <p class="text-muted-foreground mb-6">
          Crie seu primeiro personagem de D&D para começar!
        </p>
        <Button variant="gradient" onclick={() => goto('/create')}>
          <Plus size={16} /> Criar Personagem
        </Button>
      </Card>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each characters as character (character.id)}
          {@const hpPercentage = getHPPercentage(character.hitPoints.current, character.hitPoints.max)}
          {@const hpColor = getHPColor(hpPercentage)}

          <Card variant="glass" class="p-6 hover:border-primary/50 transition-all animate-fade-in group">
            <!-- Header -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1 min-w-0">
                <h3 class="text-2xl font-bold truncate">{character.name}</h3>
                <p class="text-muted-foreground text-sm">
                  Nível {character.level} {character.race?.name || 'Raça'} {character.class?.name || 'Classe'}
                </p>
              </div>
              <div class="relative">
                <button
                  onclick={(e) => {
                    e.stopPropagation();
                    deleteCharacter(character.id, character.name);
                  }}
                  class="p-2 hover:bg-hover rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Mais opções"
                >
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            <!-- HP Display -->
            <div class="space-y-2 mb-4">
              <div class="flex justify-between text-sm">
                <span class="text-muted-foreground">Pontos de Vida</span>
                <span class="font-semibold">
                  {character.hitPoints.current}/{character.hitPoints.max}
                </span>
              </div>
              <div class="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r {hpColor} transition-all duration-300"
                  style="width: {hpPercentage}%"
                ></div>
              </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
              <div class="p-2 bg-secondary/50 rounded">
                <div class="text-muted-foreground text-xs">CA</div>
                <div class="font-bold">{character.combatStats.armorClass}</div>
              </div>
              <div class="p-2 bg-secondary/50 rounded">
                <div class="text-muted-foreground text-xs">Iniciativa</div>
                <div class="font-bold">+{Math.floor((character.abilityScores.dexterity - 10) / 2)}</div>
              </div>
              <div class="p-2 bg-secondary/50 rounded">
                <div class="text-muted-foreground text-xs">Velocidade</div>
                <div class="font-bold">{character.combatStats.speed}ft</div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <Button
                variant="gradient"
                class="flex-1"
                onclick={() => selectCharacter(character.id)}
              >
                <Play size={16} /> Jogar
              </Button>
              <Button
                variant="outline"
                onclick={(e) => {
                  e.stopPropagation();
                  deleteCharacter(character.id, character.name);
                }}
              >
                <Trash2 size={16} />
              </Button>
            </div>

            <!-- Last updated -->
            {#if character.updatedAt}
              <div class="mt-3 text-xs text-muted-foreground text-center">
                Atualizado: {new Date(character.updatedAt).toLocaleDateString('pt-BR')}
              </div>
            {/if}
          </Card>
        {/each}
      </div>
    {/if}
  </div>
</div>
