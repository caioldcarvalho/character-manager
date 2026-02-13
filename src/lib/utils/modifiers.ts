import type { Character, ModifierTarget, Modifier, AbilityScores } from '$lib/types';

interface ModifierContext {
  weaponType?: 'melee' | 'ranged';
}

/**
 * Sum all modifier values from enabled feats for a given target.
 */
export function getModifierTotal(
  character: Character,
  target: ModifierTarget,
  context?: ModifierContext
): number {
  if (!character.feats) return 0;

  let total = 0;
  for (const feat of character.feats) {
    if (!feat.enabled) continue;

    // Base modifiers
    total += sumMatchingModifiers(feat.modifiers, target, context);

    // Modifiers from resolved choices
    for (const choice of feat.choices) {
      if (!choice.selectedOptionId) continue;
      const option = choice.options.find(o => o.id === choice.selectedOptionId);
      if (option?.modifiers) {
        total += sumMatchingModifiers(option.modifiers, target, context);
      }
    }
  }

  return total;
}

function sumMatchingModifiers(
  modifiers: Modifier[],
  target: ModifierTarget,
  context?: ModifierContext
): number {
  let total = 0;
  for (const mod of modifiers) {
    if (mod.target !== target) continue;
    if (mod.weaponFilter && context?.weaponType && mod.weaponFilter !== context.weaponType) continue;
    total += mod.value;
  }
  return total;
}

/**
 * Check if any enabled feat grants saving throw proficiency for the given ability.
 */
export function hasFeatSavingThrowProficiency(
  character: Character,
  ability: keyof AbilityScores
): boolean {
  if (!character.feats) return false;

  for (const feat of character.feats) {
    if (!feat.enabled) continue;

    for (const prof of feat.proficiencies) {
      if (prof.type === 'savingThrow' && prof.target === ability) return true;
    }

    for (const choice of feat.choices) {
      if (!choice.selectedOptionId) continue;
      const option = choice.options.find(o => o.id === choice.selectedOptionId);
      if (option?.proficiencies) {
        for (const prof of option.proficiencies) {
          if (prof.type === 'savingThrow' && prof.target === ability) return true;
        }
      }
    }
  }

  return false;
}

/**
 * Get the highest skill proficiency level granted by feats.
 * Returns 'none', 'proficient', or 'expertise'.
 */
export function getFeatSkillProficiency(
  character: Character,
  skillKey: string
): 'none' | 'proficient' | 'expertise' {
  if (!character.feats) return 'none';

  let best: 'none' | 'proficient' | 'expertise' = 'none';

  for (const feat of character.feats) {
    if (!feat.enabled) continue;

    const allProficiencies = [...feat.proficiencies];
    for (const choice of feat.choices) {
      if (!choice.selectedOptionId) continue;
      const option = choice.options.find(o => o.id === choice.selectedOptionId);
      if (option?.proficiencies) {
        allProficiencies.push(...option.proficiencies);
      }
    }

    for (const prof of allProficiencies) {
      if (prof.target !== skillKey) continue;
      if (prof.type === 'expertise') return 'expertise';
      if (prof.type === 'savingThrow') continue; // not a skill prof
    }
  }

  return best;
}
