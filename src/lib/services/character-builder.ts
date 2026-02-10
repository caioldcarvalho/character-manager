import type { ClassFeature, ClassResource, SpellSlots, ClassLevelData } from '$lib/types';
import { getClassLevel, getFeatureDetails, getClassSpellcasting } from '$lib/api';

export interface CharacterBuildData {
  classFeatures: ClassFeature[];
  spellSlots: SpellSlots;
  classResources: ClassResource[];
  maxHP: number;
  proficiencyBonus: number;
  spellcastingAbility: 'charisma' | 'intelligence' | 'wisdom' | null;
  hitDice: { type: number; max: number };
  isWarlock: boolean;
}

const EMPTY_SLOTS: SpellSlots = {
  level1: { current: 0, max: 0 },
  level2: { current: 0, max: 0 },
  level3: { current: 0, max: 0 },
  level4: { current: 0, max: 0 },
  level5: { current: 0, max: 0 },
  level6: { current: 0, max: 0 },
  level7: { current: 0, max: 0 },
  level8: { current: 0, max: 0 },
  level9: { current: 0, max: 0 },
};

// Warlock uses Pact Magic (different progression, short rest recovery)
const WARLOCK_SLOT_TABLE: Record<number, { slots: number; slotLevel: number }> = {
  1: { slots: 1, slotLevel: 1 },
  2: { slots: 2, slotLevel: 1 },
  3: { slots: 2, slotLevel: 2 },
  4: { slots: 2, slotLevel: 2 },
  5: { slots: 2, slotLevel: 3 },
  6: { slots: 2, slotLevel: 3 },
  7: { slots: 2, slotLevel: 4 },
  8: { slots: 2, slotLevel: 4 },
  9: { slots: 2, slotLevel: 5 },
  10: { slots: 2, slotLevel: 5 },
  11: { slots: 3, slotLevel: 5 },
  12: { slots: 3, slotLevel: 5 },
  13: { slots: 3, slotLevel: 5 },
  14: { slots: 3, slotLevel: 5 },
  15: { slots: 3, slotLevel: 5 },
  16: { slots: 3, slotLevel: 5 },
  17: { slots: 4, slotLevel: 5 },
  18: { slots: 4, slotLevel: 5 },
  19: { slots: 4, slotLevel: 5 },
  20: { slots: 4, slotLevel: 5 },
};

function buildWarlockSlots(level: number): SpellSlots {
  const slots = { ...EMPTY_SLOTS };
  const pact = WARLOCK_SLOT_TABLE[level];
  if (!pact) return slots;

  const key = `level${pact.slotLevel}` as keyof SpellSlots;
  slots[key] = { current: pact.slots, max: pact.slots };
  return slots;
}

function buildSpellSlotsFromAPI(levelData: ClassLevelData): SpellSlots {
  if (!levelData.spellcasting) return { ...EMPTY_SLOTS };

  const sc = levelData.spellcasting;
  return {
    level1: { current: sc.spell_slots_level_1, max: sc.spell_slots_level_1 },
    level2: { current: sc.spell_slots_level_2, max: sc.spell_slots_level_2 },
    level3: { current: sc.spell_slots_level_3, max: sc.spell_slots_level_3 },
    level4: { current: sc.spell_slots_level_4, max: sc.spell_slots_level_4 },
    level5: { current: sc.spell_slots_level_5, max: sc.spell_slots_level_5 },
    level6: { current: sc.spell_slots_level_6, max: sc.spell_slots_level_6 },
    level7: { current: sc.spell_slots_level_7, max: sc.spell_slots_level_7 },
    level8: { current: sc.spell_slots_level_8, max: sc.spell_slots_level_8 },
    level9: { current: sc.spell_slots_level_9, max: sc.spell_slots_level_9 },
  };
}

function calculateMaxHP(hitDie: number, level: number, conModifier: number): number {
  // Level 1: max hit die + CON modifier
  // Each additional level: average roll + CON modifier
  const averageRoll = Math.floor(hitDie / 2) + 1;
  return hitDie + conModifier + (level - 1) * (averageRoll + conModifier);
}

const ABILITY_MAP: Record<string, 'charisma' | 'intelligence' | 'wisdom'> = {
  cha: 'charisma',
  int: 'intelligence',
  wis: 'wisdom',
};

// Map class_specific fields to ClassResource
function mapClassResources(classIndex: string, classSpecific: Record<string, any> | undefined, level: number): ClassResource[] {
  if (!classSpecific) return [];

  const resources: ClassResource[] = [];

  switch (classIndex) {
    case 'fighter': {
      if (classSpecific.action_surges !== undefined && classSpecific.action_surges > 0) {
        resources.push({
          name: 'Surto de Ação',
          current: classSpecific.action_surges,
          max: classSpecific.action_surges,
          rechargeOn: 'short',
          description: 'Você pode realizar uma ação adicional no seu turno.',
        });
      }
      if (classSpecific.indomitable_uses !== undefined && classSpecific.indomitable_uses > 0) {
        resources.push({
          name: 'Indomável',
          current: classSpecific.indomitable_uses,
          max: classSpecific.indomitable_uses,
          rechargeOn: 'long',
          description: 'Você pode refazer um teste de resistência falho.',
        });
      }
      break;
    }
    case 'barbarian': {
      if (classSpecific.rage_count !== undefined && classSpecific.rage_count > 0) {
        resources.push({
          name: 'Fúria',
          current: classSpecific.rage_count,
          max: classSpecific.rage_count,
          rechargeOn: 'long',
          description: `Bônus de dano da Fúria: +${classSpecific.rage_damage_bonus || 2}.`,
        });
      }
      if (classSpecific.brutal_critical_dice !== undefined && classSpecific.brutal_critical_dice > 0) {
        resources.push({
          name: 'Crítico Brutal',
          current: classSpecific.brutal_critical_dice,
          max: classSpecific.brutal_critical_dice,
          rechargeOn: 'special',
          description: `Dados extras de crítico brutal: ${classSpecific.brutal_critical_dice}.`,
        });
      }
      break;
    }
    case 'monk': {
      if (classSpecific.ki_points !== undefined && classSpecific.ki_points > 0) {
        resources.push({
          name: 'Pontos de Ki',
          current: classSpecific.ki_points,
          max: classSpecific.ki_points,
          rechargeOn: 'short',
          description: 'Pontos de Ki para alimentar habilidades monásticas.',
        });
      }
      break;
    }
    case 'sorcerer': {
      if (classSpecific.sorcery_points !== undefined && classSpecific.sorcery_points > 0) {
        resources.push({
          name: 'Pontos de Feitiçaria',
          current: classSpecific.sorcery_points,
          max: classSpecific.sorcery_points,
          rechargeOn: 'long',
          description: 'Pontos para Metamagia e criação de espaços de magia.',
        });
      }
      break;
    }
    case 'warlock': {
      if (classSpecific.invocations_known !== undefined && classSpecific.invocations_known > 0) {
        resources.push({
          name: 'Invocações Conhecidas',
          current: classSpecific.invocations_known,
          max: classSpecific.invocations_known,
          rechargeOn: 'special',
          description: `Invocações Eldritch conhecidas: ${classSpecific.invocations_known}.`,
        });
      }
      break;
    }
    case 'bard': {
      if (classSpecific.bardic_inspiration_die !== undefined) {
        const chaLevel = level >= 5 ? Math.max(1, level) : level;
        const uses = Math.max(1, 1); // Will be overridden by CHA mod at runtime
        resources.push({
          name: 'Inspiração Bárdica',
          current: uses,
          max: uses,
          rechargeOn: level >= 5 ? 'short' : 'long',
          description: `Dado de inspiração: d${classSpecific.bardic_inspiration_die}.`,
        });
      }
      break;
    }
    case 'cleric': {
      if (classSpecific.channel_divinity_charges !== undefined && classSpecific.channel_divinity_charges > 0) {
        resources.push({
          name: 'Canalizar Divindade',
          current: classSpecific.channel_divinity_charges,
          max: classSpecific.channel_divinity_charges,
          rechargeOn: 'short',
          description: 'Canalizar energia divina para efeitos especiais.',
        });
      }
      break;
    }
    case 'paladin': {
      if (classSpecific.aura_range !== undefined && classSpecific.aura_range > 0) {
        resources.push({
          name: 'Alcance da Aura',
          current: classSpecific.aura_range,
          max: classSpecific.aura_range,
          rechargeOn: 'special',
          description: `Suas auras se estendem por ${classSpecific.aura_range} pés.`,
        });
      }
      break;
    }
    case 'druid': {
      if (classSpecific.wild_shape_max_cr !== undefined) {
        resources.push({
          name: 'Forma Selvagem',
          current: 2,
          max: 2,
          rechargeOn: 'short',
          description: `CR máximo: ${classSpecific.wild_shape_max_cr}. ${classSpecific.wild_shape_fly ? 'Pode voar.' : ''} ${classSpecific.wild_shape_swim ? 'Pode nadar.' : ''}`,
        });
      }
      break;
    }
    case 'ranger': {
      if (classSpecific.favored_enemies !== undefined && classSpecific.favored_enemies > 0) {
        resources.push({
          name: 'Inimigos Favoritos',
          current: classSpecific.favored_enemies,
          max: classSpecific.favored_enemies,
          rechargeOn: 'special',
          description: `Inimigos favoritos: ${classSpecific.favored_enemies}.`,
        });
      }
      break;
    }
    case 'rogue': {
      if (classSpecific.sneak_attack) {
        resources.push({
          name: 'Ataque Furtivo',
          current: classSpecific.sneak_attack.dice_count,
          max: classSpecific.sneak_attack.dice_count,
          rechargeOn: 'special',
          description: `Dano: ${classSpecific.sneak_attack.dice_count}d${classSpecific.sneak_attack.dice_value}.`,
        });
      }
      break;
    }
    case 'wizard': {
      if (classSpecific.arcane_recovery_levels !== undefined && classSpecific.arcane_recovery_levels > 0) {
        resources.push({
          name: 'Recuperação Arcana',
          current: 1,
          max: 1,
          rechargeOn: 'long',
          description: `Recupere até ${classSpecific.arcane_recovery_levels} níveis de espaços de magia em um descanso curto.`,
        });
      }
      break;
    }
  }

  return resources;
}

export async function buildCharacterData(
  classIndex: string,
  level: number,
  conModifier: number,
  hitDie: number
): Promise<CharacterBuildData> {
  const isWarlock = classIndex === 'warlock';

  // Fetch level data and features in parallel
  const levelData = await getClassLevel(classIndex, level);

  // Fetch all features for levels 1 through current level
  const featurePromises: Promise<ClassFeature>[] = [];
  const allFeatureRefs: { index: string; level: number }[] = [];

  // We need features from all levels 1..level
  const levelPromises = [];
  for (let l = 1; l <= level; l++) {
    if (l === level) {
      // Already have this one
      levelPromises.push(Promise.resolve(levelData));
    } else {
      levelPromises.push(getClassLevel(classIndex, l));
    }
  }

  const allLevels = await Promise.all(levelPromises);

  for (const ld of allLevels) {
    for (const feat of ld.features) {
      allFeatureRefs.push({ index: feat.index, level: ld.level });
    }
  }

  // Fetch feature details (batch, max 20 to avoid overwhelming the API)
  const featureDetails = await Promise.all(
    allFeatureRefs.map(async (ref) => {
      try {
        const detail = await getFeatureDetails(ref.index);
        return {
          name: detail.name,
          description: detail.desc.join('\n'),
          level: ref.level,
        } as ClassFeature;
      } catch {
        return {
          name: ref.index.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          description: '',
          level: ref.level,
        } as ClassFeature;
      }
    })
  );

  // Spell slots
  let spellSlots: SpellSlots;
  if (isWarlock) {
    spellSlots = buildWarlockSlots(level);
  } else {
    spellSlots = buildSpellSlotsFromAPI(levelData);
  }

  // Spellcasting ability
  let spellcastingAbility: 'charisma' | 'intelligence' | 'wisdom' | null = null;
  try {
    const scInfo = await getClassSpellcasting(classIndex);
    const abilityIndex = scInfo.spellcasting_ability?.index;
    if (abilityIndex && ABILITY_MAP[abilityIndex]) {
      spellcastingAbility = ABILITY_MAP[abilityIndex];
    }
  } catch {
    // Class has no spellcasting (Fighter, Barbarian, Rogue, Monk)
  }

  // Class resources from class_specific
  const classResources = mapClassResources(classIndex, levelData.class_specific, level);

  return {
    classFeatures: featureDetails,
    spellSlots,
    classResources,
    maxHP: calculateMaxHP(hitDie, level, conModifier),
    proficiencyBonus: levelData.prof_bonus,
    spellcastingAbility,
    hitDice: { type: hitDie, max: level },
    isWarlock,
  };
}

export { EMPTY_SLOTS };
