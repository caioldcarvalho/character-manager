<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import { generateId } from '$lib/utils/character';
  import { getFinalAbilityScore } from '$lib/utils/character';
  import { Plus, Trash2, Package, Coins, ChevronDown, ChevronRight, Minus } from 'lucide-svelte';
  import type { InventoryItem, Currency } from '$lib/types';

  const character = $derived(appStore.activeCharacter);

  const totalWeight = $derived(() => {
    if (!character?.inventory) return 0;
    return character.inventory.reduce((sum, item) => sum + item.weight * item.quantity, 0);
  });

  const carryCapacity = $derived(() => {
    if (!character) return 0;
    return getFinalAbilityScore(character, 'strength') * 15;
  });

  const encumbrancePercent = $derived(() => {
    const cap = carryCapacity();
    if (cap === 0) return 0;
    return Math.min(100, (totalWeight() / cap) * 100);
  });

  const encumbranceColor = $derived(() => {
    const pct = encumbrancePercent();
    if (pct > 100) return 'bg-danger';
    if (pct > 66) return 'bg-warning';
    return 'bg-success';
  });

  // New item form
  let showAddForm = $state(false);
  let newItem = $state({
    name: '',
    quantity: 1,
    weight: 0,
    description: '',
    type: 'equipment' as InventoryItem['type'],
    equipped: false
  });

  const currencySteps = [1000, 100, 10, 1];

  const coins: { key: keyof Currency; label: string; abbr: string; highlight?: string }[] = [
    { key: 'platinum', label: 'Platina', abbr: 'PP' },
    { key: 'gold', label: 'Ouro', abbr: 'PO', highlight: 'text-warning' },
    { key: 'silver', label: 'Prata', abbr: 'PA' },
    { key: 'copper', label: 'Cobre', abbr: 'PC' }
  ];

  // Expanded item details
  let expandedItems = $state<Set<string>>(new Set());

  const itemTypes: { value: InventoryItem['type']; label: string }[] = [
    { value: 'weapon', label: 'Arma' },
    { value: 'armor', label: 'Armadura' },
    { value: 'equipment', label: 'Equipamento' },
    { value: 'consumable', label: 'Consumível' },
    { value: 'treasure', label: 'Tesouro' },
    { value: 'other', label: 'Outro' }
  ];

  function addItem() {
    if (!character || !newItem.name.trim()) return;
    const item: InventoryItem = {
      id: generateId(),
      name: newItem.name.trim(),
      quantity: Math.max(1, newItem.quantity),
      weight: Math.max(0, newItem.weight),
      description: newItem.description.trim(),
      type: newItem.type,
      equipped: newItem.equipped
    };
    appStore.addInventoryItem(character.id, item);
    newItem = { name: '', quantity: 1, weight: 0, description: '', type: 'equipment', equipped: false };
    showAddForm = false;
  }

  function removeItem(itemId: string) {
    if (!character) return;
    appStore.removeInventoryItem(character.id, itemId);
  }

  function updateQuantity(itemId: string, delta: number) {
    if (!character) return;
    const item = character.inventory?.find(i => i.id === itemId);
    if (!item) return;
    const newQty = Math.max(0, item.quantity + delta);
    if (newQty === 0) {
      removeItem(itemId);
    } else {
      appStore.updateInventoryItem(character.id, itemId, { quantity: newQty });
    }
  }

  function toggleEquipped(itemId: string) {
    if (!character) return;
    const item = character.inventory?.find(i => i.id === itemId);
    if (!item) return;
    appStore.updateInventoryItem(character.id, itemId, { equipped: !item.equipped });
  }

  function adjustCurrency(type: keyof Currency, delta: number) {
    if (!character) return;
    const current = character.currency?.[type] || 0;
    const newVal = Math.max(0, current + delta);
    appStore.updateCurrency(character.id, { [type]: newVal });
  }

  function toggleExpanded(itemId: string) {
    if (expandedItems.has(itemId)) {
      expandedItems.delete(itemId);
    } else {
      expandedItems.add(itemId);
    }
    expandedItems = new Set(expandedItems);
  }

  function getTypeLabel(type: InventoryItem['type']): string {
    return itemTypes.find(t => t.value === type)?.label || type;
  }
</script>

{#if character}
  <div class="space-y-6">
    <!-- Currency -->
    <Card variant="glass" class="p-6 animate-fade-in">
      <div class="flex items-center gap-2 mb-4">
        <Coins size={20} class="text-warning" />
        <h2 class="text-xl font-bold">Moedas</h2>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        {#each coins as coin}
          <div class="flex flex-col items-center p-3 bg-secondary rounded-lg gap-2">
            <div class="text-xs text-muted-foreground">{coin.abbr}</div>
            <div class="text-2xl font-bold {coin.highlight || ''}">{character.currency?.[coin.key] || 0}</div>
            <div class="flex flex-col gap-1 w-full">
              {#each currencySteps as step}
                <div class="flex items-center rounded overflow-hidden border border-border">
                  <button
                    onclick={() => adjustCurrency(coin.key, -step)}
                    disabled={(character.currency?.[coin.key] || 0) < step}
                    class="px-2 py-0.5 text-xs font-bold text-danger hover:bg-danger/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span class="flex-1 text-center text-xs font-medium bg-background py-0.5">{step}</span>
                  <button
                    onclick={() => adjustCurrency(coin.key, step)}
                    class="px-2 py-0.5 text-xs font-bold text-success hover:bg-success/20 transition-colors"
                  >
                    +
                  </button>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </Card>

    <!-- Encumbrance -->
    <Card variant="glass" class="p-6 animate-fade-in">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <Package size={20} class="text-primary" />
          <h2 class="text-xl font-bold">Inventário</h2>
        </div>
        <div class="text-sm text-muted-foreground">
          {totalWeight().toFixed(1)} / {carryCapacity()} lb
        </div>
      </div>

      <!-- Encumbrance bar -->
      <div class="w-full bg-secondary rounded-full h-2 mb-4">
        <div
          class="{encumbranceColor()} h-full rounded-full transition-all duration-300"
          style="width: {encumbrancePercent()}%"
        ></div>
      </div>

      <!-- Add item button -->
      {#if !showAddForm}
        <button
          onclick={() => showAddForm = true}
          class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-semibold transition-colors mb-4"
        >
          <Plus size={16} /> Adicionar Item
        </button>
      {:else}
        <!-- Add item form -->
        <div class="p-4 bg-secondary rounded-lg mb-4 space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" bind:value={newItem.name} placeholder="Nome do item"
              class="px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground placeholder:text-muted-foreground" />
            <select bind:value={newItem.type}
              class="px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground">
              {#each itemTypes as type}
                <option value={type.value}>{type.label}</option>
              {/each}
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-muted-foreground">Quantidade</label>
              <input type="number" bind:value={newItem.quantity} min="1"
                class="w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground" />
            </div>
            <div>
              <label class="text-xs text-muted-foreground">Peso (lb)</label>
              <input type="number" bind:value={newItem.weight} min="0" step="0.1"
                class="w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground" />
            </div>
          </div>
          <textarea bind:value={newItem.description} placeholder="Descrição (opcional)" rows="2"
            class="w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground placeholder:text-muted-foreground resize-none"></textarea>
          <div class="flex gap-2">
            <button onclick={addItem}
              class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-semibold transition-colors">
              Adicionar
            </button>
            <button onclick={() => showAddForm = false}
              class="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground border border-input rounded-md text-sm transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      {/if}

      <!-- Item list -->
      {#if character.inventory && character.inventory.length > 0}
        <div class="space-y-2">
          {#each character.inventory as item}
            <div class="border border-border rounded-lg overflow-hidden">
              <div class="flex items-center gap-3 p-3 bg-secondary/50">
                <!-- Equipped toggle -->
                <button
                  onclick={() => toggleEquipped(item.id)}
                  class="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 {item.equipped
                    ? 'bg-primary border-primary'
                    : 'border-muted-foreground/30 hover:border-muted-foreground'}"
                  title={item.equipped ? 'Equipado' : 'Não equipado'}
                >
                  {#if item.equipped}
                    <div class="w-2 h-2 rounded-sm bg-primary-foreground"></div>
                  {/if}
                </button>

                <!-- Item name & type -->
                <button
                  onclick={() => toggleExpanded(item.id)}
                  class="flex-1 text-left min-w-0"
                >
                  <div class="font-semibold text-sm truncate">{item.name}</div>
                  <div class="text-xs text-muted-foreground">
                    {getTypeLabel(item.type)} - {item.weight}lb
                  </div>
                </button>

                <!-- Quantity controls -->
                <div class="flex items-center gap-1 shrink-0">
                  <button onclick={() => updateQuantity(item.id, -1)}
                    class="w-6 h-6 flex items-center justify-center bg-secondary hover:bg-secondary/80 rounded text-sm transition-colors">
                    <Minus size={12} />
                  </button>
                  <span class="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button onclick={() => updateQuantity(item.id, 1)}
                    class="w-6 h-6 flex items-center justify-center bg-secondary hover:bg-secondary/80 rounded text-sm transition-colors">
                    <Plus size={12} />
                  </button>
                </div>

                <!-- Expand toggle -->
                <button onclick={() => toggleExpanded(item.id)} class="text-muted-foreground hover:text-foreground shrink-0">
                  {#if expandedItems.has(item.id)}
                    <ChevronDown size={18} />
                  {:else}
                    <ChevronRight size={18} />
                  {/if}
                </button>
              </div>

              {#if expandedItems.has(item.id)}
                <div class="p-3 bg-background border-t border-border">
                  {#if item.description}
                    <p class="text-sm text-foreground/80 mb-2">{item.description}</p>
                  {/if}
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-muted-foreground">
                      Peso total: {(item.weight * item.quantity).toFixed(1)} lb
                    </span>
                    <button onclick={() => removeItem(item.id)}
                      class="flex items-center gap-1 px-2 py-1 text-danger hover:text-danger-dark text-xs transition-colors">
                      <Trash2 size={14} /> Remover
                    </button>
                  </div>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-8 text-muted-foreground">
          <Package size={40} class="mx-auto mb-2 opacity-30" />
          <p class="text-sm">Nenhum item no inventário</p>
        </div>
      {/if}
    </Card>
  </div>
{/if}
