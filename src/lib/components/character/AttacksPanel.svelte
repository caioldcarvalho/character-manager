<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import {
    calculateWeaponAttackBonus,
    calculateWeaponDamageBonus,
    formatDamageRoll
  } from '$lib/utils/character';
  import { Sword, Trash2, Dices, Swords } from 'lucide-svelte';

  const character = $derived(appStore.activeCharacter);

  const weaponAttacks = $derived(() => {
    if (!character) return [];

    return character.weapons
      .filter(w => w.equipped)
      .map(weapon => ({
        weapon,
        attackBonus: calculateWeaponAttackBonus(character, weapon),
        damageBonus: calculateWeaponDamageBonus(character, weapon)
      }));
  });

  const damageSpells = $derived(() => {
    if (!character) return [];

    const prepared = character.knownSpells.filter(s => character.preparedSpells.includes(s.name));
    return prepared.filter(s => s.description.toLowerCase().includes('dano'));
  });

  let rollResults = $state<Record<string, { attack: number; damage?: string; timestamp: number }>>({});
  let showAddWeapon = $state(false);
  let newWeapon = $state({
    name: '',
    type: 'melee' as 'melee' | 'ranged',
    damageType: 'slashing' as 'slashing' | 'piercing' | 'bludgeoning',
    damageDice: '1d8',
    properties: '',
    finesse: false,
    range: ''
  });

  function rollAttack(id: string, attackBonus: number, damageFormula: string) {
    const d20 = Math.floor(Math.random() * 20) + 1;
    rollResults[id] = {
      attack: d20 + attackBonus,
      damage: damageFormula,
      timestamp: Date.now()
    };

    // Auto-clear after 5 seconds
    setTimeout(() => {
      if (rollResults[id]?.timestamp === rollResults[id]?.timestamp) {
        delete rollResults[id];
        rollResults = { ...rollResults };
      }
    }, 5000);
  }

  function addWeapon() {
    if (!character || !newWeapon.name.trim()) return;

    const weapon = {
      id: `weapon-${Date.now()}`,
      name: newWeapon.name.trim(),
      type: newWeapon.type,
      damageType: newWeapon.damageType,
      damageDice: newWeapon.damageDice,
      properties: newWeapon.properties.split(',').map(p => p.trim()).filter(p => p),
      equipped: true,
      finesse: newWeapon.finesse,
      range: newWeapon.range || undefined
    };

    appStore.addWeapon(character.id, weapon);

    // Reset form
    newWeapon = {
      name: '',
      type: 'melee',
      damageType: 'slashing',
      damageDice: '1d8',
      properties: '',
      finesse: false,
      range: ''
    };
    showAddWeapon = false;
  }

  function toggleEquipped(weaponId: string) {
    if (character) {
      appStore.toggleWeaponEquipped(character.id, weaponId);
    }
  }

  function removeWeapon(weaponId: string) {
    if (character) {
      appStore.removeWeapon(character.id, weaponId);
    }
  }
</script>

{#if character}
  <Card class="p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">Ataques</h2>
      <button
        onclick={() => showAddWeapon = !showAddWeapon}
        class="px-3 py-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded text-sm font-semibold transition-colors"
      >
        {showAddWeapon ? 'Cancelar' : '+ Adicionar Arma'}
      </button>
    </div>

    {#if showAddWeapon}
      <div class="mb-4 p-4 border border-border rounded-lg bg-secondary/50">
        <h3 class="text-sm font-bold mb-3">Nova Arma</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-medium block mb-1">Nome</label>
            <input
              type="text"
              bind:value={newWeapon.name}
              placeholder="Ex: Espada Longa"
              class="w-full px-2 py-1 bg-background border border-input rounded text-sm"
            />
          </div>

          <div>
            <label class="text-xs font-medium block mb-1">Tipo</label>
            <select bind:value={newWeapon.type} class="w-full px-2 py-1 bg-background border border-input rounded text-sm">
              <option value="melee">Corpo a Corpo</option>
              <option value="ranged">À Distância</option>
            </select>
          </div>

          <div>
            <label class="text-xs font-medium block mb-1">Dado de Dano</label>
            <input
              type="text"
              bind:value={newWeapon.damageDice}
              placeholder="Ex: 1d8, 2d6"
              class="w-full px-2 py-1 bg-background border border-input rounded text-sm"
            />
          </div>

          <div>
            <label class="text-xs font-medium block mb-1">Tipo de Dano</label>
            <select bind:value={newWeapon.damageType} class="w-full px-2 py-1 bg-background border border-input rounded text-sm">
              <option value="slashing">Cortante</option>
              <option value="piercing">Perfurante</option>
              <option value="bludgeoning">Contundente</option>
            </select>
          </div>

          <div>
            <label class="text-xs font-medium block mb-1">Propriedades (separadas por vírgula)</label>
            <input
              type="text"
              bind:value={newWeapon.properties}
              placeholder="Ex: versátil, leve"
              class="w-full px-2 py-1 bg-background border border-input rounded text-sm"
            />
          </div>

          {#if newWeapon.type === 'ranged'}
            <div>
              <label class="text-xs font-medium block mb-1">Alcance</label>
              <input
                type="text"
                bind:value={newWeapon.range}
                placeholder="Ex: 30/120 pés"
                class="w-full px-2 py-1 bg-background border border-input rounded text-sm"
              />
            </div>
          {/if}

          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              id="finesse"
              bind:checked={newWeapon.finesse}
              class="w-4 h-4"
            />
            <label for="finesse" class="text-xs font-medium">Propriedade Acuidade (usa DEX ou STR)</label>
          </div>
        </div>

        <button
          onclick={addWeapon}
          disabled={!newWeapon.name.trim()}
          class="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-semibold transition-colors w-full"
        >
          Adicionar Arma
        </button>
      </div>
    {/if}

    <!-- Weapon Attacks -->
    {#if weaponAttacks().length > 0}
      <div class="space-y-3 mb-6">
        <h3 class="text-sm font-bold text-foreground/70 uppercase">Armas</h3>
        {#each weaponAttacks() as { weapon, attackBonus, damageBonus }}
          {@const damageRoll = formatDamageRoll(weapon.damageDice, damageBonus)}
          {@const rollResult = rollResults[weapon.id]}

          <div class="p-3 border border-border rounded-lg bg-background">
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <div class="font-bold">{weapon.name}</div>
                <div class="text-xs text-muted-foreground">
                  {weapon.type === 'melee' ? 'Corpo a Corpo' : 'À Distância'} • {weapon.damageType}
                  {#if weapon.properties.length > 0}
                    • {weapon.properties.join(', ')}
                  {/if}
                </div>
              </div>
              <div class="flex gap-1">
                <button
                  onclick={() => toggleEquipped(weapon.id)}
                  class="px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded transition-colors"
                  title="Desequipar"
                >
                  <Sword size={14} />
                </button>
                <button
                  onclick={() => removeWeapon(weapon.id)}
                  class="px-2 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors"
                  title="Remover"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button
                onclick={() => rollAttack(weapon.id, attackBonus, damageRoll)}
                class="px-3 py-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <Dices size={16} /> Ataque: +{attackBonus}
              </button>
              <div class="text-sm">
                <span class="font-medium">Dano:</span> {damageRoll} {weapon.damageType}
              </div>
            </div>

            {#if rollResult}
              <div class="mt-2 p-2 bg-primary/10 border border-primary/30 rounded text-sm animate-pulse">
                <strong>Resultado:</strong> Ataque = {rollResult.attack} | Dano = {rollResult.damage}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}

    <!-- All Weapons (including unequipped) -->
    {#if character.weapons.filter(w => !w.equipped).length > 0}
      <div class="space-y-2">
        <h3 class="text-sm font-bold text-foreground/70 uppercase">Armas Desequipadas</h3>
        {#each character.weapons.filter(w => !w.equipped) as weapon}
          <div class="p-2 border border-border/50 rounded bg-secondary/30 flex items-center justify-between">
            <span class="text-sm">{weapon.name}</span>
            <div class="flex gap-1">
              <button
                onclick={() => toggleEquipped(weapon.id)}
                class="px-2 py-1 text-xs bg-primary/20 hover:bg-primary/30 text-primary rounded transition-colors"
                title="Equipar"
              >
                Equipar
              </button>
              <button
                onclick={() => removeWeapon(weapon.id)}
                class="px-2 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors"
                title="Remover"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}

    <!-- Damage Spells -->
    {#if damageSpells().length > 0}
      <div class="mt-6 space-y-2">
        <h3 class="text-sm font-bold text-foreground/70 uppercase">Magias de Dano Preparadas</h3>
        {#each damageSpells() as spell}
          <div class="p-2 border border-purple-500/30 rounded bg-purple-500/10">
            <div class="flex items-center justify-between">
              <div>
                <span class="font-semibold text-sm">{spell.name}</span>
                <span class="text-xs text-muted-foreground ml-2">Nível {spell.level}</span>
              </div>
              <div class="text-xs text-purple-400">
                {spell.castingTime}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}

    {#if weaponAttacks().length === 0 && character.weapons.length === 0}
      <div class="p-4 bg-muted/50 rounded-lg text-center flex flex-col items-center">
        <Swords size={48} class="mb-2 text-muted-foreground/30" />
        <p class="text-sm text-muted-foreground">
          Nenhuma arma adicionada. Clique em "Adicionar Arma" para começar.
        </p>
      </div>
    {/if}
  </Card>
{/if}