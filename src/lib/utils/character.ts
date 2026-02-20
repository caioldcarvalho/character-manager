import type { Character, AbilityScores } from '$lib/types';
import { DND_SKILLS } from '$lib/constants/dnd';
import { getModifierTotal } from '$lib/utils/modifiers';

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

  const racial = bonus?.bonus || 0;
  const featBonus = getModifierTotal(character, `ability:${ability}`);
  return Math.min(20, base + racial + featBonus);
}

// Calculate skill bonus
export function calculateSkillBonus(character: Character, skillKey: string): number {
  const skill = character.skills[skillKey];
  if (!skill) return 0;

  const abilityScore = getFinalAbilityScore(character, skill.ability);
  const abilityModifier = calculateModifier(abilityScore);
  const proficiencyBonus = skill.proficient ? character.combatStats.proficiencyBonus : 0;

  const featBonus = getModifierTotal(character, `skill:${skillKey}`);
  return abilityModifier + proficiencyBonus + featBonus;
}

// Calculate initiative (DEX modifier)
export function calculateInitiative(character: Character): number {
  const dexScore = getFinalAbilityScore(character, 'dexterity');
  return calculateModifier(dexScore) + getModifierTotal(character, 'initiative');
}

// Get spellcasting ability for a character
function getSpellcastingAbility(character: Character): keyof AbilityScores {
  return character.spellcastingAbility || 'charisma';
}

// Calculate spell save DC (8 + proficiency + spellcasting ability modifier)
export function calculateSpellSaveDC(character: Character): number {
  const ability = getSpellcastingAbility(character);
  const abilityScore = getFinalAbilityScore(character, ability);
  const abilityMod = calculateModifier(abilityScore);
  return 8 + character.combatStats.proficiencyBonus + abilityMod + getModifierTotal(character, 'spellSaveDC');
}

// Calculate spell attack bonus (proficiency + spellcasting ability modifier)
export function calculateSpellAttackBonus(character: Character): number {
  const ability = getSpellcastingAbility(character);
  const abilityScore = getFinalAbilityScore(character, ability);
  const abilityMod = calculateModifier(abilityScore);
  return character.combatStats.proficiencyBonus + abilityMod + getModifierTotal(character, 'spellAttackBonus');
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

  return abilityModifier + character.combatStats.proficiencyBonus + getModifierTotal(character, 'weaponAttackBonus', { weaponType: weapon.type });
}

// Calculate weapon damage bonus
export function calculateWeaponDamageBonus(character: Character, weapon: any): number {
  const strScore = getFinalAbilityScore(character, 'strength');
  const dexScore = getFinalAbilityScore(character, 'dexterity');

  let base: number;
  if (weapon.finesse) {
    base = Math.max(calculateModifier(strScore), calculateModifier(dexScore));
  } else if (weapon.type === 'ranged') {
    base = calculateModifier(dexScore);
  } else {
    base = calculateModifier(strScore);
  }
  return base + getModifierTotal(character, 'weaponDamageBonus', { weaponType: weapon.type });
}

// Format damage roll
export function formatDamageRoll(dice: string, bonus: number): string {
  if (bonus === 0) return dice;
  return `${dice}${bonus >= 0 ? '+' : ''}${bonus}`;
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Format date
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Get hit dice for class
export function getHitDiceForClass(className: string): number {
  const hitDice: Record<string, number> = {
    'Barbarian': 12,
    'Fighter': 10,
    'Paladin': 10,
    'Ranger': 10,
    'Bard': 8,
    'Cleric': 8,
    'Druid': 8,
    'Monk': 8,
    'Rogue': 8,
    'Warlock': 8,
    'Sorcerer': 6,
    'Wizard': 6
  };
  return hitDice[className] || 8;
}
