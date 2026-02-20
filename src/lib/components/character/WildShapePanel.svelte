<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import { MOON_DRUID_BEAST_FORMS } from '$lib/constants/druid';
  import Card from '$lib/components/ui/card.svelte';
  import { Leaf, ShieldAlert, Heart, Swords, ArrowLeft, Zap } from 'lucide-svelte';

  const character = $derived(appStore.activeCharacter);
  const wildShape = $derived(character?.wildShape);
  const activeForm = $derived(wildShape?.activeForm);

  let showFormSelector = $state(false);
  let damageInput = $state('');
  let healSlotLevel = $state(1);
  let showHealPicker = $state(false);

  function transform(formId: string) {
    if (character) {
      appStore.useWildShape(character.id, formId);
      showFormSelector = false;
    }
  }

  function revert() {
    if (character) {
      appStore.revertWildShape(character.id);
    }
  }

  function applyDamage() {
    const dmg = parseInt(damageInput);
    if (character && dmg > 0) {
      appStore.takeBeastDamage(character.id, dmg);
      damageInput = '';
    }
  }

  function healWithSlot() {
    if (!character || !activeForm) return;
    const slotKey = `level${healSlotLevel}`;
    const slot = character.spellSlots[slotKey];
    if (!slot || slot.current <= 0) return;

    // Roll 1d8 per slot level
    let total = 0;
    for (let i = 0; i < healSlotLevel; i++) {
      total += Math.floor(Math.random() * 8) + 1;
    }

    appStore.useSpellSlot(character.id, healSlotLevel);
    appStore.healBeastForm(character.id, total);
    showHealPicker = false;
  }

  function getHPPercentage(current: number, max: number): number {
    return Math.max(0, (current / max) * 100);
  }

  function getHPBarColor(pct: number): string {
    if (pct > 50) return 'bg-success';
    if (pct > 25) return 'bg-warning';
    return 'bg-danger';
  }

  function canAfford(isElemental?: boolean): boolean {
    if (!wildShape) return false;
    return wildShape.usesRemaining >= (isElemental ? 2 : 1);
  }

  function getAvailableHealSlots(): number[] {
    if (!character) return [];
    const levels: number[] = [];
    for (let i = 1; i <= 9; i++) {
      const slot = character.spellSlots[`level${i}`];
      if (slot && slot.current > 0) levels.push(i);
    }
    return levels;
  }
</script>

{#if character && wildShape}
  <Card variant="glass" class="p-6 animate-fade-in">
    {#if activeForm}
      <!-- TRANSFORMED STATE -->
      <div class="space-y-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold flex items-center gap-2">
              <Leaf size={24} class="text-success" />
              {activeForm.name}
            </h2>
            <p class="text-sm text-muted-foreground">{activeForm.nameIxalan} &mdash; ND {activeForm.cr}</p>
          </div>
          {#if activeForm.isElemental}
            <span class="px-2 py-1 text-xs font-bold bg-warning/20 text-warning rounded">Elemental</span>
          {/if}
        </div>

        <!-- Beast HP Bar -->
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="font-semibold flex items-center gap-1">
              <Heart size={14} class="text-success" /> PV da Forma
            </span>
            <span class="font-bold text-lg">
              {activeForm.currentHP} / {activeForm.maxHP}
            </span>
          </div>
          <div class="h-4 bg-secondary rounded-full overflow-hidden">
            <div
              class="h-full {getHPBarColor(getHPPercentage(activeForm.currentHP, activeForm.maxHP))} transition-all duration-300"
              style="width: {getHPPercentage(activeForm.currentHP, activeForm.maxHP)}%"
            ></div>
          </div>
        </div>

        <!-- Stats row -->
        <div class="grid grid-cols-2 gap-3">
          <div class="p-3 bg-secondary rounded-lg text-center">
            <div class="text-xs text-muted-foreground">CA</div>
            <div class="text-xl font-bold">{activeForm.armorClass}</div>
          </div>
          <div class="p-3 bg-secondary rounded-lg text-center">
            <div class="text-xs text-muted-foreground">Velocidade</div>
            <div class="text-xl font-bold">{activeForm.speed}</div>
          </div>
        </div>

        <!-- Attacks -->
        <div>
          <h3 class="font-semibold mb-2 flex items-center gap-1">
            <Swords size={16} /> Ataques
          </h3>
          <div class="space-y-2">
            {#each activeForm.attacks as attack}
              <div class="p-3 bg-secondary/50 rounded-lg">
                <div class="flex justify-between items-center">
                  <span class="font-semibold">{attack.name}</span>
                  <span class="text-sm">
                    <span class="text-primary font-bold">+{attack.attackBonus}</span>
                    &mdash;
                    <span class="text-danger font-bold">{attack.damage}</span>
                    <span class="text-muted-foreground text-xs ml-1">{attack.damageType}</span>
                  </span>
                </div>
                {#if attack.description}
                  <p class="text-xs text-muted-foreground mt-1">{attack.description}</p>
                {/if}
              </div>
            {/each}
          </div>
        </div>

        <!-- Special Abilities -->
        {#if activeForm.specialAbilities.length > 0}
          <div>
            <h3 class="font-semibold mb-2">Habilidades Especiais</h3>
            <ul class="space-y-1">
              {#each activeForm.specialAbilities as ability}
                <li class="text-sm text-foreground/80 p-2 bg-secondary/30 rounded">{ability}</li>
              {/each}
            </ul>
          </div>
        {/if}

        <!-- Damage Input -->
        <div class="flex gap-2">
          <input
            type="number"
            bind:value={damageInput}
            placeholder="Dano"
            min="1"
            class="flex-1 px-3 py-2 bg-secondary border border-border rounded-md text-foreground"
            onkeydown={(e) => e.key === 'Enter' && applyDamage()}
          />
          <button
            onclick={applyDamage}
            disabled={!damageInput || parseInt(damageInput) <= 0}
            class="px-4 py-2 bg-danger hover:bg-danger/80 text-white rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Receber Dano
          </button>
        </div>

        <!-- Combat Wild Shape Heal -->
        <div>
          {#if showHealPicker}
            {@const availableSlots = getAvailableHealSlots()}
            <div class="p-3 bg-success/10 border border-success/30 rounded-lg space-y-2">
              <p class="text-sm font-semibold">Gastar espaço de magia para curar (1d8/nível):</p>
              {#if availableSlots.length === 0}
                <p class="text-sm text-muted-foreground">Nenhum espaço de magia disponível.</p>
              {:else}
                <div class="flex flex-wrap gap-2">
                  {#each availableSlots as lvl}
                    <button
                      onclick={() => { healSlotLevel = lvl; healWithSlot(); }}
                      class="px-3 py-1 bg-success/20 hover:bg-success/40 border border-success/30 rounded text-sm font-semibold transition-colors"
                    >
                      Nível {lvl} ({lvl}d8)
                    </button>
                  {/each}
                </div>
              {/if}
              <button
                onclick={() => showHealPicker = false}
                class="text-xs text-muted-foreground hover:text-foreground"
              >
                Cancelar
              </button>
            </div>
          {:else}
            <button
              onclick={() => showHealPicker = true}
              class="w-full px-4 py-2 bg-success/20 hover:bg-success/30 border border-success/30 text-success rounded-md font-semibold transition-colors"
            >
              <span class="flex items-center justify-center gap-2">
                <Zap size={16} /> Curar com Espaço de Magia
              </span>
            </button>
          {/if}
        </div>

        <!-- Warning: No spellcasting -->
        <div class="p-3 bg-warning/10 border border-warning/30 rounded-lg">
          <p class="text-xs text-warning flex items-center gap-1">
            <ShieldAlert size={14} />
            Sem conjuração enquanto transformado (Magias de Besta: nível 18)
          </p>
        </div>

        <!-- Overflow info -->
        <div class="p-3 bg-muted/20 border border-muted rounded-lg">
          <p class="text-xs text-muted-foreground">
            Dano excedente é transferido para a forma humanoide.
          </p>
        </div>

        <!-- Revert Button -->
        <button
          onclick={revert}
          class="w-full px-4 py-3 bg-warning hover:bg-warning/80 text-warning-foreground rounded-md font-bold transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} /> Reverter Forma
        </button>
      </div>
    {:else}
      <!-- NOT TRANSFORMED STATE -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <Leaf size={24} class="text-success" />
            Forma Selvagem
          </h2>
          <div class="text-sm text-muted-foreground">
            Círculo da Lua
          </div>
        </div>

        <!-- Uses remaining -->
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold">Usos Restantes</span>
          <div class="flex gap-1">
            {#each Array(wildShape.maxUses) as _, i}
              <div
                class="w-6 h-6 rounded-full border-2 transition-colors {i < wildShape.usesRemaining
                  ? 'bg-success border-success'
                  : 'bg-secondary border-muted'}"
              ></div>
            {/each}
          </div>
        </div>

        {#if showFormSelector}
          <!-- Beast Form Grid -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-sm">Escolha uma Forma</h3>
              <button
                onclick={() => showFormSelector = false}
                class="text-xs text-muted-foreground hover:text-foreground"
              >
                Cancelar
              </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {#each MOON_DRUID_BEAST_FORMS as form}
                {@const affordable = canAfford(form.isElemental)}
                <button
                  onclick={() => transform(form.id)}
                  disabled={!affordable}
                  class="p-3 bg-secondary hover:bg-secondary/70 border border-border rounded-lg text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <div class="font-semibold text-sm">{form.name}</div>
                      <div class="text-xs text-muted-foreground">{form.nameIxalan}</div>
                    </div>
                    <span class="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded font-bold">
                      ND {form.cr}
                    </span>
                  </div>
                  <div class="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{form.maxHP} PV</span>
                    <span>CA {form.armorClass}</span>
                    <span>{form.attacks[0]?.name}</span>
                  </div>
                  {#if form.isElemental}
                    <span class="inline-block mt-1 text-xs px-1.5 py-0.5 bg-warning/20 text-warning rounded">
                      2 usos
                    </span>
                  {/if}
                </button>
              {/each}
            </div>
          </div>
        {:else}
          <!-- Transform Button -->
          <button
            onclick={() => showFormSelector = true}
            disabled={wildShape.usesRemaining === 0}
            class="w-full px-4 py-3 bg-success hover:bg-success/80 text-white rounded-md font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Leaf size={18} /> Transformar
          </button>
        {/if}

        <div class="p-3 bg-muted/20 border border-muted rounded-lg">
          <p class="text-xs text-muted-foreground">
            <span class="font-semibold">Forma Selvagem de Combate:</span> Use como ação bônus. Recupera 2 usos em descanso curto ou longo.
          </p>
        </div>
      </div>
    {/if}
  </Card>
{/if}
