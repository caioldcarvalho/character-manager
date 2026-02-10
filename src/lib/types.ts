export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

// HP tracking
export interface HitPoints {
  current: number;
  max: number;
  temporary: number;
}

// Combat stats
export interface CombatStats {
  initiative: number;
  armorClass: number;
  speed: number;
  proficiencyBonus: number;
}

// Skill system
export interface Skill {
  name: string;
  ability: keyof AbilityScores;
  proficient: boolean;
}

// Spell slot entry
export interface SpellSlotEntry {
  current: number;
  max: number;
}

// Spell slots by level (1-9)
export interface SpellSlots {
  level1: SpellSlotEntry;
  level2: SpellSlotEntry;
  level3: SpellSlotEntry;
  level4: SpellSlotEntry;
  level5: SpellSlotEntry;
  level6: SpellSlotEntry;
  level7: SpellSlotEntry;
  level8: SpellSlotEntry;
  level9: SpellSlotEntry;
}

// Individual spell
export interface Spell {
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  duration: string;
  concentration: boolean;
  description: string;
  prepared: boolean;
}

// Class features
export interface ClassFeature {
  name: string;
  description: string;
  level: number;
  uses?: { current: number; max: number };
}

// Generic class resource
export interface ClassResource {
  name: string;
  current: number;
  max: number;
  rechargeOn: 'short' | 'long' | 'special';
  description?: string;
}

// Psionic Dice for Psi Warrior
export interface PsionicDice {
  current: number;
  max: number;  // 2 × proficiency bonus
  dieSize: number;  // 6 at level 3, 8 at level 5, 10 at level 11
}

// Paladin resources
export interface PaladinResources {
  layOnHands: { current: number; max: number };
  channelDivinity: { current: number; max: number };
}

// Weapons
export interface Weapon {
  id: string;
  name: string;
  type: 'melee' | 'ranged';
  damageType: 'slashing' | 'piercing' | 'bludgeoning';
  damageDice: string; // e.g., "2d6", "1d8"
  properties: string[];
  equipped: boolean;
  finesse: boolean;
  range?: string;
}

// Death Saves
export interface DeathSaves {
  successes: number; // 0-3
  failures: number;  // 0-3
  stabilized: boolean;
}

// Notes
export interface Note {
  id: string;
  title: string;
  content: string;  // Plain text for v1
  category: 'general' | 'quest' | 'npc' | 'location' | 'lore' | 'combat';
  createdAt: string;  // ISO date string for localStorage
  updatedAt: string;
  pinned: boolean;
}

// Hit Dice
export interface HitDice {
  current: number;  // Remaining hit dice
  max: number;      // Equal to character level
  type: number;     // Die type (10 for Paladin, varies by class)
}

// Rest Resources
export interface RestResources {
  lastShortRest?: string;  // ISO timestamp
  lastLongRest?: string;
}

// Inventory
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  description: string;
  type: 'weapon' | 'armor' | 'equipment' | 'consumable' | 'treasure' | 'other';
  equipped: boolean;
  attuned?: boolean;
  notes?: string;
}

// Currency
export interface Currency {
  platinum: number;
  gold: number;
  silver: number;
  copper: number;
}

export interface Character {
  id: string;
  name: string;
  level: number;
  abilityScores: AbilityScores;
  race: Race | null;
  class: CharacterClass | null;
  createdAt?: Date;
  updatedAt?: Date;
  hitPoints: HitPoints;
  combatStats: CombatStats;
  skills: Record<string, Skill>;
  spellSlots: SpellSlots;
  knownSpells: Spell[];
  preparedSpells: string[];
  classFeatures: ClassFeature[];
  fightingStyle: string;
  paladinResources: PaladinResources;
  classResources: ClassResource[];
  psionicDice?: PsionicDice;
  weapons: Weapon[];
  statusConditions: string[];
  deathSaves: DeathSaves;

  // New fields
  notes: Note[];
  hitDice: HitDice;
  restResources: RestResources;
  inspiration: boolean;

  // Spellcasting ability
  spellcastingAbility?: 'charisma' | 'intelligence' | 'wisdom' | null;
  isWarlock?: boolean;

  // Future: Phase 4
  inventory?: InventoryItem[];
  currency?: Currency;
  cantrips?: string[];
}

export interface APIReference {
  index: string;
  name: string;
  url: string;
}

export interface AbilityBonus {
  ability_score: APIReference;
  bonus: number;
}

export interface Trait {
  index: string;
  name: string;
  url: string;
}

export interface Race {
  index: string;
  name: string;
  speed: number;
  ability_bonuses: AbilityBonus[];
  alignment: string;
  age: string;
  size: string;
  size_description: string;
  starting_proficiencies: APIReference[];
  languages: APIReference[];
  language_desc: string;
  traits: Trait[];
  subraces: APIReference[];
}

export interface CharacterClass {
  index: string;
  name: string;
  hit_die: number;
  proficiencies: APIReference[];
  saving_throws: APIReference[];
  url: string;
}

// API response types for class levels
export interface ClassLevelData {
  level: number;
  ability_score_bonuses: number;
  prof_bonus: number;
  features: APIReference[];
  spellcasting?: {
    cantrips_known?: number;
    spells_known?: number;
    spell_slots_level_1: number;
    spell_slots_level_2: number;
    spell_slots_level_3: number;
    spell_slots_level_4: number;
    spell_slots_level_5: number;
    spell_slots_level_6: number;
    spell_slots_level_7: number;
    spell_slots_level_8: number;
    spell_slots_level_9: number;
  };
  class_specific?: Record<string, any>;
  index: string;
  class: APIReference;
  url: string;
}

export interface FeatureDetails {
  index: string;
  name: string;
  level: number;
  class: APIReference;
  desc: string[];
  url: string;
}

export interface SpellcastingInfo {
  level: number;
  spellcasting_ability: APIReference;
  info: { name: string; desc: string[] }[];
}
