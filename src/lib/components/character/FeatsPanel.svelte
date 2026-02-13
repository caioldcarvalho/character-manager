<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import { FEAT_CATALOG } from '$lib/constants/feats';
  import type { CharacterFeat, FeatDefinition } from '$lib/types';
  import { Plus, Trash2, ChevronDown, ChevronRight, Power, Minus, Search, X } from 'lucide-svelte';

  const character = $derived(appStore.activeCharacter);

  let showAddPanel = $state(false);
  let addMode = $state<'catalog' | 'custom'>('catalog');
  let searchQuery = $state('');
  let expandedFeats = $state<Set<number>>(new Set());

  // Custom feat form
  let customName = $state('');
  let customDescription = $state('');
  let customModifiers = $state<{ target: string; value: number }[]>([]);

  const filteredCatalog = $derived(
    FEAT_CATALOG.filter(f => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q);
    })
  );

  function toggleExpand(index: number) {
    if (expandedFeats.has(index)) {
      expandedFeats.delete(index);
    } else {
      expandedFeats.add(index);
    }
    expandedFeats = new Set(expandedFeats);
  }

  function addFromCatalog(def: FeatDefinition) {
    if (!character) return;
    const feat: CharacterFeat = {
      definitionId: def.id,
      name: def.name,
      description: def.description,
      enabled: true,
      modifiers: [...def.modifiers.map(m => ({ ...m }))],
      proficiencies: [...def.proficiencies.map(p => ({ ...p }))],
      resources: [...def.resources.map(r => ({ ...r }))],
      choices: def.choices.map(c => ({
        ...c,
        options: c.options.map(o => ({ ...o, modifiers: o.modifiers?.map(m => ({ ...m })), proficiencies: o.proficiencies?.map(p => ({ ...p })) })),
        selectedOptionId: undefined
      }))
    };
    appStore.addFeat(character.id, feat);
    showAddPanel = false;
    searchQuery = '';
  }

  function addCustomFeat() {
    if (!character || !customName.trim()) return;
    const feat: CharacterFeat = {
      definitionId: 'custom',
      name: customName.trim(),
      description: customDescription.trim(),
      enabled: true,
      modifiers: customModifiers
        .filter(m => m.target && m.value !== 0)
        .map(m => ({ target: m.target as any, value: m.value })),
      proficiencies: [],
      resources: [],
      choices: []
    };
    appStore.addFeat(character.id, feat);
    showAddPanel = false;
    customName = '';
    customDescription = '';
    customModifiers = [];
  }

  function addCustomModifierRow() {
    customModifiers = [...customModifiers, { target: '', value: 0 }];
  }

  function removeCustomModifier(index: number) {
    customModifiers = customModifiers.filter((_, i) => i !== index);
  }

  const modifierTargetOptions = [
    { value: 'ability:strength', label: '+FOR' },
    { value: 'ability:dexterity', label: '+DES' },
    { value: 'ability:constitution', label: '+CON' },
    { value: 'ability:intelligence', label: '+INT' },
    { value: 'ability:wisdom', label: '+SAB' },
    { value: 'ability:charisma', label: '+CAR' },
    { value: 'initiative', label: 'Iniciativa' },
    { value: 'armorClass', label: 'CA' },
    { value: 'speed', label: 'Velocidade' },
    { value: 'passive:perception', label: 'Percepção Passiva' },
    { value: 'passive:investigation', label: 'Investigação Passiva' },
    { value: 'spellSaveDC', label: 'CD de Magia' },
    { value: 'spellAttackBonus', label: 'Ataque Mágico' },
    { value: 'weaponAttackBonus', label: 'Ataque com Arma' },
    { value: 'weaponDamageBonus', label: 'Dano com Arma' },
    { value: 'hitPointsMaxPerLevel', label: 'HP Máx/Nível' },
    { value: 'skill:perception', label: 'Percepção' },
    { value: 'skill:athletics', label: 'Atletismo' },
    { value: 'skill:stealth', label: 'Furtividade' },
    { value: 'skill:acrobatics', label: 'Acrobacia' },
    { value: 'save:strength', label: 'Save FOR' },
    { value: 'save:dexterity', label: 'Save DES' },
    { value: 'save:constitution', label: 'Save CON' },
    { value: 'save:intelligence', label: 'Save INT' },
    { value: 'save:wisdom', label: 'Save SAB' },
    { value: 'save:charisma', label: 'Save CAR' }
  ];

  function formatModifierTarget(target: string): string {
    const opt = modifierTargetOptions.find(o => o.value === target);
    return opt?.label || target;
  }
</script>

{#if character}
  <Card variant="glass" class="p-6 animate-fade-in">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">Talentos</h2>
      <button
        onclick={() => { showAddPanel = !showAddPanel; addMode = 'catalog'; }}
        class="flex items-center gap-1 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-semibold transition-colors"
      >
        {#if showAddPanel}
          <X size={16} />
          Cancelar
        {:else}
          <Plus size={16} />
          Adicionar
        {/if}
      </button>
    </div>

    <!-- Add Panel -->
    {#if showAddPanel}
      <div class="mb-6 p-4 bg-secondary rounded-lg border border-border">
        <!-- Tab switcher -->
        <div class="flex gap-2 mb-4">
          <button
            onclick={() => addMode = 'catalog'}
            class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors {addMode === 'catalog' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-background/80'}"
          >
            Catálogo
          </button>
          <button
            onclick={() => addMode = 'custom'}
            class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors {addMode === 'custom' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-background/80'}"
          >
            Customizado
          </button>
        </div>

        {#if addMode === 'catalog'}
          <!-- Search -->
          <div class="relative mb-3">
            <Search size={16} class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              bind:value={searchQuery}
              placeholder="Buscar talento..."
              class="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-md text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <!-- Catalog list -->
          <div class="space-y-2 max-h-64 overflow-y-auto">
            {#each filteredCatalog as feat}
              <button
                onclick={() => addFromCatalog(feat)}
                class="w-full text-left p-3 bg-background hover:bg-background/80 rounded-lg transition-colors"
              >
                <div class="font-semibold text-sm">{feat.name}</div>
                <div class="text-xs text-muted-foreground mt-1 line-clamp-2">{feat.description}</div>
                {#if feat.modifiers.length > 0 || feat.choices.length > 0}
                  <div class="flex flex-wrap gap-1 mt-2">
                    {#each feat.modifiers as mod}
                      <span class="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                        {mod.value > 0 ? '+' : ''}{mod.value} {formatModifierTarget(mod.target)}
                      </span>
                    {/each}
                    {#each feat.choices as choice}
                      <span class="text-xs px-1.5 py-0.5 bg-warning/20 text-warning rounded">
                        Escolha: {choice.label}
                      </span>
                    {/each}
                  </div>
                {/if}
              </button>
            {/each}
          </div>
        {:else}
          <!-- Custom feat form -->
          <div class="space-y-3">
            <input
              type="text"
              bind:value={customName}
              placeholder="Nome do talento"
              class="w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground"
            />
            <textarea
              bind:value={customDescription}
              placeholder="Descrição"
              rows="2"
              class="w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground resize-none"
            ></textarea>

            <!-- Modifier builder -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium">Modificadores</span>
                <button onclick={addCustomModifierRow} class="text-xs text-primary hover:underline">+ Adicionar</button>
              </div>
              {#each customModifiers as mod, i}
                <div class="flex gap-2 mb-2">
                  <select
                    bind:value={customModifiers[i].target}
                    class="flex-1 px-2 py-1.5 bg-background border border-input rounded-md text-sm text-foreground"
                  >
                    <option value="">Alvo...</option>
                    {#each modifierTargetOptions as opt}
                      <option value={opt.value}>{opt.label}</option>
                    {/each}
                  </select>
                  <input
                    type="number"
                    bind:value={customModifiers[i].value}
                    class="w-20 px-2 py-1.5 bg-background border border-input rounded-md text-sm text-center text-foreground"
                  />
                  <button onclick={() => removeCustomModifier(i)} class="text-destructive hover:text-destructive/80">
                    <Trash2 size={14} />
                  </button>
                </div>
              {/each}
            </div>

            <button
              onclick={addCustomFeat}
              disabled={!customName.trim()}
              class="w-full px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-semibold transition-colors disabled:opacity-50"
            >
              Criar Talento
            </button>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Active feats list -->
    {#if character.feats && character.feats.length > 0}
      <div class="space-y-2">
        {#each character.feats as feat, index}
          <div class="border border-border rounded-lg overflow-hidden {feat.enabled ? '' : 'opacity-50'}">
            <div class="flex items-center gap-2 p-3 bg-secondary">
              <!-- Toggle enabled -->
              <button
                onclick={() => appStore.toggleFeatEnabled(character.id, index)}
                class="p-1 rounded transition-colors {feat.enabled ? 'text-success hover:text-success/80' : 'text-muted-foreground hover:text-foreground'}"
                title={feat.enabled ? 'Desativar' : 'Ativar'}
              >
                <Power size={16} />
              </button>

              <!-- Expand/collapse -->
              <button
                onclick={() => toggleExpand(index)}
                class="flex-1 text-left flex items-center gap-2"
              >
                <span class="text-muted-foreground">
                  {#if expandedFeats.has(index)}
                    <ChevronDown size={16} />
                  {:else}
                    <ChevronRight size={16} />
                  {/if}
                </span>
                <span class="font-semibold text-sm">{feat.name}</span>
                {#if feat.definitionId === 'custom'}
                  <span class="text-xs px-1.5 py-0.5 bg-muted-foreground/20 rounded">Custom</span>
                {/if}
              </button>

              <!-- Resource badges -->
              {#each feat.resources as resource}
                <span class="text-xs font-medium px-2 py-1 bg-primary/20 text-primary rounded">
                  {resource.current}/{resource.max}
                </span>
              {/each}

              <!-- Remove -->
              <button
                onclick={() => appStore.removeFeat(character.id, index)}
                class="p-1 text-destructive/60 hover:text-destructive transition-colors"
                title="Remover"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {#if expandedFeats.has(index)}
              <div class="p-4 bg-background border-t border-border space-y-3">
                <p class="text-sm text-foreground/80">{feat.description}</p>

                <!-- Modifier badges -->
                {#if feat.modifiers.length > 0}
                  <div class="flex flex-wrap gap-1">
                    {#each feat.modifiers as mod}
                      <span class="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                        {mod.value > 0 ? '+' : ''}{mod.value} {formatModifierTarget(mod.target)}
                      </span>
                    {/each}
                  </div>
                {/if}

                <!-- Choices -->
                {#each feat.choices as choice, ci}
                  <div>
                    <label class="text-sm font-medium block mb-1">{choice.label}</label>
                    <div class="flex flex-wrap gap-2">
                      {#each choice.options as option}
                        <button
                          onclick={() => appStore.updateFeatChoice(character.id, index, choice.id, option.id)}
                          class="px-3 py-1.5 rounded-md text-sm transition-colors {choice.selectedOptionId === option.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary hover:bg-secondary/80 border border-border'}"
                        >
                          {option.label}
                        </button>
                      {/each}
                    </div>
                  </div>
                {/each}

                <!-- Resources -->
                {#each feat.resources as resource, ri}
                  <div class="flex items-center justify-between p-2 bg-secondary rounded-lg">
                    <span class="text-sm font-medium">{resource.name}</span>
                    <div class="flex items-center gap-2">
                      <button
                        onclick={() => appStore.useFeatResource(character.id, index, resource.name)}
                        disabled={resource.current <= 0}
                        class="w-7 h-7 flex items-center justify-center bg-background rounded hover:bg-background/80 transition-colors disabled:opacity-30"
                      >
                        <Minus size={14} />
                      </button>
                      <span class="text-lg font-bold min-w-[3ch] text-center">
                        {resource.current}/{resource.max}
                      </span>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {:else if !showAddPanel}
      <p class="text-sm text-muted-foreground text-center py-4">Nenhum talento adicionado</p>
    {/if}
  </Card>
{/if}
