import type { Character, AbilityScores } from '$lib/types';
import { DND_SKILLS } from '$lib/constants/dnd';

// Calculate ability modifier from score
export function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

// Format modifier with +/- sign
export function formatModifier(score: number): string {
  const modifier = calculateModifier(score);
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

// Get final ability score including racial bonuses
export function getFinalAbilityScore(character: Character, ability: keyof AbilityScores): number {
  const base = character.abilityScores[ability];
  if (!character.race) return base;

  const abilityMap: Record<keyof AbilityScores, string> = {
    strength: 'str',
    dexterity: 'dex',
    constitution: 'con',
    intelligence: 'int',
    wisdom: 'wis',
    charisma: 'cha'
  };

  const bonus = character.race.ability_bonuses.find(
    b => b.ability_score.index === abilityMap[ability]
  );

  return base + (bonus?.bonus || 0);
}

// Calculate skill bonus
export function calculateSkillBonus(character: Character, skillKey: string): number {
  const skill = character.skills[skillKey];
  if (!skill) return 0;

  const abilityScore = getFinalAbilityScore(character, skill.ability);
  const abilityModifier = calculateModifier(abilityScore);
  const proficiencyBonus = skill.proficient ? character.combatStats.proficiencyBonus : 0;

  return abilityModifier + proficiencyBonus;
}

// Calculate initiative (DEX modifier)
export function calculateInitiative(character: Character): number {
  const dexScore = getFinalAbilityScore(character, 'dexterity');
  return calculateModifier(dexScore);
}

// Calculate spell save DC (8 + proficiency + CHA modifier)
export function calculateSpellSaveDC(character: Character): number {
  const chaScore = getFinalAbilityScore(character, 'charisma');
  const chaModifier = calculateModifier(chaScore);
  return 8 + character.combatStats.proficiencyBonus + chaModifier;
}

// Calculate spell attack bonus (proficiency + CHA modifier)
export function calculateSpellAttackBonus(character: Character): number {
  const chaScore = getFinalAbilityScore(character, 'charisma');
  const chaModifier = calculateModifier(chaScore);
  return character.combatStats.proficiencyBonus + chaModifier;
}

// Calculate prepared spell count (CHA modifier + half paladin level, minimum 1)
export function calculatePreparedSpellCount(character: Character): number {
  const chaScore = getFinalAbilityScore(character, 'charisma');
  const chaModifier = calculateModifier(chaScore);
  const halfLevel = Math.floor(character.level / 2);
  return Math.max(1, chaModifier + halfLevel);
}

// Calculate weapon attack bonus
export function calculateWeaponAttackBonus(character: Character, weapon: any): number {
  const strScore = getFinalAbilityScore(character, 'strength');
  const dexScore = getFinalAbilityScore(character, 'dexterity');

  let abilityModifier: number;
  if (weapon.finesse) {
    // Use higher of STR or DEX
    abilityModifier = Math.max(calculateModifier(strScore), calculateModifier(dexScore));
  } else if (weapon.type === 'ranged') {
    abilityModifier = calculateModifier(dexScore);
  } else {
    abilityModifier = calculateModifier(strScore);
  }

  return abilityModifier + character.combatStats.proficiencyBonus;
}

// Calculate weapon damage bonus
export function calculateWeaponDamageBonus(character: Character, weapon: any): number {
  const strScore = getFinalAbilityScore(character, 'strength');
  const dexScore = getFinalAbilityScore(character, 'dexterity');

  if (weapon.finesse) {
    return Math.max(calculateModifier(strScore), calculateModifier(dexScore));
  } else if (weapon.type === 'ranged') {
    return calculateModifier(dexScore);
  } else {
    return calculateModifier(strScore);
  }
}

// Format damage roll
export function formatDamageRoll(dice: string, bonus: number): string {
  if (bonus === 0) return dice;
  return `${dice}${bonus >= 0 ? '+' : ''}${bonus}`;
}
