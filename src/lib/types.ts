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

// Spell slots by level
export interface SpellSlots {
  level1: { current: number; max: number };
  level2: { current: number; max: number };
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
  weapons: Weapon[];
  statusConditions: string[];
  deathSaves: DeathSaves;
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
