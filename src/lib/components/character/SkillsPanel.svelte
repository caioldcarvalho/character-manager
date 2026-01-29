<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import { calculateSkillBonus, formatModifier } from '$lib/utils/character';

  const character = $derived(appStore.activeCharacter);

  // Group skills by ability
  const skillsByAbility = $derived(() => {
    if (!character) return {};

    const grouped: Record<string, Array<{ key: string; skill: any; bonus: number }>> = {};

    Object.entries(character.skills).forEach(([key, skill]) => {
      if (!grouped[skill.ability]) {
        grouped[skill.ability] = [];
      }

      const bonus = calculateSkillBonus(character, key);
      grouped[skill.ability].push({ key, skill, bonus });
    });

    // Sort within each group
    Object.values(grouped).forEach(skills => {
      skills.sort((a, b) => a.skill.name.localeCompare(b.skill.name));
    });

    return grouped;
  });

  const abilityNames: Record<string, string> = {
    strength: 'Força',
    dexterity: 'Destreza',
    constitution: 'Constituição',
    intelligence: 'Inteligência',
    wisdom: 'Sabedoria',
    charisma: 'Carisma'
  };

  function toggleProficiency(skillKey: string) {
    if (character) {
      appStore.toggleSkillProficiency(character.id, skillKey);
    }
  }
</script>

{#if character}
  <Card class="p-6">
    <h2 class="text-xl font-bold mb-4">Perícias</h2>

    <div class="space-y-6">
      {#each Object.entries(skillsByAbility()) as [ability, skills]}
        <div>
          <h3 class="text-sm font-bold text-foreground/70 uppercase mb-3">
            {abilityNames[ability]}
          </h3>
          <div class="space-y-1">
            {#each skills as { key, skill, bonus }}
              <button
                onclick={() => toggleProficiency(key)}
                class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left {skill.proficient
                  ? 'bg-primary/10 border border-primary/30'
                  : 'bg-background border border-border'}"
              >
                <!-- Proficiency Indicator -->
                <div
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center {skill.proficient
                    ? 'bg-primary border-primary'
                    : 'border-muted-foreground/30'}"
                >
                  {#if skill.proficient}
                    <div class="w-3 h-3 rounded-full bg-primary-foreground"></div>
                  {/if}
                </div>

                <!-- Skill Name -->
                <div class="flex-1 font-medium {skill.proficient ? 'text-primary' : ''}">
                  {skill.name}
                </div>

                <!-- Bonus -->
                <div class="text-xl font-bold {skill.proficient ? 'text-primary' : 'text-muted-foreground'}">
                  {bonus >= 0 ? '+' : ''}{bonus}
                </div>
              </button>
            {/each}
          </div>
        </div>
      {/each}
    </div>

    <div class="mt-6 p-4 bg-muted/50 rounded-lg">
      <p class="text-sm text-muted-foreground">
        Clique em uma perícia para alternar a proficiência. Perícias com proficiência adicionam seu
        bônus de proficiência (+{character.combatStats.proficiencyBonus}) ao modificador de atributo.
      </p>
    </div>
  </Card>
{/if}
